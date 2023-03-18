import "./App.css";
import { Profile } from "./components/Profile/Profile";
import { MediaList } from "./components/MediaList/MediaList";
import { type FC } from "react";

const App: FC = () => {
  return (
    <div>
      <Profile />
      <MediaList />
    </div>
  );
};

export default App;
