import dotenv from 'dotenv';
dotenv.config();

const primary = {
    primary: {
      url: process.env.MONGO_URI,
      options: {
        dbName: process.env.MONGO_DB_NAME,
        retryWrites: true,
        minPoolSize: 10
      }
    },
  };
export default primary;

