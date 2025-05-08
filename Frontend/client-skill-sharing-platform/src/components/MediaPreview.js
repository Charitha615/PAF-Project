import React from 'react';
import { Box, IconButton, Chip } from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';

const MediaPreview = ({ media, onRemove }) => {
  return (
    <Box sx={{ 
      display: 'flex',
      flexWrap: 'wrap',
      gap: 1,
      mb: 2
    }}>
      {media.map((file, index) => (
        <Box 
          key={index}
          sx={{
            position: 'relative',
            width: 100,
            height: 100,
            borderRadius: 1,
            overflow: 'hidden'
          }}
        >
          {file.type.startsWith('image/') ? (
            <img
              src={URL.createObjectURL(file)}
              alt="Preview"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover'
              }}
            />
          ) : (
            <video
              src={URL.createObjectURL(file)}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover'
              }}
            />
          )}
          <IconButton
            size="small"
            sx={{
              position: 'absolute',
              top: 4,
              right: 4,
              backgroundColor: 'rgba(0,0,0,0.5)',
              color: 'white',
              '&:hover': {
                backgroundColor: 'rgba(0,0,0,0.7)'
              }
            }}
            onClick={() => onRemove(index)}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
          <Chip
            label={file.type.startsWith('video/') ? 'Video' : 'Image'}
            size="small"
            sx={{
              position: 'absolute',
              bottom: 4,
              left: 4,
              backgroundColor: 'rgba(0,0,0,0.7)',
              color: 'white'
            }}
          />
        </Box>
      ))}
    </Box>
  );
};

export default MediaPreview;