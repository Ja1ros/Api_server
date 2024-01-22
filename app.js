require('dotenv').config()
const Server = require('./Models/Server/server.js');
const server = new Server();
server.start();