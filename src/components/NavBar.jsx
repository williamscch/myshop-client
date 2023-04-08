import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import VpnKeyIcon from '@mui/icons-material/VpnKey';

const NavBar = ({
  open,
  handleDrawerOpen,
  drawerWidth,
  session,
  setSession, role,
}) => {
  const [openDialog, setOpenDialog] = React.useState(false);
  const navigate = useNavigate();

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
    setTimeout(() => {
      navigate('/login');
    }, 3000);
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
              <Button
                variant="contained"
                color="success"
                onClick={handleClickOpenDialog}
                startIcon={<VpnKeyIcon />}
              >
                LOG IN
              </Button>
            </Link>

            <Link to="/signup">
              {' '}
              <Button
                variant="contained"
                color="secondary"
                onClick={handleClickOpenDialog}
                startIcon={<PersonAddIcon />}
              >
                SIGN UP
              </Button>
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
            {
              role === 'customer'
                ? (
                  <Link to="/shop-car">
                    <Button
                      startIcon={<ShoppingCartIcon />}
                      variant="contained"
                      color="secondary"
                    >
                      Shop Car
                    </Button>
                  </Link>
                ) : ''
            }

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
              variant="contained"
              color="warning"
              onClick={handleClickOpenDialog}
              startIcon={<ExitToAppIcon />}
            >
              Logout
            </Button>
          </ButtonGroup>
        )}
      </Toolbar>
    </AppBar>
  );
};

NavBar.propTypes = {
  open: PropTypes.bool.isRequired,
  handleDrawerOpen: PropTypes.func.isRequired,
  drawerWidth: PropTypes.number.isRequired,
  setSession: PropTypes.func.isRequired,
  session: PropTypes.bool.isRequired,
  role: PropTypes.string.isRequired,
};

export default NavBar;
