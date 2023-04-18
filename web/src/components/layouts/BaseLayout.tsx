import { type FC } from "react";
import CssBaseline from "@mui/material/CssBaseline";
import Container from "@mui/material/Container";
import { Navigation } from "../molecules";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Outlet } from "react-router-dom";
import Box from "@mui/material/Box";

export const BaseLayout: FC = () => {
  return (
    <>
      <CssBaseline />
      <Container>
        <Navigation />
        <Box padding={"1rem"}>
          <Outlet />
        </Box>
      </Container>
      <ReactQueryDevtools />
    </>
  );
};
