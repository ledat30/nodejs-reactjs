const axios = require('axios');
const Token = require('../models/OAuth');

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const BITRIX_PORTAL = process.env.BITRIX_PORTAL;
const REDIRECT_URI = process.env.REDIRECT_URI;

// Lưu token vào MongoDB
async function saveTokens(tokens) {
  const newToken = new Token({
    access_token: tokens.access_token,
    refresh_token: tokens.refresh_token,
    expires_at: Date.now() + tokens.expires_in * 1000,
  });
  await Token.deleteMany({});
  await newToken.save();
  return newToken;
}

// Lấy token từ MongoDB
async function loadTokens() {
  return await Token.findOne({});
}

// Làm mới token khi hết hạn
async function refreshToken(refresh_token) {
  try {
    const response = await axios.post('https://oauth.bitrix.info/oauth/token/', {
      grant_type: 'refresh_token',
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      refresh_token: refresh_token,
    });

    const tokens = {
      access_token: response.data.access_token,
      refresh_token: response.data.refresh_token,
      expires_in: response.data.expires_in,
    };

    return await saveTokens(tokens);
  } catch (error) {
    throw new Error('Error refreshing token: ' + (error.response?.data?.error || error.message));
  }
}

// Lấy token hợp lệ
async function getValidToken() {
  let token = await loadTokens();
  if (!token) throw new Error('No tokens available. Please authorize first.');

  if (Date.now() >= token.expires_at) {
    token = await refreshToken(token.refresh_token);
  }
  return token.access_token;
}

// Gọi API Bitrix24
async function callBitrixApi(action, payload = {}) {
  try {
    const access_token = await getValidToken();
    const url = `${BITRIX_PORTAL}/rest/${action}`;
    const response = await axios.post(url, payload, {
      headers: { Authorization: `Bearer ${access_token}` },
      timeout: 10000,
    });
    return response.data;
  } catch (error) {
    if (error.code === 'ECONNABORTED') throw new Error('Network timeout');
    if (!error.response) throw new Error('Network error: No response from server');
    const errData = error.response.data;
    if (errData.error === 'expired_token') {
      const token = await loadTokens();
      await refreshToken(token.refresh_token);
      return callBitrixApi(action, payload);
    }
    throw new Error(`API error: ${errData.error || 'Unknown'} - ${errData.error_description || ''}`);
  }
}

module.exports = { saveTokens, callBitrixApi };