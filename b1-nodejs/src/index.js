const express = require('express');
const connectDB = require('./config/mongodb');
import initApiRouter from "./routes/api";
require('dotenv').config();

const app = express();

// Kết nối MongoDB
connectDB();

app.use(express.json());
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
  });

//init web router
initApiRouter(app);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server running on port http://localhost:${PORT}`));
