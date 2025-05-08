import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Avatar, 
  IconButton, 
  Menu, 
  MenuItem,
  Paper,
  TextField,
  Button,
  Divider,
  Chip
} from '@mui/material';
import {
  MoreVert as MoreIcon,
  ThumbUp as LikeIcon,
  ThumbUpOutlined as LikeOutlineIcon,
  ModeCommentOutlined as CommentIcon,
  ShareOutlined as ShareIcon,
  Delete as DeleteIcon,
  Edit as EditIcon
} from '@mui/icons-material';
import { formatDistanceToNow } from 'date-fns';
import MediaDisplay from './MediaDisplay';
import api from '../api/api';
import Swal from 'sweetalert2';

const Post = ({ post, currentUser, onLike, onDelete, onAddComment, onDeleteComment }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [commentText, setCommentText] = useState('');
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editCommentText, setEditCommentText] = useState('');
  const [isEditingPost, setIsEditingPost] = useState(false);
  const [editedContent, setEditedContent] = useState(post.content);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLike = () => {
    onLike(post._id);
  };

  const handleDeletePost = () => {
    Swal.fire({
      title: 'Delete Post?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Delete'
    }).then((result) => {
      if (result.isConfirmed) {
        onDelete(post._id);
      }
    });
    handleMenuClose();
  };

  const handleEditPost = () => {
    setIsEditingPost(true);
    handleMenuClose();
  };

  const handleSavePost = async () => {
    try {
      await api.put(`/api/posts/${post._id}`, { content: editedContent });
      setIsEditingPost(false);
      Swal.fire({
        icon: 'success',
        title: 'Post updated!',
        showConfirmButton: false,
        timer: 1500
      });
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to update post',
      });
    }
  };

  const handleAddComment = () => {
    if (commentText.trim()) {
      onAddComment(post._id, commentText);
      setCommentText('');
    }
  };

  const handleEditComment = (comment) => {
    setEditingCommentId(comment._id);
    setEditCommentText(comment.content);
  };

  const handleSaveComment = async (commentId) => {
    try {
      await api.put(`/api/comments/${commentId}`, { content: editCommentText });
      setEditingCommentId(null);
      Swal.fire({
        icon: 'success',
        title: 'Comment updated!',
        showConfirmButton: false,
        timer: 1500
      });
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to update comment',
      });
    }
  };

  const handleDeleteComment = (commentId) => {
    Swal.fire({
      title: 'Delete Comment?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Delete'
    }).then((result) => {
      if (result.isConfirmed) {
        onDeleteComment(post._id, commentId);
      }
    });
  };

  const isLiked = post.likes?.some(like => like.user === currentUser?._id);

  return (
    <Paper sx={{ p: 2, mb: 3, borderRadius: 2 }}>
      {/* Post Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Avatar src={post.user?.avatar} sx={{ mr: 2 }} />
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
              {post.user?.username}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
            </Typography>
          </Box>
        </Box>
        
        {(post.user?._id === currentUser?._id) && (
          <>
            <IconButton onClick={handleMenuOpen}>
              <MoreIcon />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
            >
              <MenuItem onClick={handleEditPost}>
                <EditIcon sx={{ mr: 1 }} /> Edit
              </MenuItem>
              <MenuItem onClick={handleDeletePost}>
                <DeleteIcon sx={{ mr: 1 }} /> Delete
              </MenuItem>
            </Menu>
          </>
        )}
      </Box>

      {/* Post Content */}
      {isEditingPost ? (
        <Box sx={{ mb: 2 }}>
          <TextField
            fullWidth
            multiline
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
            sx={{ mb: 2 }}
          />
          <Button 
            variant="contained" 
            onClick={handleSavePost}
            sx={{ mr: 2 }}
          >
            Save
          </Button>
          <Button 
            variant="outlined" 
            onClick={() => setIsEditingPost(false)}
          >
            Cancel
          </Button>
        </Box>
      ) : (
        <Typography sx={{ mb: 2 }}>{post.content}</Typography>
      )}

      {/* Media */}
      {post.media?.length > 0 && (
        <Box sx={{ mb: 2 }}>
          <MediaDisplay media={post.media} />
        </Box>
      )}

      {/* Post Stats */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
        <Typography variant="caption" color="text.secondary">
          {post.likes?.length || 0} likes
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {post.comments?.length || 0} comments
        </Typography>
      </Box>

      {/* Post Actions */}
      <Divider sx={{ my: 1 }} />
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Button 
          startIcon={isLiked ? <LikeIcon color="primary" /> : <LikeOutlineIcon />}
          sx={{ 
            textTransform: 'none',
            color: isLiked ? '#5858FA' : 'gray',
            borderRadius: 1,
            flex: 1
          }}
          onClick={handleLike}
        >
          Like
        </Button>
        <Button 
          startIcon={<CommentIcon />}
          sx={{ 
            textTransform: 'none',
            color: 'gray',
            borderRadius: 1,
            flex: 1
          }}
        >
          Comment
        </Button>
        <Button 
          startIcon={<ShareIcon />}
          sx={{ 
            textTransform: 'none',
            color: 'gray',
            borderRadius: 1,
            flex: 1
          }}
        >
          Share
        </Button>
      </Box>
      <Divider sx={{ my: 1 }} />

      {/* Comments */}
      <Box sx={{ mt: 2 }}>
        {post.comments?.map(comment => (
          <Box key={comment._id} sx={{ mb: 2, display: 'flex' }}>
            <Avatar src={comment.user?.avatar} sx={{ width: 32, height: 32, mr: 1 }} />
            <Box sx={{ flex: 1 }}>
              <Box sx={{ 
                backgroundColor: '#f0f2f5', 
                p: 1.5, 
                borderRadius: 2,
                position: 'relative'
              }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                  {comment.user?.username}
                </Typography>
                
                {editingCommentId === comment._id ? (
                  <Box sx={{ display: 'flex', mt: 1 }}>
                    <TextField
                      fullWidth
                      size="small"
                      value={editCommentText}
                      onChange={(e) => setEditCommentText(e.target.value)}
                      sx={{ mr: 1 }}
                    />
                    <Button 
                      size="small" 
                      variant="contained"
                      onClick={() => handleSaveComment(comment._id)}
                    >
                      Save
                    </Button>
                    <Button 
                      size="small" 
                      variant="outlined"
                      onClick={() => setEditingCommentId(null)}
                      sx={{ ml: 1 }}
                    >
                      Cancel
                    </Button>
                  </Box>
                ) : (
                  <Typography variant="body2">{comment.content}</Typography>
                )}
                
                {(comment.user?._id === currentUser?._id || post.user?._id === currentUser?._id) && (
                  <Box sx={{ position: 'absolute', top: 4, right: 4 }}>
                    {comment.user?._id === currentUser?._id && (
                      <IconButton size="small" onClick={() => handleEditComment(comment)}>
                        <EditIcon fontSize="small" />
                      </IconButton>
                    )}
                    <IconButton size="small" onClick={() => handleDeleteComment(comment._id)}>
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                )}
              </Box>
              <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
                {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
              </Typography>
            </Box>
          </Box>
        ))}

        {/* Add Comment */}
        <Box sx={{ display: 'flex', mt: 2 }}>
          <Avatar src={currentUser?.avatar} sx={{ width: 32, height: 32, mr: 1 }} />
          <Box sx={{ flex: 1 }}>
            <TextField
              fullWidth
              placeholder="Write a comment..."
              variant="outlined"
              size="small"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 20,
                  backgroundColor: '#f0f2f5'
                }
              }}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && commentText.trim()) {
                  handleAddComment();
                }
              }}
            />
          </Box>
        </Box>
      </Box>
    </Paper>
  );
};

export default Post;