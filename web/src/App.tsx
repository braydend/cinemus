import { type FC } from "react";
import { Navigation } from "./components/molecules";
import Container from "@mui/material/Container";
import CssBaseline from "@mui/material/CssBaseline";
import { MediaList } from "./components/pages";
import { useAuth } from "./hooks/useAuth";

const App: FC = () => {
  const { isAuthenticated } = useAuth();
  return (
    <>
      <CssBaseline />
      <Container>
        <Navigation />
        {isAuthenticated ? <MediaList /> : <div>Login to use Cinemus</div>}
      </Container>
      <ReactQueryDevtools />
    </>
  );
};

export default App;
