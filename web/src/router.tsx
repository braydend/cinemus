import { Navigate, type RouteObject } from "react-router-dom";
import { BaseLayout } from "./components/layouts";
import { MediaList } from "./components/pages";
import { type FC } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { About } from "./components/pages/About";

const ProtectedRoute: FC<{ children: JSX.Element }> = ({ children }) => {
  const { isAuthenticated } = useAuth0();
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export enum route {
  list = "/list",
  about = "/about",
  root = "/",
}

export const routes: RouteObject[] = [
  {
    path: route.root,
    element: <BaseLayout />,
    children: [
      {
        path: route.list,
        element: (
          <ProtectedRoute>
            <MediaList />
          </ProtectedRoute>
        ),
      },
      {
        path: route.about,
        element: <About />,
      },
    ],
  },
];
