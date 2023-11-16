const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send('Hello from AWS EC2!');
});

// Listen to the App Engine-specified port, or 8080 otherwise
const PORT = 5001;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}...`);
});