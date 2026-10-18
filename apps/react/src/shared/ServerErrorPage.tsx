import { GoabButton } from "@abgov/react-components";
import { useNavigate } from "react-router-dom";
import { ErrorLayout } from "./ErrorLayout";

/* There is no server behind a prototype, so nothing sends people here on its
 * own. It lives at /error so you can link to it when you want to show what
 * happens when something goes wrong. */
export function ServerErrorPage() {
  const navigate = useNavigate();

  return (
    <ErrorLayout
      icon="warning"
      label="Error 500"
      heading="We are having a problem"
      description="We can't load this page right now. Try again in a few minutes."
      action={
        <GoabButton type="primary" size="compact" onClick={() => navigate("/")}>
          Go to home page
        </GoabButton>
      }
    />
  );
}
