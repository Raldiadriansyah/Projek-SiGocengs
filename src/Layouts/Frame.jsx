import * as React from "react";
import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import CssBaseline from "@mui/material/CssBaseline";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import HomeIcon from "@mui/icons-material/Home";
import LiveHelpIcon from "@mui/icons-material/LiveHelp";
import AddCommentIcon from "@mui/icons-material/AddComment";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import InfoIcon from "@mui/icons-material/Info";
import SourceIcon from "@mui/icons-material/Source";
import { Link, Links, useLocation } from "react-router-dom";
import {
  ExpandLess,
  ExpandMore,
  Logout,
  PersonAdd,
  Settings,
} from "@mui/icons-material";
import { Avatar, Collapse, Menu, MenuItem, Tooltip } from "@mui/material";

const drawerWidth = 240;

const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })(
  ({ theme }) => ({
    flexGrow: 1,
    padding: theme.spacing(1),
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: `-${drawerWidth}px`,
    variants: [
      {
        props: ({ open }) => open,
        style: {
          transition: theme.transitions.create("margin", {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
          }),
          marginLeft: 0,
        },
      },
    ],
  })
);

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme }) => ({
  transition: theme.transitions.create(["margin", "width"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  variants: [
    {
      props: ({ open }) => open,
      style: {
        width: `calc(100% - ${drawerWidth}px)`,
        marginLeft: `${drawerWidth}px`,
        transition: theme.transitions.create(["margin", "width"], {
          easing: theme.transitions.easing.easeOut,
          duration: theme.transitions.duration.enteringScreen,
        }),
      },
    },
  ],
}));

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: "flex-end",
}));

