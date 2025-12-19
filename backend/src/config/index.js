require('dotenv').config();

module.exports = {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  mongodbUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/gopass',
  
  // JWT config
  jwt: {
    accessSecret: process.env.JWT_ACCESS_SECRET || 'your-access-secret-key',
    refreshSecret: process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-key',
    accessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '15m',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  },

  // Mail config
  mail: {
    host: process.env.MAIL_HOST || 'smtp.gmail.com',
    port: process.env.MAIL_PORT || 587,
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
    from: process.env.MAIL_FROM || 'noreply@gopass.com',
  },

  // AI Scoring config
  aiScoring: {
    apiUrl: process.env.AI_SCORING_API_URL || 'http://localhost:8000/api/score',
    apiKey: process.env.AI_SCORING_API_KEY,
  },

  
  // vnSmartBot config
  vnSmartBot: {
    apiUrl: process.env.VNSMARTBOT_API_URL || 'https://assistant-stream.vnpt.vn/v1/conversation',
    authorization: process.env.VNSMARTBOT_AUTHORIZATION || '',
    tokenId: process.env.VNSMARTBOT_TOKEN_ID || '',
    tokenKey: process.env.VNSMARTBOT_TOKEN_KEY || '',
    botId: process.env.VNSMARTBOT_BOT_ID || '',
  },

  // Client URL for reset password links
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5001/api',
};
