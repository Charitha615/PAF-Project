import React from 'react';
import { Box } from '@mui/material';
import ReactPlayer from 'react-player';

const MediaDisplay = ({ media }) => {
  if (!media || media.length === 0) return null;

  const isSingle = media.length === 1;
  const isDouble = media.length === 2;
  const isTriple = media.length >= 3;

  return (
    <Box sx={{ 
      display: 'grid',
      gap: 1,
      gridTemplateColumns: isSingle ? '1fr' : isDouble ? '1fr 1fr' : '1fr 1fr',
      gridTemplateRows: isTriple ? '200px 200px' : '300px',
      borderRadius: 2,
      overflow: 'hidden'
    }}>
      {media.map((item, index) => {
        const isVideo = item.type?.startsWith('video') || item.url?.includes('.mp4') || item.url?.includes('.mov');
        const url = item.url || URL.createObjectURL(item);

        return (
          <Box 
            key={index}
            sx={{
              gridColumn: isTriple && index === 0 ? '1 / 3' : 'auto',
              gridRow: isTriple && index === 0 ? '1' : 'auto',
              position: 'relative',
              overflow: 'hidden',
              borderRadius: 1
            }}
          >
            {isVideo ? (
              <ReactPlayer
                url={url}
                width="100%"
                height="100%"
                controls
                style={{ 
                  position: 'absolute',
                  top: 0,
                  left: 0
                }}
              />
            ) : (
              <img
                src={url}
                alt="Post media"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
              />
            )}
          </Box>
        );
      })}
    </Box>
  );
};

export default MediaDisplay;