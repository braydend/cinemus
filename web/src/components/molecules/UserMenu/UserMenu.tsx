import { type FC, type MouseEvent, useState } from "react";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { Link } from "react-router-dom";
import { availableRoutes } from "../../../router";
import { useAuth } from "../../../hooks/useAuth";
import { Button } from "../../atoms";

export const UserMenu: FC = () => {
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
  const { user, isAuthenticated, loginWithRedirect, logout } = useAuth();

  const handleOpenUserMenu = (event: MouseEvent<HTMLElement>): void => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = (): void => {
    setAnchorElUser(null);
  };

  const handleLogout = (): void => {
    logout();
    handleCloseUserMenu();
  };
  return isAuthenticated ? (
    <Box sx={{ flexGrow: 0 }}>
      <>
        <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
          <Avatar src={user?.picture} alt={user?.name} />
        </IconButton>
        <Menu
          sx={{ mt: "45px" }}
          id="menu-appbar"
          anchorEl={anchorElUser}
          anchorOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          keepMounted
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          open={Boolean(anchorElUser)}
          onClose={handleCloseUserMenu}
        >
          <MenuItem onClick={handleCloseUserMenu}>
            <Link to={availableRoutes.user}>
              <Typography textAlign="center">Preferences</Typography>
            </Link>
          </MenuItem>
          <MenuItem onClick={handleLogout}>
            <Typography textAlign="center">Logout</Typography>
          </MenuItem>
        </Menu>
      </>
    </Box>
  ) : (
    <Button
      onClick={() => {
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        loginWithRedirect();
      }}
      variant="yellow"
      label="Login"
    />
  );
};
