import dotenv from "dotenv";
import express from "express";
import cors from "cors";

import { exceptionHandler } from "./middlewares/exception-handler.js";

dotenv.config({ path: ".env.development" });

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use(exceptionHandler);

app.listen(PORT, () => {
  console.log(`Server is running at port ${PORT}`);
});
