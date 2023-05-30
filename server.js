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
      const markdownFiles = files.filter(file => path.extname(file).toLowerCase() === ".md");
      res.json({ files: markdownFiles });
    }
  });
});

app.get('/api/files/:fileName', (req, res) => {
  const fileName = req.params.fileName;
  const filePath = path.join(markdownFolder, fileName);

  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Error al leer el archivo Markdown' });
    } else {
      const htmlContent = marked(data);
      res.send(htmlContent);
    }
  });
});

app.post('/api/files', (req, res) => {
  const { filename, content } = req.body;
  fs.writeFile(`./markdown-files/${filename}.md`, content, (err) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
    } else {
      res.json({ message: 'File created successfully' });
    }
  });
});

app.listen(3000, () => {
  console.log('Servidor iniciado en http://localhost:3000');
});
