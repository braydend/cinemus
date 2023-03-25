import "./App.css";
import { Profile } from "./components/Profile/Profile";
import { MediaList } from "./components/MediaList/MediaList";
import { type FC } from "react";

const App: FC = () => {
  return (
    <div>
      <h1>Cinemus</h1>
      <Profile />
      <MediaList />
    </div>
  );
};

export default App;
