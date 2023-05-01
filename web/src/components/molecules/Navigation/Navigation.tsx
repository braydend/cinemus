import { type FC, useState } from "react";
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Container,
  Button,
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemButton,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { UserMenu } from "../UserMenu";
import { Link } from "react-router-dom";
import { availableRoutes } from "../../../router";
import couchLogo from "../../../assets/couchLogo.png";
import styles from "./Navigation.module.css";

const pages: Array<{ label: string; route: string }> = [
  { label: "List", route: "/list" },
  { label: "About", route: "/about" },
];

export const Navigation: FC = () => {
  const [isNavigationOpen, setIsNavigationOpen] = useState(false);

  const handleToggleNavigation = (): void => {
    setIsNavigationOpen((prev) => !prev);
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
            <Link to={availableRoutes.root}>
              <img
                src={couchLogo}
                alt="Cinemus logo"
                className={styles.couchLogo}
              />
            </Link>
          </Box>
          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
            {pages.map(({ label, route }) => (
              <Link key={label} to={route}>
                <Button
                  key={label}
                  sx={{ my: 2, color: "white", display: "block" }}
                >
                  {label}
                </Button>
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
              onClick={handleToggleNavigation}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Drawer
              anchor="left"
              open={isNavigationOpen}
              onClose={handleToggleNavigation}
            >
              <List>
                {pages.map(({ label, route }, index) => (
                  <>
                    <Divider />
                    <Link to={route} key={label}>
                      <ListItem
                        onClick={handleToggleNavigation}
                        disablePadding
                        sx={{ width: "200px" }}
                      >
                        <ListItemButton>
                          <Typography textAlign="center">{label}</Typography>
                        </ListItemButton>
                      </ListItem>
                    </Link>
                  </>
                ))}
              </List>
            </Drawer>
          </Box>
          <Box sx={{ display: { xs: "flex", md: "none" }, mr: 2 }}>
            <Link to={availableRoutes.root}>
              <img
                src={couchLogo}
                alt="Cinemus logo"
                className={styles.couchLogo}
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
