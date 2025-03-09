import { useState, useEffect } from 'react';
import { Grid, Box, Card, CardMedia, CardContent, Typography, IconButton, Grow, CircularProgress, Modal, Menu, MenuItem } from '@mui/material';
import AudioFileIcon from '@mui/icons-material/AudioFile';
import VideoFileIcon from '@mui/icons-material/VideoFile';
import DownloadIcon from '@mui/icons-material/Download';
import CloseIcon from '@mui/icons-material/Close';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';
import { EmptyState } from './EmptyState';
import { AudioPlayer } from './AudioPlayer';
import { VideoPlayer } from './VideoPlayer';
import { DeleteDialog } from './DeleteDialog';

const API_URL = 'http://localhost:3000/api';

export function MediaGallery({ onDelete }) {
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  useEffect(() => {
    loadMedia();
  }, []);

  const handleMenuOpen = (event, item) => {
    event.stopPropagation();
    setMenuAnchor(event.currentTarget);
    setSelectedItem(item);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
    setSelectedItem(null);
  };

  const handleDeleteClick = () => {
    handleMenuClose();
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await axios.delete(`${API_URL}/media/${selectedItem.name}`);
      setDeleteDialogOpen(false);
      setSelectedItem(null);
      if (onDelete) onDelete();
      loadMedia();
    } catch (err) {
      console.error('Failed to delete media:', err);
    }
  };

  const loadMedia = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/media`);
      setMedia(response.data);
    } catch (err) {
      console.error('Failed to load media:', err);
    } finally {
      setLoading(false);
    }
  };

  const isImage = (type) => type.startsWith('image/');
  const isAudio = (type) => type.startsWith('audio/');
  const isVideo = (type) => type.startsWith('video/');

  const MediaControls = ({ item }) => (
    <>
      <IconButton
        sx={{
          position: 'absolute',
          right: 8,
          top: 8,
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.9)'
          },
          zIndex: 2
        }}
        href={`http://localhost:3000${item.path}`}
        download={item.name}
        onClick={(e) => e.stopPropagation()}
      >
        <DownloadIcon />
      </IconButton>
      <IconButton
        sx={{
          position: 'absolute',
          left: 8,
          top: 8,
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.9)'
          },
          zIndex: 2
        }}
        onClick={(e) => handleMenuOpen(e, item)}
      >
        <MoreVertIcon />
      </IconButton>
    </>
  );

  return (
    <Box sx={{ flexGrow: 1, p: 3, mt: 2 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 4, fontWeight: 'medium' }}>
        Your Creations
      </Typography>
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : media.length === 0 ? (
        <EmptyState />
      ) : (
        <Grid container spacing={3} sx={{ position: 'relative' }}>
          {media.map((item, index) => (
            <Grid item xs={12} sm={6} md={4} key={item.path}>
              <Grow in timeout={300 + index * 100}>
                <Card sx={{ 
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 6
                  },
                  position: 'relative'
                }}>
                  {isVideo(item.type) ? (
                    <Box sx={{ width: '100%', position: 'relative' }}>
                      <MediaControls item={item} />
                      <VideoPlayer
                        src={`http://localhost:3000${item.path}`}
                        name={item.name}
                      />
                    </Box>
                  ) : isImage(item.type) ? (
                    <Box 
                      sx={{ 
                        position: 'relative',
                        paddingTop: '100%',
                        cursor: 'pointer'
                      }}
                      onClick={() => setSelectedImage(item)}
                    >
                      <MediaControls item={item} />
                      <CardMedia
                        component="img"
                        image={`http://localhost:3000${item.path}`}
                        alt={item.name}
                        sx={{ 
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '100%',
                          height: '100%',
                          objectFit: 'contain',
                          bgcolor: 'grey.100',
                          padding: 1
                        }}
                      />
                    </Box>
                  ) : isAudio(item.type) && (
                    <>
                      <Box sx={{
                        height: 120,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        bgcolor: 'grey.100',
                        position: 'relative'
                      }}>
                        <AudioFileIcon sx={{ 
                          fontSize: 60,
                          color: 'grey.300',
                          opacity: 0.5
                        }} />
                        <MediaControls item={item} />
                      </Box>
                      <Box sx={{ p: 2, position: 'relative' }}>
                        <AudioPlayer 
                          src={`http://localhost:3000${item.path}`}
                          name={item.name}
                        />
                      </Box>
                    </>
                  )}
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="body1" noWrap>
                      {item.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      {new Date(item.uploadedAt).toLocaleDateString()}
                    </Typography>
                  </CardContent>
                </Card>
              </Grow>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Image Modal */}
      <Modal
        open={!!selectedImage}
        onClose={() => setSelectedImage(null)}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <Box sx={{ 
          position: 'relative',
          maxWidth: '90vw',
          maxHeight: '90vh',
          outline: 'none'
        }}>
          <IconButton
            onClick={() => setSelectedImage(null)}
            sx={{
              position: 'fixed',
              right: 20,
              top: 20,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              color: 'white',
              '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.7)'
              }
            }}
          >
            <CloseIcon />
          </IconButton>
          <img
            src={selectedImage ? `http://localhost:3000${selectedImage.path}` : ''}
            alt={selectedImage?.name}
            style={{
              maxWidth: '100%',
              maxHeight: '90vh',
              objectFit: 'contain',
              borderRadius: '4px',
              boxShadow: '0 8px 16px rgba(0,0,0,0.2)'
            }}
          />
        </Box>
      </Modal>

      {/* Item Menu */}
      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        <MenuItem onClick={handleDeleteClick} sx={{ color: 'error.main' }}>
          <DeleteIcon sx={{ mr: 1 }} /> Delete
        </MenuItem>
      </Menu>

      {/* Delete Confirmation Dialog */}
      <DeleteDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDeleteConfirm}
        itemName={selectedItem?.name || ''}
      />
    </Box>
  );
}
