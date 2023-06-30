import { type AppType } from "next/app";
import { api } from "~/utils/api";
import "~/styles/globals.css";
import { Navigation } from "~/components/molecules";
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import { SessionProvider } from "next-auth/react";
import { SnackbarProvider } from "notistack";
import { Session } from "next-auth";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

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
    <SessionProvider session={session}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Navigation />
        <SnackbarProvider maxSnack={3}>
          <div className="p-4">
            <Component {...pageProps} />
          </div>
          <ReactQueryDevtools initialIsOpen={false} />
        </SnackbarProvider>
      </ThemeProvider>
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
