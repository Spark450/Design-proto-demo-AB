/* Says which copy of the prototype someone is looking at.
 *
 * A preview link sent a fortnight ago looks exactly like the current prototype.
 * On the main build (and when running locally) this renders nothing, so it stays
 * out of the way. On a preview or a snapshot it says so, and links to the list of
 * every published version. See version.ts for how the build works this out.
 */

import { GoabCallout } from "@abgov/react-components";
import { describeVersion, siteVersion, versionsUrl, type SiteVersion } from "./version";

interface VersionBannerProps {
  version?: SiteVersion;
}

export function VersionBanner({ version = siteVersion }: VersionBannerProps) {
  const description = describeVersion(version);
  if (!description) return null;

  return (
    <GoabCallout
      type="information"
      heading="This isn't the current version"
      mt="none"
      mb="l"
    >
      {description} <a href={versionsUrl}>See all versions</a>
    </GoabCallout>
  );
}
