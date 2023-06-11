import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { type AppType } from "next/app";
import { api } from "~/utils/api";
import "~/styles/globals.css";
import { Navigation } from "~/components/molecules";
import { ThemeProvider, createTheme } from "@mui/material";
import { UserProvider } from "@auth0/nextjs-auth0/client";

const theme = createTheme({
  palette: {
    primary: {
      main: "#79609f",
    },
    secondary: {
      main: "#ac80b9",
    },
    background: {
      default: "#edf0f2",
    },
  },
});

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <UserProvider>
      <SessionProvider session={session}>
        <ThemeProvider theme={theme}>
          <Navigation />
          <div className="p-4">
            <Component {...pageProps} />
          </div>
        </ThemeProvider>
      </SessionProvider>
    </UserProvider>
  );
};

export default api.withTRPC(MyApp);
