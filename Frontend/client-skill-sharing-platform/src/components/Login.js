import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  TextField, 
  Button, 
  Grid, 
  Paper,
  InputAdornment,
  IconButton,
  Divider,
  Fade
} from '@mui/material';
import { Visibility, VisibilityOff, Login as LoginIcon } from '@mui/icons-material';
import Swal from 'sweetalert2';
import api from '../api/api';
import skillSharingImg from '../assets/skill-sharing.png';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!username || !password) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Please fill in all fields!',
      });
      setLoading(false);
      return;
    }

    try {
      const response = await api.post('/api/auth/signin', {
        username,
        password
      });
      
      localStorage.setItem('token', response.data.accessToken);
      localStorage.setItem('user', JSON.stringify(response.data));
      
      await Swal.fire({
        icon: 'success',
        title: 'Login Successful!',
        text: `Welcome back, ${response.data.username}!`,
        timer: 2000,
        showConfirmButton: false,
      });
      
      navigate('/dashboard');
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Login Failed',
        text: err.response?.data?.message || 'Invalid credentials. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ 
      height: '100vh', 
      display: 'flex',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)'
    }}>
      {/* Left Side - Blue Background with Image */}
      <Box 
        sx={{ 
          flex: 1, 
          backgroundColor: '#5858FA',
          display: { xs: 'none', lg: 'flex' },
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          gap: 4,
          p: 4,
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: '-50%',
            right: '-50%',
            width: '200%',
            height: '200%',
            background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 70%)',
            transform: 'rotate(30deg)',
          }
        }}
      >
        <Fade in={true} timeout={1000}>
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center',
            zIndex: 1
          }}>
            <img 
              src={skillSharingImg} 
              alt="Skill Sharing" 
              style={{ 
                width: '70%', 
                maxWidth: '400px', 
                height: 'auto',
                filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.2))'
              }}
            />
            <Typography variant="h3" color="white" sx={{ 
              fontWeight: 'bold',
              mt: 4,
              textAlign: 'center',
              textShadow: '0 2px 10px rgba(0,0,0,0.2)'
            }}>
              Share Your Skills, Grow Together
            </Typography>
            <Typography variant="subtitle1" color="white" sx={{ 
              mt: 2,
              opacity: 0.8,
              textAlign: 'center'
            }}>
              Connect with professionals and enthusiasts to exchange knowledge and expertise.
            </Typography>
          </Box>
        </Fade>
      </Box>

      {/* Right Side - Login Form */}
      <Box 
        sx={{ 
          flex: 1, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          p: { xs: 2, md: 4 },
          maxWidth: '100vw'
        }}
      >
        <Fade in={true} timeout={1500}>
          <Paper elevation={10} sx={{ 
            p: { xs: 3, md: 5 }, 
            width: '100%', 
            maxWidth: 500,
            borderRadius: 3,
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 8px 32px rgba(31, 38, 135, 0.15)'
          }}>
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <Typography variant="h4" sx={{ 
                fontWeight: 'bold', 
                mb: 1,
                color: '#5858FA'
              }}>
                Welcome Back
              </Typography>
              <Typography variant="subtitle1" color="text.secondary">
                Sign in to continue to your account
              </Typography>
            </Box>
            
            <form onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Username"
                    variant="outlined"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    InputProps={{
                      style: {
                        borderRadius: 12,
                      }
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Password"
                    variant="outlined"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    InputProps={{
                      style: {
                        borderRadius: 12,
                      },
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowPassword(!showPassword)}
                            edge="end"
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      )
                    }}
                  />
                </Grid>
                <br/>
                {/* <Grid item xs={12} sx={{ textAlign: 'right' }}>
                  <Link to="/forgot-password" style={{ 
                    color: '#5858FA', 
                    textDecoration: 'none',
                    fontSize: '0.875rem'
                  }}>
                    Forgot password?
                  </Link>
                </Grid> */}
                <Grid item xs={12}>
                  <Button
                    fullWidth
                    variant="contained"
                    size="large"
                    type="submit"
                    disabled={loading}
                    startIcon={<LoginIcon />}
                    sx={{ 
                      backgroundColor: '#5858FA',
                      '&:hover': { 
                        backgroundColor: '#4848EA',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 6px 12px rgba(88, 88, 250, 0.3)'
                      },
                      py: 1.5,
                      borderRadius: 12,
                      fontSize: '1rem',
                      fontWeight: 600,
                      textTransform: 'none',
                      transition: 'all 0.3s ease',
                      boxShadow: '0 4px 8px rgba(88, 88, 250, 0.2)'
                    }}
                  >
                    {loading ? 'Signing In...' : 'Sign In'}
                  </Button>
                </Grid>
                <Grid item xs={12}>
                  <Divider sx={{ my: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      OR
                    </Typography>
                  </Divider>
                </Grid>
                <Grid item xs={12} sx={{ textAlign: 'center' }}>
                  <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                    Don't have an account?{' '}
                    <Link to="/register" style={{ 
                      color: '#5858FA', 
                      textDecoration: 'none',
                      fontWeight: 600
                    }}>
                      Sign Up
                    </Link>
                  </Typography>
                </Grid>
              </Grid>
            </form>
          </Paper>
        </Fade>
      </Box>
    </Box>
  );
};

export default Login;