import 'dotenv/config.js';


import http from 'http';
import app from './app.js';

const server = http.createServer(app);
const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log('Server is running on http://localhost:3000');
})