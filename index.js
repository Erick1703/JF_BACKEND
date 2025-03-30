import app from "./src/app.js";
import { connectDB } from "./src/db.js";

connectDB();
app.listen(3000) 
console.log("Server running on port", 3000) 