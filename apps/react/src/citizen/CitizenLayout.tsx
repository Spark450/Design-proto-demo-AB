/* The citizen side of the prototype: a public page with the standard GoA
 * header and footer, laid out with the design system's one-column layout.
 *
 * The header shows a "Prototype" badge so nobody mistakes it for a live
 * service. Its alberta.ca logo links to the real alberta.ca, as on any GoA
 * service.
 */

import { Outlet } from "react-router-dom";
import {
  GoabAppFooter,
  GoabAppHeader,
  GoabBadge,
  GoabOneColumnLayout,
  GoabPageBlock,
} from "@abgov/react-components";

import { prototypeName } from "../shared/prototype";
import { VersionBanner } from "../shared/VersionBanner";
import { AnswersProvider } from "./answers";
import "./citizen.css";

const CONTENT_WIDTH = "1232px";

export function CitizenLayout() {
  return (
    <GoabOneColumnLayout>
      <section slot="header">
        <GoabAppHeader
          url="https://www.alberta.ca"
          heading={prototypeName}
          maxContentWidth={CONTENT_WIDTH}
          phase={<GoabBadge type="important" content="Prototype" />}
        />
      </section>

      <GoabPageBlock width={CONTENT_WIDTH}>
        {/* The layout puts no space under the header, so the page would
            otherwise start flush against it. */}
        <main className="page-body">
          <VersionBanner />
          <AnswersProvider>
            <Outlet />
          </AnswersProvider>
        </main>
      </GoabPageBlock>

      <section slot="footer">
        <GoabAppFooter maxContentWidth={CONTENT_WIDTH} />
      </section>
    </GoabOneColumnLayout>
  );
}
