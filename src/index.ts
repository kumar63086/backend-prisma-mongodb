import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import "dotenv/config";
import cookieParser from "cookie-parser";
import cors from "cors";
import rouetes from "./routes/userroutes";
import postRouter from "./routes/postroutes";

const userRouter = rouetes;

// Initialize the Express app
const app = express();
const Port = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors()); // Optional: Enable CORS

// Routes
app.get("/", (req: Request, res: Response) => {
    res.send("Hello World...!");
});
app.use("/api", userRouter); // Apply user routes
app.use("/api", postRouter); // Apply post routes
// Error Handling Middleware
app.use((err: Error, req: Request, res: Response, next: Function) => {
    console.error(err.stack);
    res.status(500).send("Something went wrong!");
});

// Start the server
app.listen(Port, () => {
    console.log(`Server is running on port ${Port}`);
});
