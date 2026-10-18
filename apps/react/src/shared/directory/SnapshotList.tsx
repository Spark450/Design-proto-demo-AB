/* The list of snapshots on the directory page. It only draws what it's given,
   so the tests can check every state without fetching anything. */

import { GoabBlock, GoabText } from "@abgov/react-components";
import { formatDate } from "../formatDate";
import { snapshotUrl, type SnapshotsState } from "./snapshots";

interface SnapshotListProps {
  state: SnapshotsState;
  siteRoot: string;
}

export function SnapshotList({ state, siteRoot }: SnapshotListProps) {
  switch (state.status) {
    case "local":
      return (
        <GoabText size="body-m" mt="none" mb="none">
          Snapshots show here once the prototype is published. You're running it on
          your own computer, so there aren't any yet.
        </GoabText>
      );
    case "loading":
      return (
        <GoabText size="body-m" mt="none" mb="none">
          Loading snapshots…
        </GoabText>
      );
    case "failed":
      return (
        <GoabText size="body-m" mt="none" mb="none">
          We couldn't load the list of snapshots here. Use the link below to see them.
        </GoabText>
      );
    case "ready":
      if (state.snapshots.length === 0) {
        return (
          <GoabText size="body-m" mt="none" mb="none">
            There aren't any snapshots yet. One is taken each time a change is merged.
          </GoabText>
        );
      }
      return (
        <ul className="directory__snapshots">
          {state.snapshots.map((snapshot) => (
            <li key={snapshot.slug}>
              <GoabBlock direction="column" gap="3xs" width="100%">
                <GoabText size="body-s" mt="none" mb="none">
                  <a href={snapshotUrl(siteRoot, snapshot.slug)}>{snapshot.slug}</a>
                </GoabText>
                {snapshot.note && (
                  <GoabText size="body-s" mt="none" mb="none">
                    {snapshot.note}
                  </GoabText>
                )}
                {snapshot.created && (
                  <GoabText size="body-xs" color="secondary" mt="none" mb="none">
                    {formatDate(snapshot.created)}
                  </GoabText>
                )}
              </GoabBlock>
            </li>
          ))}
        </ul>
      );
  }
}
