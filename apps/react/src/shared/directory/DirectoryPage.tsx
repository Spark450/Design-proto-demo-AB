/* The front page of the prototype, at the site root.
 *
 * It lists every page on each side and the published snapshots, so someone
 * given the address can find their way around without already knowing what's
 * in here. It also says whether they're looking at the current prototype, a
 * preview of a branch, or a frozen snapshot.
 *
 * The pages come from each side's screens list in its routes.tsx, the same
 * list the prototype controls use. App.tsx passes them in, so a page added
 * there shows up here too.
 */

import { Link } from "react-router-dom";
import {
  GoabBlock,
  GoabCallout,
  GoabContainer,
  GoabGrid,
  GoabText,
} from "@abgov/react-components";

import { prototypeName } from "../prototype";
import { VersionBanner } from "../VersionBanner";
import { versionsUrl } from "../version";
import type { ControlSide } from "../controls/types";
import { SnapshotList } from "./SnapshotList";
import { siteRoot, useSnapshots } from "./snapshots";
import "./directory.css";

export function DirectoryPage({ sides }: { sides: ControlSide[] }) {
  const snapshots = useSnapshots();

  return (
    <main className="directory">
      <VersionBanner />

      <GoabText tag="h1" size="heading-xl" mt="none" mb="m">
        {prototypeName}
      </GoabText>
      <GoabText size="body-l" mt="none" mb="l">
        A prototype for trying out a service before it's built. Choose where to start.
      </GoabText>

      <GoabCallout type="important" mt="none" mb="2xl">
        Nothing here is real. It isn't connected to any government system, nothing you
        type is kept, and no decision made in it counts.
      </GoabCallout>

      <GoabText tag="h2" size="heading-s" mt="none" mb="m">
        Pages
      </GoabText>
      <GoabGrid minChildWidth="18rem" gap="l">
        {sides.map((side) => (
          <GoabContainer key={side.name} type="non-interactive" accent="thin" mt="none" mb="none">
            <GoabBlock direction="column" gap="l" width="100%">
              <GoabBlock direction="column" gap="xs" width="100%">
                <GoabText tag="h3" size="heading-xs" mt="none" mb="none">
                  <Link to={side.home}>{side.name}</Link>
                </GoabText>
                {side.description && (
                  <GoabText size="body-s" mt="none" mb="none">
                    {side.description}
                  </GoabText>
                )}
              </GoabBlock>
              <GoabBlock direction="column" gap="m" width="100%">
                {side.sections.map((section) => (
                  <section key={section.heading}>
                    <GoabBlock direction="column" gap="xs" width="100%">
                      <GoabText tag="h4" size="heading-2xs" color="secondary" mt="none" mb="none">
                        {section.heading}
                      </GoabText>
                      <ul className="directory__links">
                        {section.pages.map((page) => (
                          <li key={page.path}>
                            <GoabText size="body-s" mt="none" mb="none">
                              <Link to={page.path}>{page.label}</Link>
                            </GoabText>
                          </li>
                        ))}
                      </ul>
                    </GoabBlock>
                  </section>
                ))}
              </GoabBlock>
            </GoabBlock>
          </GoabContainer>
        ))}
      </GoabGrid>

      <GoabText tag="h2" size="heading-s" mt="2xl" mb="xs">
        Snapshots
      </GoabText>
      <GoabText size="body-m" mt="none" mb="m">
        Frozen copies of the prototype as it was on the day each one was taken. They
        don't change, so they're safe to share after a research session or a demo.
      </GoabText>
      <SnapshotList state={snapshots} siteRoot={siteRoot} />
      {snapshots.status !== "local" && (
        <GoabText size="body-m" mt="m" mb="none">
          <a href={versionsUrl}>See every version, including work still in progress</a>
        </GoabText>
      )}
    </main>
  );
}
