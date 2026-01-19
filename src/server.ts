import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import quesRoutes from "./routes/question.route.js";
import testRoutes from "./routes/test.route.js";
import companyRoutes from "./routes/company.route.js";
import adminRoutes from "./routes/admin.route.js";
import mongoose from "mongoose";

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT;

async function connectMongoDB() {
    await mongoose.connect(process.env.MONGO_URI as string);
    console.log("MONGOdb connected!");
};

app.use("/api/question", quesRoutes);
app.use("/api/test", testRoutes);
app.use("/api/company", companyRoutes);
app.use("/api/admin", adminRoutes); 


connectMongoDB();


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});