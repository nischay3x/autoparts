import mongoose from "mongoose";

const MONGO_URI =
  "mongodb+srv://tusharkumar:jvoCKE2ULQVodHEg@cluster0.ffbncr0.mongodb.net/autoparts?appName=mongosh+1.6.0";

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  // if (cached.conn) {
  //  return cached.conn;
  // }

  //  if (!cached.promise) {
  const opts = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    // bufferCommands: false,
    // bufferMaxEntries: 0,
    // useFindAndModify: true,
    // useCreateIndex: true
  };

  cached.promise = mongoose
    .connect(
      "mongodb+srv://tusharkumar:jvoCKE2ULQVodHEg@cluster0.ffbncr0.mongodb.net/autoparts?appName=mongosh+1.6.0",
      opts
    )
    .then((mongoose) => {
      return mongoose;
    });
  //  }
  cached.conn = await cached.promise;
  return cached.conn;
}

export default connectDB;
