import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Alert from '@mui/material/Alert';
import axios from 'axios';
import { toast } from 'react-toastify';

const MailCheck = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [otpVerified, setOtpVerified] = useState(false);
  const navigate = useNavigate();

  const handleChangeEmail = (event) => {
    setEmail(event.target.value);
  };

  const handleChangeOtp = (event) => {
    setOtp(event.target.value);
  };

  const handleChangePassword = (event) => {
    setNewPassword(event.target.value);
  };

  const handleSubmitEmail = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post('http://192.168.100.102:4000/finduser', { email });
      setSubmitted(true);
      setOtpSent(true);
      toast.success('OTP sent to your email. Please check your email.');
    } catch (error) {
      console.error(error);
      toast.error('Email not found!');
    }
  };

  const handleSubmitOtp = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post('http://192.168.100.102:4000/verifyotp', { email, otp });
      if (response.data.message === 'OTP verified') {
        setOtpVerified(true);
      } else {
        toast.error('Invalid OTP. Please try again.');
      }
    } catch (error) {
      console.error(error);
      toast.error('Error verifying OTP. Please try again.');
    }
  };

  const handleSubmitPassword = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post('http://192.168.100.102:4000/updatepassword', { email, otp, newPassword });
      if (response.data.message === 'Password updated successfully') {
        toast.success('Password updated successfully');
        navigate('/auth/login');
      } else {
        toast.error('Error updating password. Please try again.');
      }
    } catch (error) {
      console.error(error);
      toast.error('Error updating password. Please try again.');
    }
  };

  const handleBackToLogin = () => {
    navigate('/auth/login');
  };

  return (
    <Container
      component="main"
      maxWidth="xl"
      sx={{ backgroundColor: '#f0f0f0', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
    >
      <Card sx={{ maxWidth: 400, width: '100%', padding: 3, boxShadow: 3 }}>
        <CardContent>
          {!submitted && (
            <>
              <Typography component="h1" variant="h5" gutterBottom>
                <i>Please enter your email address!</i>
              </Typography>
              <Box component="form" onSubmit={handleSubmitEmail} noValidate sx={{ mt: 1 }}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  autoFocus
                  value={email}
                  onChange={handleChangeEmail}
                />
                <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
                  Submit
                </Button>
              </Box>
            </>
          )}
          {otpSent && !otpVerified && (
            <>
              <Typography component="h1" variant="h5" gutterBottom>
                <i>Enter the OTP sent to your email</i>
              </Typography>
              <Box component="form" onSubmit={handleSubmitOtp} noValidate sx={{ mt: 1 }}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="otp"
                  label="OTP"
                  name="otp"
                  autoComplete="otp"
                  value={otp}
                  onChange={handleChangeOtp}
                />
                <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
                  Verify OTP
                </Button>
              </Box>
            </>
          )}
          {otpVerified && (
            <>
              <Typography component="h1" variant="h5" gutterBottom>
                <i>Enter your new password</i>
              </Typography>
              <Box component="form" onSubmit={handleSubmitPassword} noValidate sx={{ mt: 1 }}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="password"
                  label="New Password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  value={newPassword}
                  onChange={handleChangePassword}
                />
                <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
                  Update Password
                </Button>
              </Box>
            </>
          )}
          <Button variant="text" color="primary" onClick={handleBackToLogin} sx={{ mt: 2 }}>
            Back to Login
          </Button>
        </CardContent>
      </Card>
    </Container>
  );
};

export default MailCheck;
