import { useState, useEffect, useRef } from 'react';
import { Box, IconButton, Slider, Typography } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import FullscreenIcon from '@mui/icons-material/Fullscreen';

export function VideoPlayer({ src, name }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const videoRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;

    const setVideoData = () => {
      setDuration(video.duration);
      setCurrentTime(video.currentTime);
    };

    const setVideoTime = () => setCurrentTime(video.currentTime);
    const handleVideoEnd = () => setIsPlaying(false);

    video.addEventListener('loadeddata', setVideoData);
    video.addEventListener('timeupdate', setVideoTime);
    video.addEventListener('ended', handleVideoEnd);

    return () => {
      video.removeEventListener('loadeddata', setVideoData);
      video.removeEventListener('timeupdate', setVideoTime);
      video.removeEventListener('ended', handleVideoEnd);
    };
  }, []);

  const formatTime = (time) => {
    if (isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const togglePlay = () => {
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleTimeChange = (_, value) => {
    const time = (value / 100) * duration;
    videoRef.current.currentTime = time;
    setCurrentTime(time);
  };

  const handleVolumeChange = (_, value) => {
    const newVolume = value / 100;
    videoRef.current.volume = newVolume;
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  };

  const handleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  return (
    <Box 
      ref={containerRef}
      sx={{ 
        width: '100%',
        bgcolor: 'background.paper',
        borderRadius: 1,
        overflow: 'hidden'
      }}
    >
      <Box sx={{ position: 'relative' }}>
        <video
          ref={videoRef}
          onClick={togglePlay}
          style={{
            width: '100%',
            display: 'block',
            cursor: 'pointer',
            backgroundColor: '#000'
          }}
          src={src}
        />
        
        {/* Video title */}
        <Typography 
          variant="subtitle1" 
          sx={{ 
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            p: 1,
            bgcolor: 'rgba(0,0,0,0.5)',
            color: 'white'
          }}
        >
          {name}
        </Typography>

        {/* Controls overlay */}
        <Box
          sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            bgcolor: 'rgba(0,0,0,0.7)',
            p: 1,
            transition: 'opacity 0.3s',
            '&:hover': { opacity: 1 },
            opacity: isPlaying ? 0.3 : 1
          }}
        >
          {/* Time slider */}
          <Slider
            size="small"
            value={(currentTime / duration) * 100 || 0}
            onChange={handleTimeChange}
            sx={{ 
              color: 'white',
              height: 4,
              '& .MuiSlider-thumb': {
                width: 8,
                height: 8,
                '&:hover, &.Mui-focusVisible': {
                  boxShadow: '0 0 0 8px rgba(255,255,255,0.16)'
                }
              }
            }}
          />
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {/* Play/Pause button */}
            <IconButton 
              onClick={togglePlay}
              sx={{ color: 'white' }}
              size="small"
            >
              {isPlaying ? <PauseIcon /> : <PlayArrowIcon />}
            </IconButton>
            
            {/* Time display */}
            <Typography variant="caption" sx={{ color: 'white', minWidth: 100 }}>
              {formatTime(currentTime)} / {formatTime(duration)}
            </Typography>

            {/* Volume controls */}
            <Box sx={{ display: 'flex', alignItems: 'center', ml: 'auto', gap: 1 }}>
              <IconButton 
                onClick={toggleMute}
                sx={{ color: 'white' }}
                size="small"
              >
                {isMuted ? <VolumeOffIcon /> : <VolumeUpIcon />}
              </IconButton>
              <Slider
                size="small"
                value={isMuted ? 0 : volume * 100}
                onChange={handleVolumeChange}
                sx={{ 
                  width: 60,
                  color: 'white',
                  '& .MuiSlider-thumb': {
                    width: 8,
                    height: 8
                  }
                }}
              />
            </Box>

            {/* Fullscreen button */}
            <IconButton 
              onClick={handleFullscreen}
              sx={{ color: 'white' }}
              size="small"
            >
              <FullscreenIcon />
            </IconButton>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
