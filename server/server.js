console.log('Starting server...');
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5050;

const routes = require('./routes'); // <- this loads your API routes

app.use(cors());
app.use(express.json());
app.use('/api', routes);

app.get('/', (req, res) => {
  res.send('API is running...');
});

app.listen(PORT, (err) => {
  if (err) {
    console.error('Server failed to start:', err);
  } else {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
  }
});