import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Card, CardContent, Typography, CircularProgress, Alert, List, ListItem, ListItemText, Box } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get('http://192.168.100.102:4000/profile', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        });
        console.log('User data:', response.data.array); // Check the full response data
        setUser(response.data.array); // Adjust based on the actual data structure
      } catch (error) {
        console.error('Error fetching user profile:', error);
        setError(error.response ? error.response.data.error : 'Error fetching data');
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  if (loading) return <CircularProgress />;
  if (error) return <Alert severity="error">{error}</Alert>;

  if (!user) return <Alert severity="warning">No user data available</Alert>;

  // Function to capitalize the first letter of each word in a string
  const capitalizeFirstLetter = (str) => {
    if (!str) return 'N/A';
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };

  return (
    <Container maxWidth="xl">
      <Typography variant="h4" component="div" gutterBottom>
        <PersonIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
        Hello Mr {capitalizeFirstLetter(user.firstName)}
      </Typography>
      <Card variant="outlined" sx={{ p: 2 }}>
        <CardContent>
          <List>
            <ListItem
              sx={{
                boxShadow: 1,
                mb: 2, // Increased margin-bottom for more spacing
                borderRadius: 1,
                borderBottom: '2px solid #ddd', // Increased thickness of underline
                transition: 'box-shadow 0.3s',
                '&:hover': {
                  boxShadow: 3
                }
              }}
            >
              <ListItemText primary="First Name" secondary={capitalizeFirstLetter(user.firstName)} />
            </ListItem>
            <ListItem
              sx={{
                boxShadow: 1,
                mb: 2, // Increased margin-bottom for more spacing
                borderRadius: 1,
                borderBottom: '2px solid #ddd', // Increased thickness of underline
                transition: 'box-shadow 0.3s',
                '&:hover': {
                  boxShadow: 3
                }
              }}
            >
              <ListItemText primary="Last Name" secondary={capitalizeFirstLetter(user.lasttName)} />
            </ListItem>
            <ListItem
              sx={{
                boxShadow: 1,
                mb: 2, // Increased margin-bottom for more spacing
                borderRadius: 1,
                borderBottom: '2px solid #ddd', // Increased thickness of underline
                transition: 'box-shadow 0.3s',
                '&:hover': {
                  boxShadow: 3
                }
              }}
            >
              <ListItemText primary="Email" secondary={capitalizeFirstLetter(user.email)} />
            </ListItem>
            <ListItem
              sx={{
                boxShadow: 1,
                mb: 2, // Increased margin-bottom for more spacing
                borderRadius: 1,
                borderBottom: '2px solid #ddd', // Increased thickness of underline
                transition: 'box-shadow 0.3s',
                '&:hover': {
                  boxShadow: 3
                }
              }}
            >
              <ListItemText primary="Role" secondary={capitalizeFirstLetter(user.role)} />
            </ListItem>
            <ListItem
              sx={{
                boxShadow: 1,
                mb: 2, // Increased margin-bottom for more spacing
                borderRadius: 1,
                borderBottom: '2px solid #ddd', // Increased thickness of underline
                transition: 'box-shadow 0.3s',
                '&:hover': {
                  boxShadow: 3
                }
              }}
            >
              <ListItemText
                primary="Created At"
                secondary={user.createdAt ? capitalizeFirstLetter(new Date(user.createdAt).toLocaleString()) : 'N/A'}
              />
            </ListItem>
          </List>
        </CardContent>
      </Card>
    </Container>
  );
};

export default UserProfile;
