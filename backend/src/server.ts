import app from "./app";
import { prisma } from "./app";
import config from "./config";

const port = config.server.port;

const server = app.listen(port, () => {
  console.log(`Server running on port ${port}`);
  console.log(`Environment: ${config.environment}`);
});

process.on("SIGINT", async () => {
  console.log("Closing server and database connections...");
  server.close();
  await prisma.$disconnect();
  process.exit(0);
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
});

export default server;
