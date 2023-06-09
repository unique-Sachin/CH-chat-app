const mongoose = require("mongoose");

const connection = async () => {
  try {
    const res = await mongoose.connect(process.env.mongoURL);
    console.log(`mongoDB connected to ${res.connection.host}`);
  } catch (error) {
    console.log(`Connection interrupted for ${error}`);
  }
};

module.exports = connection;