export default function Frame(children) {
  const theme = useTheme();
  const [open, setOpen] = React.useState(true);
  const location = useLocation();
  const [Inventory, setInventory] = React.useState(false);

  const [anchorEl, setAnchorEl] = React.useState(null);
  const profile = Boolean(anchorEl);
  const handleOpenProfile = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleCloseProfile = () => {
    setAnchorEl(null);
  };

  const handleClick = () => {
    setInventory(!Inventory);
  };

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar position="fixed" open={open}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={[
              {
                mr: 2,
              },
              open && { display: "none" },
            ]}
          >
            <MenuIcon />
          </IconButton>
          <div className="flex flex-row justify-between w-full items-center">
          <Typography variant="h6" noWrap component="div">
            Si Gocengs
          </Typography>
          <React.Fragment>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                textAlign: "center",
              }}
            >
              <Tooltip title="Account settings">
                <IconButton
                  onClick={handleOpenProfile}
                  size="small"
                  sx={{ ml: 2 }}
                  aria-controls={open ? "account-menu" : undefined}
                  aria-haspopup="true"
                  aria-expanded={open ? "true" : undefined}
                >
                  <Avatar sx={{ width: 32, height: 32 }}>M</Avatar>
                </IconButton>
              </Tooltip>
            </Box>
            <Menu
              anchorEl={anchorEl}
              id="account-menu"
              open={profile}
              onClose={handleCloseProfile}
              onClick={handleCloseProfile}
              PaperProps={{
                  elevation: 0,
                  sx: {
                    overflow: "visible",
                    filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                    mt: 1.5,
                    "& .MuiAvatar-root": {
                      width: 32,
                      height: 32,
                      ml: -0.5,
                      mr: 1,
                    },
                    "&::before": {
                      content: '""',
                      display: "block",
                      position: "absolute",
                      top: 0,
                      right: 14,
                      width: 10,
                      height: 10,
                      bgcolor: "background.paper",
                      transform: "translateY(-50%) rotate(45deg)",
                      zIndex: 0,
                    },
                  },
              }}
              transformOrigin={{ horizontal: "right", vertical: "top" }}
              anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
            >
              <Link to={"/Profile"} >
              <MenuItem onClick={handleCloseProfile}>
                <Avatar /> Profile
              </MenuItem>
              </Link>
              <Divider />
              <MenuItem onClick={handleCloseProfile}>
                <ListItemIcon>
                  <Settings fontSize="small" />
                </ListItemIcon>
                Settings
              </MenuItem>
              <MenuItem onClick={handleCloseProfile}>
                <ListItemIcon>
                  <Logout fontSize="small" />
                </ListItemIcon>
                Logout
              </MenuItem>
            </Menu>
          </React.Fragment>
          </div>
        </Toolbar>
      </AppBar>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
        variant="persistent"
        anchor="left"
        open={open}
      >
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === "ltr" ? (
              <ChevronLeftIcon />
            ) : (
              <ChevronRightIcon />
            )}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List>
          <ListItemButton onClick={handleClick} sx={{ color: "black" }}>
            <ListItemIcon sx={{ color: "black" }}>
              <InboxIcon />
            </ListItemIcon>
            <ListItemText primary="Menu Utama" />
            {Inventory ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
          <Collapse in={Inventory} timeout="auto" unmountOnExit>
            <Link to={"/Admin"}>
              <ListItem disablePadding>
                <ListItemButton
                  sx={{
                    color: `${location.pathname === "/" ? "#646cff" : "black"}`,
                    backgroundColor: `${
                      location.pathname === "/" ? "#dbdbdb" : ""
                    }`,
                    paddingLeft: 4,
                  }}
                >
                  <ListItemIcon
                    sx={{
                      color: `${location.pathname === "/" ? "#646cff" : "black"}`,
                    }}
                  >
                    <HomeIcon />
                  </ListItemIcon>
                  <ListItemText>Dashboard</ListItemText>
                </ListItemButton>
              </ListItem>
            </Link>
            <Divider />
            <Link to={"/Informasi"}>
              <ListItem disablePadding>
                <ListItemButton
                  sx={{
                    color: `${
                      location.pathname === "/Informasi" ? "#646cff" : "black"
                    }`,
                    backgroundColor: `${
                      location.pathname === "/Informasi" ? "#dbdbdb" : ""
                    }`,
                    paddingLeft: 4,
                  }}
                >
                  <ListItemIcon
                    sx={{
                      color: `${
                        location.pathname === "/Informasi" ? "#646cff" : "black"
                      }`,
                    }}
                  >
                    <InfoIcon />
                  </ListItemIcon>
                  <ListItemText>Informasi</ListItemText>
                </ListItemButton>
              </ListItem>
            </Link>
            <Divider />
            <Link to={"/FAQ"}>
              <ListItem disablePadding>
                <ListItemButton
                  sx={{
                    color: `${location.pathname === "/FAQ" ? "#646cff" : "black"}`,
                    backgroundColor: `${
                      location.pathname === "/FAQ" ? "#dbdbdb" : ""
                    }`,
                    paddingLeft: 4,
                  }}
                >
                  <ListItemIcon
                    sx={{
                      color: `${
                        location.pathname === "/FAQ" ? "#646cff" : "black"
                      }`,
                    }}
                  >
                    <LiveHelpIcon />
                  </ListItemIcon>
                  <ListItemText>FAQ</ListItemText>
                </ListItemButton>
              </ListItem>
            </Link>
            <Divider />
          </Collapse>
          <Link to={"/KotakMasuk"}>
            <ListItem disablePadding>
              <ListItemButton
                sx={{
                  color: `${
                    location.pathname === "/KotakMasuk" ? "#646cff" : "black"
                  }`,
                  backgroundColor: `${
                    location.pathname === "/KotakMasuk" ? "#dbdbdb" : ""
                  }`,
                }}
              >
                <ListItemIcon
                  sx={{
                    color: `${
                      location.pathname === "/KotakMasuk" ? "#646cff" : "black"
                    }`,
                  }}
                >
                  <InboxIcon />
                </ListItemIcon>
                <ListItemText>Kotak Masuk</ListItemText>
              </ListItemButton>
            </ListItem>
          </Link>
          <Divider />
          <Link to={"/TestimoniAdmin"}>
            <ListItem disablePadding>
              <ListItemButton
                sx={{
                  color: `${
                    location.pathname === "/TestimoniAdmin" ? "#646cff" : "black"
                  }`,
                  backgroundColor: `${
                    location.pathname === "/TestimoniAdmin" ? "#dbdbdb" : ""
                  }`,
                }}
              >
                <ListItemIcon
                  sx={{
                    color: `${
                      location.pathname === "/TestimoniAdmin" ? "#646cff" : "black"
                    }`,
                  }}
                >
                  <AddCommentIcon />
                </ListItemIcon>
                <ListItemText>Testimoni</ListItemText>
              </ListItemButton>
            </ListItem>
          </Link>
          <Divider />
          <Link to={"/UserRole"}>
            <ListItem disablePadding>
              <ListItemButton
                sx={{
                  color: `${
                    location.pathname === "/UserRole" ? "#646cff" : "black"
                  }`,
                  backgroundColor: `${
                    location.pathname === "/UserRole" ? "#dbdbdb" : ""
                  }`,
                }}
              >
                <ListItemIcon
                  sx={{
                    color: `${
                      location.pathname === "/UserRole" ? "#646cff" : "black"
                    }`,
                  }}
                >
                  <ManageAccountsIcon />
                </ListItemIcon>
                <ListItemText>User</ListItemText>
              </ListItemButton>
            </ListItem>
          </Link>
          <Divider />
          <Link to={"/SumberDana"}>
            <ListItem disablePadding>
              <ListItemButton
                sx={{
                  color: `${
                    location.pathname === "/SumberDana" ? "#646cff" : "black"
                  }`,
                  backgroundColor: `${
                    location.pathname === "/SumberDana" ? "#dbdbdb" : ""
                  }`,
                }}
              >
                <ListItemIcon
                  sx={{
                    color: `${
                      location.pathname === "/SumberDana" ? "#646cff" : "black"
                    }`,
                  }}
                >
                  <SourceIcon />
                </ListItemIcon>
                <ListItemText>Sumber Dana</ListItemText>
              </ListItemButton>
            </ListItem>
          </Link>
          <Divider />
        </List>
      </Drawer>
      <Main open={open}>
        <DrawerHeader />
      </Main>
    </Box>
  );
}
