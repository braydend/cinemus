import { type FC } from "react";
import Container from "@mui/material/Container";
import { Navigation } from "../molecules";
import { Outlet } from "react-router-dom";
import Box from "@mui/material/Box";

export const BaseLayout: FC = () => {
  return (
    <Container>
      <Navigation />
      <Box padding={"1rem"}>
        <Outlet />
      </Box>
    </Container>
  );
};
