/* The citizen start page, following the design system's start page pattern:
 * a heading, a short intro and a start button. Swap the words for your
 * service's own. */

import { useNavigate } from "react-router-dom";
import { GoabButton, GoabText } from "@abgov/react-components";
import { prototypeName } from "../shared/prototype";

export function StartPage() {
  const navigate = useNavigate();

  return (
    <>
      <GoabText tag="h1" size="heading-xl" mt="none" mb="l">
        {prototypeName}
      </GoabText>
      <GoabText size="body-l" mt="none" mb="none">
        A short overview of the service. One or two sentences that help people
        understand what it is and whether it's for them.
      </GoabText>
      <GoabText size="body-m" mt="l" mb="none">
        It takes about 5 minutes. You'll answer 4 questions, then check your answers before you submit.
      </GoabText>
      <GoabButton type="start" mt="2xl" onClick={() => navigate("/apply/name")}>
        Start now
      </GoabButton>
    </>
  );
}
