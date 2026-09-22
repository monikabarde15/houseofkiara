import { connectDB } from './config/db.js';
connectDB().then(() => {
  console.log("Success!");
  process.exit(0);
}).catch(err => {
  console.error("Error connecting:");
  console.error(err);
  process.exit(1);
});
