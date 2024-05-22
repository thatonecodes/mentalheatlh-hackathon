// get express module
const express = require("express");
require('dotenv').config(); // Load .env file
const fs = require("fs");
const path = require("path");
const rateLimit = require("express-rate-limit"); // Import rate limiting middleware
const cors = require('cors');
const { apiKey, port, awsUrl } = require("../config/config"); //load env variables
const app = express();

const corsOptions = {
  origin: awsUrl, //using this for now
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

// Middleware
function errorHandler(err, req, res, next) {
  console.error("Error Caught:", err.stack);
  console.error(err);
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
  const randomQuery = queries[Math.floor(Math.random() * queries.length)];
  const apiUrl = `https://newsapi.org/v2/everything?q=${randomQuery}&from=2024&apiKey=${apiKey}`;

  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error('Network response was not ok ' + response.statusText);
    }
    const data = await response.json(); // Parsing the JSON data from the response
    
    // Add custom keyword to json
    data.keyword = randomQuery;
    console.log('User Data:', data);
    
    // Save the data to a file
    fs.writeFile(`news_${randomQuery}.json`, JSON.stringify(data, null, 2), (err) => {
      if (err) {
        console.error('Error writing to file:', err);
        next(err); // Pass the error to the error handler
        return;
      }
      console.log('Data has been written to file');
    });
    
    res.send(data);
  } catch (error) {
    console.error('There was a problem with the fetch operation:', error);
    next(error); // Pass the error to the error handler
  }
});

app.use('/images', express.static(path.join(__dirname, 'public/assets')));

app.get('/api/memorymatch', cors(corsOptions), async (req, res, next) => {
    const filePath = path.join(__dirname, 'public/cards.json');
    console.log(filePath);
    // Check if the file exists
    fs.access(filePath, fs.constants.F_OK, (err) => {
        if (err) {
            // File does not exist
            return next({ status: 404, message: 'File not found' });
        }

        // Read the file and send its content
        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
                // Error reading the file
                return next({ status: 500, message: 'Error reading file' });
            }

            // Send the file content as JSON
            try {
                const jsonData = JSON.parse(data);
                res.json(jsonData);
            } catch (parseErr) {
                next({ status: 500, message: 'Error parsing JSON' });
            }
        });
    });
});
// Apply the rate limiting middleware to API routes only
app.use('/api/', apiLimiter);
// Add the error handler as middleware
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
