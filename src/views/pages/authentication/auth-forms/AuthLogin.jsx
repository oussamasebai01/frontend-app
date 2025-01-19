import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

// material-ui
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import Stack from '@mui/material/Stack';

// third party
import { Formik } from 'formik';

// project imports
import AnimateButton from 'ui-component/extended/AnimateButton';

// assets
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import LoginImage from 'assets/images/login-image.png'; // Import your local image

const AuthLogin = ({ ...others }) => {
  const theme = useTheme();
  const matchDownSM = useMediaQuery(theme.breakpoints.down('md'));
  const customization = useSelector((state) => state.customization);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleSubmit = async (values, { setSubmitting, setErrors }) => {
    try {
      const response = await axios.post('http://192.168.100.102:4000/login', {
        email: values.email,
        password: values.password,
      });

      if (!response.data.token) {
        throw new Error('Authentication failed');
      }

      toast.success('Login successful');
      localStorage.setItem('token', response.data.token);
      navigate('/dashboard/default');
    } catch (error) {
      toast.error('Login failed. Please try again.');
      setErrors({ submit: 'Authentication failed' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Grid container style={{ height: '90vh', maxWidth: '2000px', margin: '200 auto' }}>

      {/* Left Section - Image */}
      <Grid
        item
        xs={6}
        md={14}
        sx={{
          backgroundImage: `url(${LoginImage})`, // Use the imported image
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          display: { xs: 'none', md: 'block' }, // Hide on smaller screens
        }}
      />

      {/* Right Section - Login Form */}
      <Grid
        item
        xs={6}
        md={12}
        container
        alignItems="center"
        justifyContent="center"
        sx={{ padding: 3 }}
      >
        <Box sx={{ width: '100%', maxWidth: 400 }}>
          <Formik
            initialValues={{
              email: '',
              password: '',
              submit: null,
            }}
            onSubmit={handleSubmit}
          >
            {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
              <form noValidate onSubmit={handleSubmit} {...others}>
                <FormControl
                  fullWidth
                  error={Boolean(touched.email && errors.email)}
                  sx={{ ...theme.typography.customInput }}
                >
                  <InputLabel htmlFor="outlined-adornment-email-login">Email Address</InputLabel>
                  <OutlinedInput
                    id="outlined-adornment-email-login"
                    type="email"
                    value={values.email}
                    name="email"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    label="Email Address / Username"
                  />
                  {touched.email && errors.email && (
                    <FormHelperText error id="standard-weight-helper-text-email-login">
                      {errors.email}
                    </FormHelperText>
                  )}
                </FormControl>

                <FormControl
                  fullWidth
                  error={Boolean(touched.password && errors.password)}
                  sx={{ ...theme.typography.customInput }}
                >
                  <InputLabel htmlFor="outlined-adornment-password-login">Password</InputLabel>
                  <OutlinedInput
                    id="outlined-adornment-password-login"
                    type={showPassword ? 'text' : 'password'}
                    value={values.password}
                    name="password"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownPassword}
                          edge="end"
                        >
                          {showPassword ? <Visibility /> : <VisibilityOff />}
                        </IconButton>
                      </InputAdornment>
                    }
                    label="Password"
                  />
                  {touched.password && errors.password && (
                    <FormHelperText error id="standard-weight-helper-text-password-login">
                      {errors.password}
                    </FormHelperText>
                  )}
                </FormControl>

                {errors.submit && (
                  <Box sx={{ mt: 3 }}>
                    <FormHelperText error>{errors.submit}</FormHelperText>
                  </Box>
                )}

                <Box sx={{ mt: 2 }}>
                  <AnimateButton>
                    <Button
                      disableElevation
                      disabled={isSubmitting}
                      fullWidth
                      size="large"
                      type="submit"
                      variant="contained"
                      sx={{
                        backgroundColor: 'orange',
                        '&:hover': { backgroundColor: 'darkorange' },
                      }}
                    >
                      Sign in
                    </Button>
                  </AnimateButton>
                </Box>
              </form>
            )}
          </Formik>
        </Box>
      </Grid>
    </Grid>
  );
};

export default AuthLogin;
