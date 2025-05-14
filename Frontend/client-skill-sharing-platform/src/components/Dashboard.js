import React, { useState, useEffect } from 'react';
import { Send as SendIcon } from '@mui/icons-material';
import {
  Box,
  Typography,
  Avatar,
  IconButton,
  TextField,
  Button,
  Divider,
  Menu,
  MenuItem,
  Paper,
  Badge,
  Card,
  CardHeader,
  CardContent,
  CardMedia,
  CardActions,
  Container
} from '@mui/material';
import {
  Home as HomeIcon,
  People as PeopleIcon,
  Work as WorkIcon,
  ChatBubble as ChatIcon,
  Notifications as NotificationsIcon,
  MoreVert as MoreIcon,
  Create as CreateIcon,
  ThumbUp as LikeIcon,
  ThumbUpOutlined as LikeOutlineIcon,
  ModeCommentOutlined as CommentIcon,
  BookmarkBorder as BookmarkIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import CreatePostModal from './CreatePostModal';
import api from '../api/api';
import Swal from 'sweetalert2';
import ReactPlayer from 'react-player';

const Dashboard = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openCreatePost, setOpenCreatePost] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [user, setUser] = useState(null);
  const [commentTexts, setCommentTexts] = useState({});
  const navigate = useNavigate();

  // Set up Axios interceptor
  api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  }, (error) => {
    return Promise.reject(error);
  });

  useEffect(() => {
    const fetchUserAndPosts = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }

        // Get user from localStorage
        const userData = JSON.parse(localStorage.getItem('user'));
        setUser(userData);

        // Fetch posts
        const response = await api.get('/api/posts');
        setPosts(response.data);
      } catch (error) {
        console.error('Error:', error);
        if (error.response?.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          navigate('/login');
        }
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.response?.data?.message || 'Failed to fetch posts',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUserAndPosts();
  }, [navigate]);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const handleCreatePost = async (postData) => {
    try {
      const formData = new FormData();
      formData.append('title', postData.title);
      formData.append('description', postData.description);

      if (postData.media) {
        for (let i = 0; i < postData.media.length; i++) {
          formData.append('media', postData.media[i]);
        }
      }

      const response = await api.post('/api/posts', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setPosts([response.data, ...posts]);
      setOpenCreatePost(false);
      Swal.fire({
        icon: 'success',
        title: 'Post created!',
        showConfirmButton: false,
        timer: 1500
      });
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.response?.data?.message || 'Failed to create post',
      });
    }
  };

  const handleLikePost = async (postId) => {
    try {
      const response = await api.post(`/api/posts/${postId}/like`);
      setPosts(posts.map(post =>
        post.id === postId ? response.data : post
      ));
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to like post',
      });
    }
  };

  const handleAddComment = async (postId, commentText) => {
    try {
      const response = await api.post('/api/comments', {
        postId,
        content: commentText
      });

      setPosts(posts.map(post =>
        post.id === postId
          ? { ...post, comments: [...(post.comments || []), response.data] }
          : post
      ));
      
      // Clear the comment text field
      setCommentTexts(prev => ({ ...prev, [postId]: '' }));
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to add comment',
      });
    }
  };

  const handleDeleteComment = async (postId, commentId) => {
    try {
      await api.delete(`/api/comments/${commentId}`);
      setPosts(posts.map(post =>
        post.id === postId
          ? { ...post, comments: post.comments.filter(c => c.id !== commentId) }
          : post
      ));
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to delete comment',
      });
    }
  };

  const handleCommentChange = (postId, text) => {
    setCommentTexts(prev => ({ ...prev, [postId]: text }));
  };

  const isMediaVideo = (url) => {
    return url.match(/\.(mp4|mov|avi|wmv|flv|mkv)$/i);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <Typography>Loading...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f0f2f5' }}>
      {/* Left Sidebar */}
      <Box sx={{
        width: 280,
        p: 2,
        position: 'fixed',
        height: '100vh',
        borderRight: '1px solid #ddd',
        backgroundColor: 'white'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
          <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#5858FA' }}>
            SkillShare
          </Typography>
        </Box>

        <Box sx={{ mb: 2 }}>
          <Button
            fullWidth
            startIcon={<HomeIcon />}
            sx={{
              justifyContent: 'flex-start',
              textTransform: 'none',
              fontSize: '1rem',
              fontWeight: 'bold',
              color: 'black',
              borderRadius: 2,
              '&:hover': {
                backgroundColor: '#f0f2f5'
              }
            }}
          >
            Home
          </Button>
        </Box>

        <Box sx={{ mb: 2 }}>
          <Button
            fullWidth
            startIcon={<PeopleIcon />}
            sx={{
              justifyContent: 'flex-start',
              textTransform: 'none',
              fontSize: '1rem',
              color: 'black',
              borderRadius: 2,
              '&:hover': {
                backgroundColor: '#f0f2f5'
              }
            }}
          >
            Network
          </Button>
        </Box>

        <Box sx={{ mb: 2 }}>
          <Button
            fullWidth
            startIcon={<WorkIcon />}
            sx={{
              justifyContent: 'flex-start',
              textTransform: 'none',
              fontSize: '1rem',
              color: 'black',
              borderRadius: 2,
              '&:hover': {
                backgroundColor: '#f0f2f5'
              }
            }}
          >
            Jobs
          </Button>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Typography variant="subtitle2" sx={{ color: 'gray', mb: 1 }}>
          Your Communities
        </Typography>

        <Box sx={{ mb: 2 }}>
          <Button
            fullWidth
            startIcon={<PeopleIcon />}
            sx={{
              justifyContent: 'flex-start',
              textTransform: 'none',
              fontSize: '0.9rem',
              color: 'black',
              borderRadius: 2,
              '&:hover': {
                backgroundColor: '#f0f2f5'
              }
            }}
          >
            Web Developers
          </Button>
        </Box>

        <Box sx={{ mb: 2 }}>
          <Button
            fullWidth
            startIcon={<PeopleIcon />}
            sx={{
              justifyContent: 'flex-start',
              textTransform: 'none',
              fontSize: '0.9rem',
              color: 'black',
              borderRadius: 2,
              '&:hover': {
                backgroundColor: '#f0f2f5'
              }
            }}
          >
            Designers
          </Button>
        </Box>
      </Box>

      {/* Main Content */}
      <Container maxWidth="md" sx={{ 
        flex: 1,
        ml: '280px',
        p: 3,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}>
        {/* Top Navigation */}
        <Box sx={{
          width: '100%',
          backgroundColor: 'white',
          p: 1,
          mb: 2,
          borderRadius: 2,
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <TextField
            placeholder="Search..."
            variant="outlined"
            size="small"
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 20,
                backgroundColor: '#f0f2f5',
                width: 300
              }
            }}
          />

          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton sx={{ mr: 1 }}>
              <Badge badgeContent={3} color="error">
                <ChatIcon />
              </Badge>
            </IconButton>

            <IconButton sx={{ mr: 1 }}>
              <Badge badgeContent={5} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>

            <IconButton onClick={handleMenuOpen}>
              <MoreIcon />
            </IconButton>

            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
            >
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Menu>
          </Box>
        </Box>

        {/* Create Post */}
        <Paper sx={{ 
          p: 2, 
          mb: 3, 
          borderRadius: 2, 
          width: '100%',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Avatar src={user?.avatar} sx={{ mr: 2 }} />
            <TextField
              fullWidth
              placeholder="Share your skill or knowledge..."
              variant="outlined"
              size="small"
              onClick={() => setOpenCreatePost(true)}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 20,
                  backgroundColor: '#f0f2f5',
                  '&:hover': {
                    backgroundColor: '#e4e6e9'
                  }
                }
              }}
            />
          </Box>
          <Divider sx={{ my: 1 }} />
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Button
              startIcon={<CreateIcon />}
              sx={{
                textTransform: 'none',
                color: 'gray',
                borderRadius: 2,
                '&:hover': {
                  backgroundColor: '#f0f2f5'
                }
              }}
              onClick={() => setOpenCreatePost(true)}
            >
              Create Post
            </Button>
          </Box>
        </Paper>

        {/* Posts */}
        <Box sx={{ width: '100%', maxWidth: '680px' }}>
          {posts.map(post => (
            <Card key={post.id} sx={{ 
              mb: 3, 
              borderRadius: 2,
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}>
              <CardHeader
                avatar={
                  <Avatar>{post.authorName ? post.authorName.charAt(0) : 'U'}</Avatar>
                }
                title={post.authorName || 'Unknown User'}
                subheader={new Date(post.createdAt).toLocaleString()}
                action={
                  user?.id === post.userId && (
                    <IconButton>
                      <MoreIcon />
                    </IconButton>
                  )
                }
              />
              
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {post.title}
                </Typography>
                <Typography variant="body1" paragraph>
                  {post.description}
                </Typography>
                
                {/* Media display */}
                {post.mediaUrls && post.mediaUrls.length > 0 && (
                  <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {post.mediaUrls.map((url, index) => (
                      <Box key={index} sx={{ 
                        maxHeight: 400,
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        overflow: 'hidden',
                        borderRadius: 1
                      }}>
                        {isMediaVideo(url) ? (
                          <ReactPlayer 
                            url={url} 
                            controls 
                            width="100%"
                            height="auto"
                          />
                        ) : (
                          <img 
                            src={url} 
                            alt={`Post media ${index}`} 
                            style={{ 
                              maxWidth: '100%', 
                              maxHeight: '100%',
                              objectFit: 'contain' 
                            }} 
                          />
                        )}
                      </Box>
                    ))}
                  </Box>
                )}
              </CardContent>
              
              <CardActions sx={{ px: 2, pt: 0, pb: 1 }}>
                <Button 
                  startIcon={post.likes?.includes(user?.id) ? <LikeIcon color="primary" /> : <LikeOutlineIcon />}
                  onClick={() => handleLikePost(post.id)}
                  sx={{ textTransform: 'none' }}
                >
                  {post.likes?.length || 0} Likes
                </Button>
                <Button 
                  startIcon={<CommentIcon />}
                  sx={{ textTransform: 'none' }}
                >
                  {post.comments?.length || 0} Comments
                </Button>
                <Button 
                  startIcon={<BookmarkIcon />}
                  sx={{ textTransform: 'none' }}
                >
                  Save
                </Button>
              </CardActions>
              
              {/* Comments section */}
              <Box sx={{ px: 2, pb: 2 }}>
                {/* Display existing comments */}
                {post.comments?.map(comment => (
                  <Box key={comment.id} sx={{ 
                    display: 'flex', 
                    alignItems: 'flex-start', 
                    mb: 1,
                    p: 1,
                    backgroundColor: '#f9f9f9',
                    borderRadius: 1
                  }}>
                    <Avatar sx={{ width: 32, height: 32, mr: 1 }}>
                      {comment.authorName?.charAt(0) || 'U'}
                    </Avatar>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                        {comment.authorName || 'Unknown User'}
                      </Typography>
                      <Typography variant="body2">
                        {comment.content}
                      </Typography>
                    </Box>
                    {(comment.userId === user?.id || user?.id === post.userId) && (
                      <IconButton 
                        size="small" 
                        onClick={() => handleDeleteComment(post.id, comment.id)}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    )}
                  </Box>
                ))}
                
                {/* Add comment */}
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                  <Avatar sx={{ width: 32, height: 32, mr: 1 }}>{user?.name?.charAt(0) || 'U'}</Avatar>
                  <TextField
                    fullWidth
                    variant="outlined"
                    size="small"
                    placeholder="Write a comment..."
                    value={commentTexts[post.id] || ''}
                    onChange={(e) => handleCommentChange(post.id, e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && commentTexts[post.id]?.trim()) {
                        handleAddComment(post.id, commentTexts[post.id]);
                      }
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 20,
                        backgroundColor: '#f0f2f5',
                      }
                    }}
                  />
                  <IconButton 
                    disabled={!commentTexts[post.id]?.trim()}
                    onClick={() => handleAddComment(post.id, commentTexts[post.id])}
                    sx={{ ml: 1 }}
                  >
                    <SendIcon fontSize="small" />
                  </IconButton>
                </Box>
              </Box>
            </Card>
          ))}
        </Box>
      </Container>

      {/* Create Post Modal */}
      <CreatePostModal
        open={openCreatePost}
        onClose={() => setOpenCreatePost(false)}
        onSubmit={handleCreatePost}
      />
    </Box>
  );
};

export default Dashboard;