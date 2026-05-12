require('dotenv').config();

const app = require("./app");
const connectDB = require('./config/db.config.js');


const PORT = process.env.PORT || 3000;

const startServer = async () => {

    connectDB();

  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
};

startServer();