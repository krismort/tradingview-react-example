const express = require('express');
const app = express();
const portNumber = 3002;
const sourceDir = process.cwd() + '/coin-panel-chart/build';

app.use(express.static(sourceDir));

app.listen(portNumber, () => {
  console.log(`Web app started: http://localhost:${portNumber}`);
  console.log(`Serving content from /${sourceDir}/`);
});
