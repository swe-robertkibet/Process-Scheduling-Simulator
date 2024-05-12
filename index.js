const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();

// Set EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Serve static files from the /public directory
app.use(express.static(path.join(__dirname, 'public')));

// Middleware for parsing JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/', (req, res) => {
    res.render('index');
});

// Route for rendering the simulation page
app.get('/first-come-first-served', (req, res) => {
    res.render('fcfs');
});

app.get('/shortest-remaining-time', (req, res) => {
    res.render('srt');
});

app.get('/round-robin', (req, res) => {
    res.render('rr');
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
