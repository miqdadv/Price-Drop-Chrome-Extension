const mongoose = require("mongoose");

// Replace this with your MONGOURI.
const MONGOURI = 'mongodb+srv://taylor_abbas:mongodb123@cluster0.whhd7.mongodb.net/Trial1';

const InitiateMongoServer = async () => {
  try {
    await mongoose.connect(MONGOURI, {
      useNewUrlParser: true
    });
    console.log("Connected to DB !!");
    // return db;
  } catch (e) {
    console.log(e);
    throw e;
  }
};

module.exports = InitiateMongoServer;
