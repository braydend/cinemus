import "./App.css";
import { type FC } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { Navigation, MediaList } from "./components/molecules";
import Container from "@mui/material/Container";
import CssBaseline from "@mui/material/CssBaseline";

const App: FC = () => {
  const { isAuthenticated } = useAuth0();
  return (
    <>
      <CssBaseline />
      <Container>
        <Navigation />
        {isAuthenticated ? <MediaList /> : <div>Login to use Cinemus</div>}
      </Container>
    </>
  );
};

export default App;
