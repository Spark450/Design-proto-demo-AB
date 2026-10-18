#!/usr/bin/env bash
#
# Puts a built directory somewhere on the published site.
#
# The site lives on one branch so that several builds can sit side by side: the
# main prototype at the root, previews under preview/, frozen snapshots under
# v/. That means a publish can never just replace the branch — it has to change
# its own corner and leave everyone else's alone.
#
# Driven entirely by environment variables so the action, and the tests, call it
# the same way:
#
#   REMOTE       git URL to publish to
#   BRANCH       branch the site is served from
#   SOURCE       directory of built files (not needed when removing)
#   DESTINATION  where it goes, no leading or trailing slash; empty means root
#   REMOVE       "true" to delete DESTINATION instead of publishing to it
#   ENTRY        JSON describing this version for versions.json, optional
#   MESSAGE      commit message
#   ACTION_PATH  directory holding render-versions.mjs

set -euo pipefail

: "${REMOTE:?No remote given.}"
: "${MESSAGE:?No commit message given.}"
BRANCH="${BRANCH:-gh-pages}"
SOURCE="${SOURCE:-}"
DESTINATION="${DESTINATION:-}"
REMOVE="${REMOVE:-false}"
ENTRY="${ENTRY:-}"
ACTION_PATH="${ACTION_PATH:-$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)}"

if [ "$REMOVE" = "true" ]; then
  if [ -z "$DESTINATION" ]; then
    echo "::error::Refusing to remove the site root."
    exit 1
  fi
  staged=""
else
  [ -n "$SOURCE" ] || { echo "::error::No source directory given."; exit 1; }
  # Copy the built files aside before cloning: the clone becomes the working
  # directory, and the build lives in the one we are standing in.
  staged="$(mktemp -d)"
  cp -R "$SOURCE"/. "$staged"/
fi

work="$(mktemp -d)"
fresh_branch=false
if git clone --depth 1 --branch "$BRANCH" "$REMOTE" "$work" 2>/dev/null; then
  :
else
  echo "No $BRANCH branch yet — starting one."
  git clone --depth 1 "$REMOTE" "$work" 2>/dev/null || git init -q "$work"
  git -C "$work" checkout -q --orphan "$BRANCH"
  git -C "$work" rm -rfq --cached . 2>/dev/null || true
  find "$work" -mindepth 1 -maxdepth 1 -not -name .git -exec rm -rf {} +
  git -C "$work" remote add origin "$REMOTE" 2>/dev/null || true
  fresh_branch=true
fi

cd "$work"
git config user.name "github-actions[bot]"
git config user.email "41898282+github-actions[bot]@users.noreply.github.com"

# Everything this publish changes, applied to whatever is on the branch right
# now. Re-run verbatim on a retry, so a publish that lands in the meantime is
# built on rather than flattened.
apply_changes() {
  if [ "$REMOVE" = "true" ]; then
    rm -rf "./${DESTINATION:?}"
    echo "Removed /$DESTINATION/"
  elif [ -n "$DESTINATION" ]; then
    rm -rf "./${DESTINATION:?}"
    mkdir -p "./$DESTINATION"
    cp -R "$staged"/. "./$DESTINATION"/
    echo "Published to /$DESTINATION/"
  else
    # Replacing the main build must not take the previews and snapshots with
    # it, so clear only what sits at the top level and leave the directories
    # other builds live in alone.
    find . -mindepth 1 -maxdepth 1 \
      -not -name .git -not -name preview -not -name v -not -name versions.json \
      -exec rm -rf {} +
    cp -R "$staged"/. ./
    echo "Published to the site root"
  fi

  # Jekyll would otherwise skip files and directories beginning with an
  # underscore, which a bundler is free to produce.
  touch .nojekyll

  if [ -n "$ENTRY" ]; then
    node "$ACTION_PATH/render-versions.mjs" . "$ENTRY"
  else
    node "$ACTION_PATH/render-versions.mjs" .
  fi
}

# Four workflows write this branch and no longer queue behind a shared
# concurrency group, so two publishes can be in flight at once. Losing the race
# is ordinary rather than exceptional: fetch the branch again, rebuild the change
# on top of whatever landed first, and try again.
for attempt in 1 2 3 4 5; do
  if [ "$attempt" -gt 1 ]; then
    echo "Push rejected — rebuilding on top of the latest $BRANCH (attempt $attempt)."
    git fetch -q origin "$BRANCH"
    git reset -q --hard "origin/$BRANCH"
    git clean -qfd
  fi

  apply_changes

  if [ -z "$(git status --porcelain)" ]; then
    echo "Nothing changed."
    exit 0
  fi

  git add -A
  git commit -q -m "$MESSAGE"

  if [ "$fresh_branch" = true ] && [ "$attempt" -eq 1 ]; then
    if git push -q --set-upstream origin "$BRANCH"; then
      echo "Pushed to $BRANCH."
      exit 0
    fi
  elif git push -q origin "$BRANCH"; then
    echo "Pushed to $BRANCH."
    exit 0
  fi

  fresh_branch=false
  sleep $(( attempt * 3 ))
done

echo "::error::Could not push to $BRANCH after 5 attempts."
exit 1
