const axios = require('axios');
require('dotenv').config();

let token = null;

const getToken = async () => {
  const response = await axios.post(
    'https://accounts.spotify.com/api/token',
    'grant_type=client_credentials',
    {
      headers: {
        Authorization:
          'Basic ' +
          Buffer.from(
            process.env.SPOTIFY_CLIENT_ID + ':' + process.env.SPOTIFY_CLIENT_SECRET
          ).toString('base64'),
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }
  );
  token = response.data.access_token;
};

const getTracksFromPlaylist = async (playlistUrl) => {
  if (!token) {
    await getToken();
  }

  const playlistId = playlistUrl.split('/').pop().split('?')[0];
  const response = await axios.get(
    `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );

  return response.data.items;
};

module.exports = { getTracksFromPlaylist };
