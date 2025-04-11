const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const userRoutes = require('./routes/userRoutes');

app.use(cors());
app.use(express.json());
app.use(userRoutes);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
