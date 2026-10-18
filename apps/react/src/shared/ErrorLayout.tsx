/* The shared shape of every error page: an icon in a circle, a small label, an
 * underline, a heading, a sentence or two and one action. Built from the design
 * system's error page pattern (design.alberta.ca, Examples > Error pages).
 *
 * It doesn't depend on either surface's layout, so it still works if the worker
 * or citizen side has been removed.
 */

import { ReactNode } from "react";
import { GoabIcon, GoabText } from "@abgov/react-components";
import type { GoabIconType } from "@abgov/ui-components-common";
import { usePageTitleSize } from "./usePageTitleSize";
import "./ErrorPage.css";

interface ErrorLayoutProps {
  icon: GoabIconType;
  label: string;
  heading: string;
  description: string;
  action: ReactNode;
}

export function ErrorLayout({ icon, label, heading, description, action }: ErrorLayoutProps) {
  const titleSize = usePageTitleSize();

  return (
    <main className="error-page">
      <div className="error-page-content">
        <div className="error-page-icon-wrapper">
          <GoabIcon type={icon} size="xlarge" />
        </div>
        <GoabText size="body-m" mt="m" mb="none" color="secondary">
          {label}
        </GoabText>
        <div className="error-page-underline" aria-hidden="true" />
        <GoabText tag="h1" size={titleSize} mt="xl" mb="none">
          {heading}
        </GoabText>
        <div className="error-page-description">
          <GoabText size="body-m" mt="l" mb="none">
            {description}
          </GoabText>
        </div>
        <div style={{ marginTop: "var(--goa-space-xl)" }}>{action}</div>
      </div>
    </main>
  );
}
