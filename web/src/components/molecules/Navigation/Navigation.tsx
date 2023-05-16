import { type FC, type MouseEvent, useState } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import MenuItem from "@mui/material/MenuItem";
import { UserMenu } from "../UserMenu";
import { Link } from "react-router-dom";
import { availableRoutes } from "../../../router";
import couchLogo from "../../../assets/couchLogo.png";
import styles from "./Navigation.module.css";
import { Button } from "../../atoms";

const pages: Array<{ label: string; route: string }> = [
  { label: "List", route: "/list" },
  { label: "About", route: "/about" },
];

export const Navigation: FC = () => {
  const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);

  const handleOpenNavMenu = (event: MouseEvent<HTMLElement>): void => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = (): void => {
    setAnchorElNav(null);
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
          <Box
            sx={{
              flexGrow: 1,
              display: { xs: "none", md: "flex" },
              ml: "1.5rem",
              gap: "1rem",
            }}
          >
            {pages.map(({ label, route }) => (
              <Link key={label} to={route} className={styles.link}>
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
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: "block", md: "none" },
              }}
            >
              {pages.map(({ label, route }) => (
                <Link to={route} key={label} className={styles.link}>
                  <MenuItem onClick={handleCloseNavMenu}>
                    <Typography textAlign="center">{label}</Typography>
                  </MenuItem>
                </Link>
              ))}
            </Menu>
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
