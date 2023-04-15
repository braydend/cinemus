import { PlaylistAdd, PlaylistAddCheck, Search } from "@mui/icons-material";

export const features = [
  {
    title: "Create personalised lists",
    body: "Easily create customized lists of TV shows and movies that you want to watch. You can categorize your lists based on genres, streaming services, or any other criteria that suits your preferences.",
    icon: <PlaylistAdd fontSize={"large"} />,
  },
  {
    title: "Track your progress",
    body: "Keep track of the TV shows and movies you've watched by marking them as watched or not watched. Cinemus remembers your progress, so you can easily see what you've already seen.",
    icon: <PlaylistAddCheck fontSize={"large"} />,
  },
  {
    title: "Discover Streaming Availability",
    body: "Find out which streaming services in your region have the TV shows and movies on your watchlist available. Cinemus provides information on streaming availability, so you can easily find where to watch your favorite shows and movies.",
    icon: <Search fontSize={"large"} />,
  },
];
