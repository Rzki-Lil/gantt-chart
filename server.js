const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

// Serve static files
app.use(express.static(path.join(__dirname)));
app.use('/dist', express.static(path.join(__dirname, 'dist')));
app.use('/src', express.static(path.join(__dirname, 'src')));


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});


app.get(['/gantt', '/gantt.html'], (req, res) => {
    res.sendFile(path.join(__dirname, 'gantt.html'));
});


app.listen(port, () => {
    console.log(`Server berjalan di http://localhost:${port}`);
}); 