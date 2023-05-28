const express = require('express');
const path = require('path');
const fs = require('fs');
const marked = require('marked');

const app = express();
const markdownFolder = path.join(__dirname, 'markdown-files');

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});



app.get('/api/files', (req, res) => {
  fs.readdir(markdownFolder, (err, files) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Error al obtener la lista de archivos Markdown' });
    } else {
      res.json({ files });
    }
  });
});


app.listen(3000, () => {
  console.log('Servidor iniciado en http://localhost:3000');
});

