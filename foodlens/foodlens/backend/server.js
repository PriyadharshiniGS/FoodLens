const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });


const app = express();

// Enable CORS
app.use(cors());

// Increase JSON payload size limit
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));


// Enable CORS
app.use(cors());

// Increase JSON payload size limit
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));




// Middleware
app.use(express.json());
app.use(cors());

// Base route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/Homee.html'));
});

// Use routes
app.use("/api/user", require('./routes/userRoutes'));  // User authentication routes
app.use("/api/food", require('./routes/foodRoutes'));  // Food-related routes
app.use("/api/goals", require('./routes/goalRoutes'));  // Goal-related routes
app.use("/api/nutrition", require('./routes/nutritionRoutes'));  // Nutrition tracking routes

// Serve static files from the frontend directory
app.use(express.static(path.join(__dirname, '../frontend')));

// Route to serve the main HTML file
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/Homee.html'));
});

app.use('/Homee.html', express.static(path.join(__dirname, '../frontend/Homee.html')));


// Port configuration
const PORT = process.env.PORT || 3000;

// MongoDB connection
console.log('Attempting to connect to MongoDB with URI:', process.env.MONGO_URI);
mongoose.connect(process.env.MONGO_URI, { 
  useNewUrlParser: true, 
  useUnifiedTopology: true,
  dbName: 'FoodLens' 
})
.then(() => {
  console.log("Connected to MongoDB database:", mongoose.connection.db.databaseName);
  
  // Start server
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
})
.catch(err => console.error("MongoDB connection error:", err));
