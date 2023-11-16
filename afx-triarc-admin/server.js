const express = require('express');
const path = require('path');
const app = express();
const port = 5001;

app.use('/static', express.static(path.join(__dirname, 'build/static')));
app.use('/images', express.static(path.join(__dirname, 'build/images')));
app.use('/icons', express.static(path.join(__dirname, 'build/icons')));
app.use('/css', express.static(path.join(__dirname, 'build/css')));
app.use(express.static(path.join(__dirname, 'build')));


app.get('/*', function (req, res) {
  res.sendFile(path.join(`${__dirname}/build/index.html`));
});

// Start the server on the specified port
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
