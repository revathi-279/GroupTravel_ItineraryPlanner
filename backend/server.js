import dotenv from "dotenv";
//Loads .env variables into process.env
dotenv.config(); 
import app from "./src/app.js";
import connectDB from "./src/config/db.js";

connectDB();
const PORT = process.env.PORT || 2700;
// Run the port
app.listen(PORT,()=>{
    console.log(`Server running on port ${PORT}`)
})
