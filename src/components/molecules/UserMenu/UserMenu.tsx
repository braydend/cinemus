import { type FC, type MouseEvent, useState } from "react";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { Button } from "../../atoms";
import { useSession, signOut, signIn } from "next-auth/react";
import Link from "next/link";
import { availableRoutes } from "../../../routes";

export const UserMenu: FC = () => {
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
  const { data: sessionData } = useSession();

  const handleOpenUserMenu = (event: MouseEvent<HTMLElement>): void => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = (): void => {
    setAnchorElUser(null);
  };

  const handleLogin = () => {
    handleCloseUserMenu();
    void signIn();
  };

  const handleLogout = () => {
    handleCloseUserMenu();
    void signOut();
  };

  return Boolean(sessionData) ? (
    <Box sx={{ flexGrow: 0 }}>
      <>
        <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
          <Avatar
            src={sessionData?.user.image ?? ""}
            alt={sessionData?.user.name ?? ""}
          />
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
            <Link href={availableRoutes.user}>
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
    <Button onClick={handleLogin} variant="purple" label="Login" />
  );
};
