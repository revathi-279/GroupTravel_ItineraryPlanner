import dotenv from "dotenv";
//Loads .env variables into process.env
dotenv.config(); 
console.log("CLIENT_URL =", process.env.CLIENT_URL);
import app from "./src/app.js";
import connectDB from "./src/config/db.js";

console.log(process.env.MONGO_URI);
connectDB();
const PORT = process.env.PORT || 2700;
// Run the port
app.listen(PORT,()=>{
    console.log(`Server running on port ${PORT}`)
})
