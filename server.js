// get express module
const express = require("express");
require('dotenv').config(); // Load .env file
const rateLimit = require("express-rate-limit"); // Import rate limiting middleware
const cors = require('cors');
const { apiKey, port } = require("./config"); //load env variables
const app = express();

const corsOptions = {
  origin: 'http://localhost:5173', //using this for now
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

// Middleware
function errorHandler(err, req, res, next) {
  console.error("Error Caught:", err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
}

// Rate limiting middleware
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many requests, please try again later.'
  }
});


app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('/test', (req, res, next) => {
  try {  
    throw new Error("You did nothing wrong.");
    res.send('Hello World!');
  } catch (error) {
    next(error);
  }
});

app.get('/api/news', cors(corsOptions), async (req, res, next) => {
  const queries = ["mental+health", "sanity", "being+social", "mental+health+support"];
  const randomQuery = queries[(Math.floor(Math.random() * queries.length))];
  const apiUrl = `https://newsapi.org/v2/everything?q=${randomQuery}&from=2024&apiKey=${apiKey}`;

  try {
    const fetch = (await import('node-fetch')).default; // Dynamic import
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error('Network response was not ok ' + response.statusText);
    }
    const data = await response.json(); // Parsing the JSON data from the response
    //add custom keyword to json
    data.keyword = randomQuery;
    console.log('User Data:', data);
    res.send(data);
  }catch (error) {
    console.error('There was a problem with the fetch operation:', error);
    next(error); // Pass the error to the error handler
  }
});


// Apply the rate limiting middleware to API routes only
app.use('/api/', apiLimiter);
// Add the error handler as middleware
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
