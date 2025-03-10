const bitrixService = require('../service/OAuthService');
const InstallEvent = require('../models/Install');
const axios = require('axios');

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;

// Xử lý callback OAuth từ Bitrix24
const handleAuthCallback = async (req, res) => {
  const { code } = req.query;

  if (!code) {
    return res.status(400).send('Missing authorization code');
  }

  try {
    const response = await axios.post('https://oauth.bitrix.info/oauth/token/', {
      grant_type: 'authorization_code',
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      code,
      redirect_uri: REDIRECT_URI,
    });

    const tokens = {
      access_token: response.data.access_token,
      refresh_token: response.data.refresh_token,
      expires_in: response.data.expires_in,
    };

    await bitrixService.saveTokens(tokens);
    res.send('Authorization successful! You can now use the app.');
  } catch (error) {
    console.error('OAuth error:', error.response?.data || error.message);
    res.status(500).send('Authorization failed');
  }
};

// Xử lý sự kiện Install App
const handleInstallEvent = async (req, res) => {
  const { auth, application_token } = req.body;

  try {
    const existingInstall = await InstallEvent.findOne({ application_token });

    let isFirstInstall = false;
    if (!existingInstall) {
      isFirstInstall = true;
    }

    const installEvent = new InstallEvent({
      application_token,
      installed_at: new Date(),
      is_first_install: isFirstInstall,
    });
    await installEvent.save();

    res.send('OK');
  } catch (error) {
    console.error('Error handling install event:', error.message);
    res.status(500).send('Failed to process install event');
  }
};

module.exports = { handleAuthCallback, handleInstallEvent, getContacts };