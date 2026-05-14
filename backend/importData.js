const mongoose = require('mongoose');
const dotenv = require('dotenv');
const fs = require('fs');
const Data = require('./models/Data');

dotenv.config();

const rawData = fs.readFileSync('./jsondata.json', 'utf-8');
const jsonData = JSON.parse(rawData);

const importData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected!');

    await Data.deleteMany({});
    console.log('Old data cleared!');

    await Data.insertMany(jsonData);
    console.log(`${jsonData.length} records imported!`);

    process.exit();
  } catch (error) {
    console.log('Error:', error);
    process.exit(1);
  }
};

importData();