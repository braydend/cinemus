import { type FC, type MouseEvent, useState } from "react";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { Button } from "../../atoms";
import Link from "next/link";
import { availableRoutes } from "../../../routes";
import { useUser } from "@auth0/nextjs-auth0/client";

export const UserMenu: FC = () => {
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
  const { user } = useUser();

  const handleOpenUserMenu = (event: MouseEvent<HTMLElement>): void => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = (): void => {
    setAnchorElUser(null);
  };
  return Boolean(user) ? (
    <Box sx={{ flexGrow: 0 }}>
      <>
        <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
          <Avatar src={user?.picture ?? ""} alt={user?.name ?? ""} />
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
          <MenuItem>
            <Link href={availableRoutes.logout}>
              <Typography textAlign="center">Logout</Typography>
            </Link>
          </MenuItem>
        </Menu>
      </>
    </Box>
  ) : (
    <Link href={availableRoutes.login}>
      <Button onClick={() => null} variant="purple" label="Login" />
    </Link>
  );
};
