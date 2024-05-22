// config.js
const dotenv = require('dotenv');
dotenv.config();
module.exports = {
  apiKey: process.env.API_KEY,
  port: process.env.PORT,
  apiUrl: process.env.AWS_IP,
  awsUrl: process.env.AWS_URL
};
