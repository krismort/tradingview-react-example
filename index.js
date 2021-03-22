const express = require('express');
const app = express();
const path = require('path');

const port = process.env.PORT || 3001;
const sourceDir = path.join(process.cwd(), 'chart', 'build');

require('./service/src/app')(app, '/api');

app.use(express.static(sourceDir));

app.listen(port, () => {
  console.log(`Web app started: http://localhost:${port}`);
  console.log(`Serving content from /${sourceDir}/`);
});

