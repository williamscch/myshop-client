import React from 'react';
import { Link } from 'react-router-dom';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import PropTypes from 'prop-types';
import ButtonGroup from '@mui/material/ButtonGroup';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

const NavBar = ({
  open, handleDrawerOpen, drawerWidth, session, setSession,
}) => {
  const [openDialog, setOpenDialog] = React.useState(false);

  const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
  })(({ theme, open }) => ({
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: `${drawerWidth}px`,
      transition: theme.transitions.create(['margin', 'width'], {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
    }),
  }));

  const handleLogOutClick = () => {
    window.localStorage.removeItem('token');
    setSession(false);
  };

  const handleClickOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleClickCloseDialog = () => {
    setOpenDialog(false);
  };

  return (
    <AppBar position="fixed" open={open}>
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          onClick={handleDrawerOpen}
          edge="start"
          sx={{ mr: 2, ...(open && { display: 'none' }) }}
        >
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" noWrap component="div">
          My shop
        </Typography>

        {!session ? (
          <ButtonGroup
            sx={{
              marginLeft: 'auto',
            }}
            variant="contained"
            color="secondary"
          >
            <Link to="/login">
              {' '}
              <Button>LOGIN</Button>
            </Link>

            <Link to="/signup">
              {' '}
              <Button>SIGNUP</Button>
            </Link>
          </ButtonGroup>
        ) : (
          <ButtonGroup
            sx={{
              marginLeft: 'auto',
            }}
            variant="contained"
            color="secondary"
          >
            <Button
              variant="contained"
              color="warning"
              onClick={handleClickOpenDialog}
              startIcon={<AccountCircleIcon />}
            >
              Logout
            </Button>
            <Dialog
              open={openDialog}
              onClose={handleClickCloseDialog}
              aria-labelledby="alert-dialog-title"
            >
              <DialogTitle id="alert-dialog-title">
                Are you sure of Logout?
              </DialogTitle>
              <DialogActions>
                <Button color="primary" onClick={handleClickCloseDialog}>
                  No... Stay logged.
                </Button>
                <Button
                  color="error"
                  onClick={() => {
                    handleLogOutClick();
                    handleClickCloseDialog();
                  }}
                  autoFocus
                >
                  Yes, logout.
                </Button>
              </DialogActions>
            </Dialog>
            <Button
              startIcon={<ExitToAppIcon />}
              variant="contained"
              color="secondary"
            >
              My Profile
            </Button>
          </ButtonGroup>
        )}
      </Toolbar>
    </AppBar>
  );
};

NavBar.propTypes = {
  open: PropTypes.bool.isRequired,
  session: PropTypes.bool.isRequired,
  setSession: PropTypes.func.isRequired,
  handleDrawerOpen: PropTypes.func.isRequired,
  drawerWidth: PropTypes.number.isRequired,
};

export default NavBar;
