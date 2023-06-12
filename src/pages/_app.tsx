import { type AppType } from "next/app";
import { api } from "~/utils/api";
import "~/styles/globals.css";
import { Navigation } from "~/components/molecules";
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import { UserProvider } from "@auth0/nextjs-auth0/client";
import { SnackbarProvider } from "notistack";

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

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <UserProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Navigation />
        <SnackbarProvider maxSnack={3}>
          <div className="p-4">
            <Component {...pageProps} />
          </div>
        </SnackbarProvider>
      </ThemeProvider>
    </UserProvider>
  );
};

export default api.withTRPC(MyApp);
