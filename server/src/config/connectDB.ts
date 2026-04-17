import mongoose, { Connection, Mongoose } from "mongoose";

interface CacheMongoose {
  conn: Connection | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  var mongoose: CacheMongoose;
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB(DB_URL: string) {
  if (cached.conn) {
    return cached.conn;
  }
  if (!cached.promise) {
    const opts = { bufferCommands: false, maxPoolSize: 10 };
    cached.promise = mongoose.connect(DB_URL, opts).then((mongoose) => {
      return mongoose;
    });
  }
  try {
    const mongooseInstance = await cached.promise;
    cached.conn = mongooseInstance.connection;
  } catch (error) {
    cached.promise = null;
    throw error;
  }
}

export default connectDB;

// import mongoose, { Connection } from "mongoose";

// interface MongooseCache {
//   conn: Connection | null;
//   promise: Promise<typeof mongoose> | null;
// }

// declare global {
//   var mongoose: MongooseCache;
// }

// let cached = global.mongoose;

// if (!cached) {
//   cached = global.mongoose = { conn: null, promise: null };
// }

// async function connectDB(db_url: string) {
//   if (cached.conn) {
//     return cached.conn;
//   }

//   if (!cached.promise) {
//     const opts = {
//       bufferCommands: false,
//       // For serverless, smaller pool sizes are often recommended
//       maxPoolSize: 10,
//     };

//     cached.promise = mongoose.connect(db_url, opts).then((mongoose) => {
//       return mongoose;
//     });
//   }

//   try {
//     const mongooseInstance = await cached.promise;
//     cached.conn = mongooseInstance.connection;
//   } catch (e) {
//     cached.promise = null;
//     throw e;
//   }

//   return cached.conn;
// }

// export default connectDB;
