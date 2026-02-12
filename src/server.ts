import "dotenv/config";
import express, { Request, Response } from "express";
import "module-alias/register";
import adminRoutes from "./routes/AdminRoutes";
import authRoutes from "./routes/AuthRoutes";
import locationRoutes from "./routes/LocationRoutes";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get("/", (req: Request, res: Response) =>
  res.json({ message: "Welcome to Election Backend API" }),
);
app.use("/auth", authRoutes);
app.use("/admin", adminRoutes);
app.use("/location", locationRoutes);

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
