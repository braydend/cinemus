import { Navigate, type RouteObject } from "react-router-dom";
import { BaseLayout } from "../components/layouts";
import { About, Home, MediaList, UserPage } from "../components/pages";
import { type FC } from "react";
import { availableRoutes } from "./routes";
import { useAuth } from "../hooks/useAuth";

const ProtectedRoute: FC<{ children: JSX.Element }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
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
      {
        path: availableRoutes.user,
        element: (
          <ProtectedRoute>
            <UserPage />
          </ProtectedRoute>
        ),
      },
    ],
  },
];
