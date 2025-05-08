import { useEffect, useState } from 'react';
import { 
  Typography, 
  Box, 
  Avatar, 
  Chip, 
  CircularProgress, 
  Alert,
  Paper,
  Container,
  Fade,
  Divider,
  Grid,
  Button,
  useTheme
} from '@mui/material';
import { styled } from '@mui/material/styles';
import userService from '../api/users';
import { 
  Email, 
  Code, 
  Info, 
  Work, 
  LocationOn, 
  Link, 
  CalendarToday,
  Edit,
  Star
} from '@mui/icons-material';

const GradientPaper = styled(Paper)(({ theme }) => ({
  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
  color: theme.palette.primary.contrastText,
  padding: theme.spacing(4),
  borderRadius: theme.shape.borderRadius * 3,
  boxShadow: theme.shadows[10],
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '8px',
    background: `linear-gradient(90deg, ${theme.palette.secondary.light} 0%, ${theme.palette.primary.light} 100%)`,
  }
}));

const UserAvatar = styled(Avatar)(({ theme }) => ({
  width: 150,
  height: 150,
  border: `4px solid ${theme.palette.background.paper}`,
  boxShadow: theme.shadows[4],
  marginBottom: theme.spacing(2),
}));

const SectionCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: theme.shape.borderRadius * 2,
  backgroundColor: theme.palette.background.paper,
  boxShadow: theme.shadows[2],
  height: '100%',
  transition: 'transform 0.3s, box-shadow 0.3s',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: theme.shadows[6],
  }
}));

const SkillChip = styled(Chip)(({ theme }) => ({
  margin: theme.spacing(0.5),
  fontWeight: 600,
  background: `linear-gradient(45deg, ${theme.palette.primary.light} 0%, ${theme.palette.secondary.light} 100%)`,
  color: theme.palette.getContrastText(theme.palette.primary.light),
}));

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const theme = useTheme();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await userService.getCurrentUser();
        setUser(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch profile');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        minHeight: '80vh'
      }}>
        <CircularProgress size={80} thickness={4} sx={{ color: theme.palette.primary.light }} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ mt: 4 }}>
        <Alert severity="error" variant="filled" sx={{ borderRadius: 2 }}>
          {error}
        </Alert>
      </Box>
    );
  }

  return (
    <Fade in timeout={800}>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <GradientPaper elevation={3}>
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                position: 'relative'
              }}>
                <UserAvatar
                  src={user?.profilePicture}
                  alt={user?.username}
                />
                <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
                  {user?.username}
                </Typography>
                <Typography variant="subtitle1" sx={{ mb: 2 }}>
                  {user?.title || 'Member'}
                </Typography>
                
                <Button 
                  variant="contained" 
                  color="secondary" 
                  startIcon={<Edit />}
                  sx={{ mb: 3 }}
                >
                  Edit Profile
                </Button>
                
                <Box sx={{ width: '100%', textAlign: 'left' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Email sx={{ mr: 1, color: theme.palette.primary.light }} />
                    <Typography>{user?.email}</Typography>
                  </Box>
                  {user?.location && (
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <LocationOn sx={{ mr: 1, color: theme.palette.primary.light }} />
                      <Typography>{user.location}</Typography>
                    </Box>
                  )}
                  {user?.website && (
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Link sx={{ mr: 1, color: theme.palette.primary.light }} />
                      <Typography>
                        <a href={user.website} target="_blank" rel="noopener noreferrer" style={{ color: 'inherit' }}>
                          {user.website.replace(/^https?:\/\//, '')}
                        </a>
                      </Typography>
                    </Box>
                  )}
                  {user?.joinDate && (
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <CalendarToday sx={{ mr: 1, color: theme.palette.primary.light }} />
                      <Typography>Joined {new Date(user.joinDate).toLocaleDateString()}</Typography>
                    </Box>
                  )}
                </Box>
              </Box>
            </Grid>
            
            <Grid item xs={12} md={8}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <SectionCard>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Info sx={{ mr: 1, color: theme.palette.primary.main }} />
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>About</Typography>
                    </Box>
                    <Typography paragraph sx={{ color: 'text.secondary' }}>
                      {user?.bio || 'No bio provided. Click "Edit Profile" to add one.'}
                    </Typography>
                  </SectionCard>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <SectionCard>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Code sx={{ mr: 1, color: theme.palette.primary.main }} />
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>Skills</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
                      {user?.skills?.length > 0 ? (
                        user.skills.map((skill) => (
                          <SkillChip 
                            key={skill} 
                            label={skill}
                            size="small"
                          />
                        ))
                      ) : (
                        <Typography color="text.secondary">No skills added yet</Typography>
                      )}
                    </Box>
                  </SectionCard>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <SectionCard>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Work sx={{ mr: 1, color: theme.palette.primary.main }} />
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>Experience</Typography>
                    </Box>
                    {user?.experience?.length > 0 ? (
                      user.experience.map((exp, index) => (
                        <Box key={index} sx={{ mb: 1 }}>
                          <Typography sx={{ fontWeight: 600 }}>{exp.role}</Typography>
                          <Typography variant="body2" color="text.secondary">
                            {exp.company} • {exp.duration}
                          </Typography>
                        </Box>
                      ))
                    ) : (
                      <Typography color="text.secondary">No experience added</Typography>
                    )}
                  </SectionCard>
                </Grid>
                
                {user?.achievements?.length > 0 && (
                  <Grid item xs={12}>
                    <SectionCard>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Star sx={{ mr: 1, color: theme.palette.primary.main }} />
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>Achievements</Typography>
                      </Box>
                      <Grid container spacing={2}>
                        {user.achievements.map((achievement, index) => (
                          <Grid item xs={12} sm={6} key={index}>
                            <Box sx={{ 
                              display: 'flex', 
                              alignItems: 'center',
                              p: 1,
                              borderRadius: 1,
                              background: theme.palette.action.hover
                            }}>
                              <Avatar sx={{ 
                                width: 40, 
                                height: 40, 
                                mr: 2,
                                bgcolor: theme.palette.primary.main
                              }}>
                                <Star />
                              </Avatar>
                              <Box>
                                <Typography sx={{ fontWeight: 600 }}>{achievement.title}</Typography>
                                <Typography variant="body2" color="text.secondary">
                                  {achievement.date}
                                </Typography>
                              </Box>
                            </Box>
                          </Grid>
                        ))}
                      </Grid>
                    </SectionCard>
                  </Grid>
                )}
              </Grid>
            </Grid>
          </Grid>
        </GradientPaper>
      </Container>
    </Fade>
  );
};

export default Profile;