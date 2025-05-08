import React, { useState } from 'react';
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  Divider,
  Chip
} from '@mui/material';
import {
  Close as CloseIcon,
  AddPhotoAlternate as ImageIcon,
  Videocam as VideoIcon
} from '@mui/icons-material';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 500,
  bgcolor: 'background.paper',
  borderRadius: 2,
  boxShadow: 24,
  p: 3,
  outline: 'none'
};

const CreatePostModal = ({ open, onClose, onSubmit }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [media, setMedia] = useState([]);
  const [mediaPreviews, setMediaPreviews] = useState([]);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const newMedia = [...media, ...files];
    setMedia(newMedia);

    // Create previews
    const newPreviews = files.map(file => {
      return file.type.startsWith('video/') 
        ? { type: 'video', url: URL.createObjectURL(file) }
        : { type: 'image', url: URL.createObjectURL(file) };
    });
    setMediaPreviews([...mediaPreviews, ...newPreviews]);
  };

  const removeMedia = (index) => {
    const newMedia = [...media];
    const newPreviews = [...mediaPreviews];
    
    newMedia.splice(index, 1);
    newPreviews.splice(index, 1);
    
    setMedia(newMedia);
    setMediaPreviews(newPreviews);
  };

  const handleSubmit = () => {
    onSubmit({
      title,
      description,
      media
    });
    resetForm();
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setMedia([]);
    setMediaPreviews([]);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={style}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">Create Post</Typography>
          <IconButton onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </Box>
        
        <Divider sx={{ mb: 2 }} />
        
        <TextField
          fullWidth
          label="Title"
          variant="outlined"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          sx={{ mb: 2 }}
        />
        
        <TextField
          fullWidth
          label="Description"
          variant="outlined"
          multiline
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          sx={{ mb: 2 }}
        />
        
        {/* Media preview */}
        {mediaPreviews.length > 0 && (
          <Box sx={{ 
            display: 'flex', 
            flexWrap: 'wrap', 
            gap: 1, 
            mb: 2,
            maxHeight: 200,
            overflowY: 'auto'
          }}>
            {mediaPreviews.map((preview, index) => (
              <Box key={index} sx={{ position: 'relative' }}>
                {preview.type === 'video' ? (
                  <video
                    src={preview.url}
                    style={{ 
                      width: 100, 
                      height: 100,
                      objectFit: 'cover',
                      borderRadius: 1
                    }}
                    controls={false}
                  />
                ) : (
                  <img
                    src={preview.url}
                    alt={`Preview ${index}`}
                    style={{ 
                      width: 100, 
                      height: 100,
                      objectFit: 'cover',
                      borderRadius: 1
                    }}
                  />
                )}
                <IconButton
                  size="small"
                  sx={{ 
                    position: 'absolute', 
                    top: 0, 
                    right: 0,
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    color: 'white',
                    '&:hover': {
                      backgroundColor: 'rgba(0,0,0,0.7)'
                    }
                  }}
                  onClick={() => removeMedia(index)}
                >
                  <CloseIcon fontSize="small" />
                </IconButton>
              </Box>
            ))}
          </Box>
        )}
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
          <Box>
            <input
              accept="image/*,video/*"
              style={{ display: 'none' }}
              id="media-upload"
              type="file"
              multiple
              onChange={handleFileChange}
            />
            <label htmlFor="media-upload">
              <Button 
                startIcon={<ImageIcon />}
                component="span"
                sx={{ textTransform: 'none' }}
              >
                Photo
              </Button>
            </label>
            <label htmlFor="media-upload">
              <Button 
                startIcon={<VideoIcon />}
                component="span"
                sx={{ textTransform: 'none', ml: 1 }}
              >
                Video
              </Button>
            </label>
          </Box>
          
          <Button
            variant="contained"
            disabled={!title.trim() || !description.trim()}
            onClick={handleSubmit}
            sx={{ textTransform: 'none' }}
          >
            Post
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default CreatePostModal;