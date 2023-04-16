import { Navigate, type RouteObject } from "react-router-dom";
import { BaseLayout } from "../components/layouts";
import { MediaList } from "../components/pages";
import { type FC } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { About } from "../components/pages/About";
import { availableRoutes } from "./routes";
import { Home } from "../components/pages/Home";

const ProtectedRoute: FC<{ children: JSX.Element }> = ({ children }) => {
  const { isAuthenticated } = useAuth0();
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export const routes: RouteObject[] = [
  {
    path: availableRoutes.root,
    element: <BaseLayout />,
    children: [
      {
        path: availableRoutes.root,
        element: <Home />,
      },
      {
        path: availableRoutes.list,
        element: (
          <ProtectedRoute>
            <MediaList />
          </ProtectedRoute>
        ),
      },
      {
        path: availableRoutes.about,
        element: <About />,
      },
    ],
  },
];
