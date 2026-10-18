import { GoabButton } from "@abgov/react-components";
import { useNavigate } from "react-router-dom";
import { ErrorLayout } from "./ErrorLayout";

/* Shown for any address the prototype doesn't have a page for. */
export function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <ErrorLayout
      icon="search"
      label="Error 404"
      heading="Page not found"
      description="We can't find the page you're looking for. Check the web address, or go back to the home page."
      action={
        <GoabButton type="primary" size="compact" onClick={() => navigate("/")}>
          Go to home page
        </GoabButton>
      }
    />
  );
}
