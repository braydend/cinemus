import { type FC, type ReactNode } from "react";
import * as Sentry from "@sentry/react";
import { Heading } from "../../atoms";

interface Props {
  children: ReactNode;
}

const Error: FC = () => (
  <div>
    <Heading level={"1"}>Oh no!</Heading>
    <p>An error has occurred. We are looking into a fix!</p>
    <a href="/">Back to home</a>
  </div>
);

export const DefaultErrorBoundary: FC<Props> = ({ children }) => {
  return (
    <Sentry.ErrorBoundary fallback={<Error />}>{children}</Sentry.ErrorBoundary>
  );
};
