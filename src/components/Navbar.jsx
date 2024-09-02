import React,{useState} from 'react';
import { AppBar, Toolbar, Typography, Button, Menu, MenuItem, Box, Container, IconButton, Tooltip, Avatar} from '@mui/material';
import MenuIcon from "@mui/icons-material/Menu";

import icon from "../assets/icon-white.png";
import { Link} from "react-router-dom";
import useNavigateToSection from "../utils/useNavigateToSection";


const links= [
  { label: "INSTRUCTION", path: "/", id: "instruction" },
  { label: "ABOUT", path: "/", id: "about" },
  { label: "CONTACT", path: "/contact", id: "contact" },
  { label: "FAQ's", path: "/", id: "faq" },
];

const settings= [
  { label: "Account", path: "/account", id: "account" },
  { label: "Orders", path: "/orders", id: "orders" },
  { label: "Logout", path: "/logout", id: "logout" },
];



function Navbar() {

  const [isLoggedIn, setIsLoggedIn] =useState(true);



  const navigateToSection = useNavigateToSection();

  const handleNavigation = (sectionId) => {
    navigateToSection({ sectionId });
  };

  const NavLink = ({href,id,children}) =>
    (
      <Link to={href} style={{ textDecoration: "none" }}  >
        <Button variant="text" color="inherit" style={{ textTransform: "capitalize" }} onClick={() => handleNavigation(id)}>
          {children}
        </Button>
      </Link>
    );
  
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
    <AppBar
    position="static"
    sx={{ backgroundColor: "transparent", boxShadow: "none" }}
  >
    <Container
      sx={{
        width: "90%",
        height: "75px",
        borderBottom: "1px solid rgba(255, 255, 255, 0.8)",
        display: "flex",
      }}
    >
      <Toolbar
        disableGutters
        sx={{
          display: { md: "flex" },
          justifyContent: { md: "space-between" },
          width: "100%",
        }}
      >
        <div className="flex items-center">
          <IconButton sx={{ display: { xs: "none", md: "flex" }, mr: 1 }}>
            <Link to="/" style={{ textDecoration: "none" }}>
              {" "}
              {/* Optional, for navigation */}
              <img
                src={icon}
                alt="Your App Logo"
                style={{ width: "40px", height: "40px" }}
              />{" "}
              {/* Customize image size */}
            </Link>
          </IconButton>
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="/"
            sx={{
              fontSize: "1.5rem",
              mr: 2,
              display: { xs: "none", md: "flex" },
              fontFamily: "monospace",
              fontWeight: 700,
              color: "inherit",
              textDecoration: "none",
            }}
          >
            BOOKLET.LIFE
          </Typography>
        </div>

        <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
          <IconButton
            size="large"
            aria-label="account of current user"
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
            {links.map((link) => (
              <MenuItem key={link.label} onClick={handleCloseNavMenu}>
                <NavLink href={link.path} id={link.id}>
                  {link.label}
                </NavLink>
              </MenuItem>
            ))}
          </Menu>
        </Box>
        <IconButton sx={{ display: { xs: "flex", md: "none" } }}>
          <Link to="/" style={{ textDecoration: "none" }}>
            {" "}
            {/* Optional, for navigation */}
            <img
              src={icon}
              alt="Your App Logo"
              style={{ width: "40px", height: "40px" }}
            />{" "}
            {/* Customize image size */}
          </Link>
        </IconButton>
        <Typography
          variant="h6"
          noWrap
          component="a"
          href="/"
          sx={{
            mr: 2,
            display: { xs: "flex", md: "none" },
            flexGrow: 1,
            fontFamily: "monospace",
            fontWeight: 700,
            color: "inherit",
            textDecoration: "none",
          }}
        >
          BOOKLET.LIFE
        </Typography>
        <Box sx={{ flexGrow: 0, display: { xs: "none", md: "flex" } }}>
          {links.map((link) => (
            <MenuItem key={link.label} onClick={handleCloseNavMenu}>
              <NavLink href={link.path} id={link.id}>
                {link.label}
              </NavLink>
            </MenuItem>
          ))}
        </Box>
{/* 
        <Box
          sx={{
            flexGrow: 0,
            width: { md: "250px" },
            display: { md: "flex" },
            justifyContent: { md: "flex-end" },
          }}
        >
          <Tooltip title="Open settings">
            <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
              <Avatar alt="Remy Sharp" src="/static/images/avatar/2.jpg" />
            </IconButton>
          </Tooltip>
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
           
            {isLoggedIn ? (
              settings.map((setting) => (
                <MenuItem
                  key={setting.label}
                  onClick={handleCloseUserMenu}
                  sx={{ textTransform: "capitalize" }}
                >
                  <NavLink href={setting.path} id={setting.id}>
                    {setting.label}
                  </NavLink>
                </MenuItem>
              ))
            ) : (
              <MenuItem
                onClick={handleCloseUserMenu}
                sx={{ textTransform: "capitalize" }}
              >
                <NavLink href="/login" id="login">
                  Login
                </NavLink>
              </MenuItem>
            )}
          </Menu>
        </Box> */}
      </Toolbar>
    </Container>
  </AppBar>
  );
}


export default Navbar