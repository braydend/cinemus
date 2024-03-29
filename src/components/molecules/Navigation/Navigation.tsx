import { type FC, useState } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import { UserMenu } from "~/components/molecules";
import { availableRoutes } from "~/routes";
import couchLogo from "~/assets/couchLogo.png";
import textLogo from "~/assets/textLogo.png";
import { Button } from "~/components/atoms";
import {
  Divider,
  List,
  ListItem,
  ListItemButton,
  SwipeableDrawer,
} from "@mui/material";
import Link from "next/link";
import Image from "next/image";

const pages: Array<{ label: string; route: string }> = [
  { label: "List", route: "/list" },
  { label: "About", route: "/about" },
];

export const Navigation: FC = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handleOpenNavMenu = (): void => {
    setIsDrawerOpen(true);
  };

  const handleCloseNavMenu = (): void => {
    setIsDrawerOpen(false);
  };

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar
          disableGutters
          sx={{
            display: { xs: "grid", md: "flex" },
            gridTemplateColumns: { xs: "1fr 2fr 1fr" },
            placeItems: { xs: "center" },
          }}
        >
          {/* Desktop */}
          <Box
            sx={{
              display: { xs: "none", md: "flex" },
            }}
          >
            <Link href={availableRoutes.root}>
              <Image
                src={couchLogo}
                alt="Cinemus logo"
                className="h-12 w-auto"
              />
            </Link>
          </Box>
          <Box
            sx={{
              flexGrow: 1,
              display: { xs: "none", md: "flex" },
              ml: "1.5rem",
              gap: "1rem",
            }}
          >
            {pages.map(({ label, route }) => (
              <Link key={label} href={route}>
                <Button
                  variant={"purple"}
                  onClick={handleCloseNavMenu}
                  label={label}
                />
              </Link>
            ))}
          </Box>
          {/* Mobile */}
          <Box
            sx={{
              display: { md: "none" },
              placeSelf: "start",
              alignSelf: "center",
            }}
          >
            <IconButton
              size="large"
              aria-label="navigation menu"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <SwipeableDrawer
              anchor="left"
              open={isDrawerOpen}
              onClose={handleCloseNavMenu}
              onOpen={handleOpenNavMenu}
            >
              <List
                sx={{
                  width: "10rem",
                  backgroundColor: "var(--backgroundColour)",
                  height: "100%",
                }}
              >
                <Image
                  src={textLogo}
                  alt="Cinemus"
                  width="150"
                  height="40"
                  className="w-full"
                />
                <Divider sx={{ borderColor: "var(--palePurple)" }} />
                {pages.map(({ label, route }) => (
                  <>
                    <Link href={route} key={label} onClick={handleCloseNavMenu}>
                      <ListItem disablePadding>
                        <ListItemButton>
                          <span className="p-2 font-raleway text-cinemus-purple">
                            {label}
                          </span>
                        </ListItemButton>
                      </ListItem>
                    </Link>
                  </>
                ))}
              </List>
            </SwipeableDrawer>
          </Box>
          <Box sx={{ display: { xs: "flex", md: "none" }, mr: 2 }}>
            <Link href={availableRoutes.root}>
              <Image
                src={couchLogo}
                alt="Cinemus logo"
                className="h-12 w-auto"
              />
            </Link>
          </Box>
          <Box sx={{ placeSelf: "end", alignSelf: "center" }}>
            <UserMenu />
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};
