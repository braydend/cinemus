import { type AppType } from "next/app";
import { api } from "~/utils/api";
import "~/styles/globals.css";
import { Navigation } from "~/components/molecules";
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
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

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <UserProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Navigation />
        <div className="p-4">
          <Component {...pageProps} />
        </div>
      </ThemeProvider>
    </UserProvider>
  );
};

export default api.withTRPC(MyApp);
