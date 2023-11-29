const mongoose = require("mongoose");
const mongoURI = "mongodb://127.0.0.1:27017/colleges?directConnection=true";
// we are using mongoose to connect to mongo db....
const connectToMongo = () => {
  mongoose.set("strictQuery", true);

  mongoose.connect(mongoURI, (err) => {
    if (err) console.log(err);
    else console.log("mongdb is connected");
  });
};
module.exports = connectToMongo;
