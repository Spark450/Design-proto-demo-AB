/* Task and step page titles are heading-l, and heading-m on a phone (see the
 * visual-design skill). The design system's type tokens don't shrink on their
 * own, so this picks the size from the window width. */

import { useEffect, useState } from "react";

const PHONE = "(max-width: 623px)";

function isPhone() {
  return typeof window !== "undefined" && window.matchMedia?.(PHONE).matches === true;
}

export function usePageTitleSize(): "heading-l" | "heading-m" {
  const [phone, setPhone] = useState(isPhone);

  useEffect(() => {
    const query = window.matchMedia?.(PHONE);
    if (!query) return;
    const update = () => setPhone(query.matches);
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  return phone ? "heading-m" : "heading-l";
}
