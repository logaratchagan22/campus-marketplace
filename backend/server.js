// require("dotenv").config();
// const connectDB = require("./config/db");
// const app = require("./app");

// const PORT = process.env.PORT || 5000;

// async function start() {
//   await connectDB();
//   app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
// }

// start();
require("dotenv").config();
const connectDB = require("./config/db");
const app = require("./app");

// Render sets process.env.PORT to 10000 automatically. We default to 10000 to pass the port check.
const PORT = process.env.PORT || 10000;

async function start() {
  await connectDB();
  // Binds the app to host 0.0.0.0 so Render can detect and route public HTTP traffic to it
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on host 0.0.0.0 and listening on port ${PORT}`);
  });
}

start();
