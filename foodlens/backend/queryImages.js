const mongoose = require('mongoose');
require('dotenv').config();

async function queryImages() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      dbName: 'FoodLens'
    });
    
    const images = await mongoose.connection.db.collection('images').find().toArray();
    console.log('Images in collection:', images);
    
    process.exit(0);
  } catch (error) {
    console.error('Error querying images:', error);
    process.exit(1);
  }
}

queryImages();
