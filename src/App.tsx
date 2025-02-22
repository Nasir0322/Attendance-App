import React, { useState, useEffect } from 'react';
import { getDistance } from 'geolib';
import { Button, Container, Typography, Box, Alert, CircularProgress, Paper, Slide, Fade } from '@mui/material';
import { keyframes } from '@emotion/react';

interface Location {
  latitude: number;
  longitude: number;
}

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.1); }
  100% { transform: scale(1); }
`;

const App: React.FC = () => {
  const [userLocation, setUserLocation] = useState<Location | null>(null);
  const [isInRange, setIsInRange] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Given location (latitude and longitude)
  const givenLocation: Location = {
    latitude: 17.424231, 
    longitude: 78.667705,
  };

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ latitude, longitude });
          checkProximity({ latitude, longitude });
        },
        (err) => {
          setError(err.message);
        }
      );
    } else {
      setError('Geolocation is not supported by this browser.');
    }
  };

  const checkProximity = (userCoords: Location) => {
    const distance = getDistance(userCoords, givenLocation);
    if (distance <= 50) {
      setIsInRange(true);
    } else {
      setIsInRange(false);
    }
  };

  const handleSubmit = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
    }, 2000);
  };

  useEffect(() => {
    getUserLocation();
  }, []);

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh', 
        width: '100vw', 
        backgroundImage: 'url(/background.gif)',
        backgroundSize: 'cover', 
        backgroundPosition: 'center', 
      }}
    >
      <Container
        maxWidth="sm"
        sx={{
          textAlign: 'center',
          backgroundColor: 'rgba(255, 255, 255, 0.8)', 
          borderRadius: 2,
          p: 4,
          boxShadow: 3,
        }}
      >
        <Slide direction="down" in={true} mountOnEnter unmountOnExit>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
            Attendance Submission
          </Typography>
        </Slide>

        {error && (
          <Fade in={true}>
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          </Fade>
        )}

        {isSubmitted ? (
          <Fade in={true}>
            <Box sx={{ mt: 4 }}>
              <Alert severity="success" sx={{ mb: 3 }}>
                Attendance Successfully Submitted!
              </Alert>
              <Typography variant="h5" sx={{ color: 'green', animation: `${pulse} 2s infinite` }}>
                🎉 Thank you for submitting your attendance! 🎉
              </Typography>
            </Box>
          </Fade>
        ) : (
          <>
            {userLocation ? (
              <Fade in={true}>
                <Paper elevation={3} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
                  <Typography variant="body2" sx={{ color: isInRange ? 'green' : 'error.main' }}>
                    {isInRange
                      ? 'You are within 50 meters of the given location!'
                      : 'You are not within the required range.'}
                  </Typography>
                </Paper>
              </Fade>
            ) : (
              <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
                <CircularProgress />
              </Box>
            )}

            <Fade in={true}>
              <Button
                variant="contained"
                color="primary"
                disabled={!isInRange || isLoading}
                onClick={handleSubmit}
                sx={{ mt: 2, animation: isInRange ? `${pulse} 2s infinite` : 'none' }}
                size="large"
              >
                {isLoading ? <CircularProgress size={24} /> : 'Submit Attendance'}
              </Button>
            </Fade>
          </>
        )}
      </Container>
    </Box>
  );
};

export default App;