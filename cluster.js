const cluster = require("cluster");
const os = require("os");
const logger = require("./services/logger");

process.env.UV_THREADPOOL_SIZE = os.cpus().length;

if (cluster.isMaster) {
  const cpus = process.env.UV_THREADPOOL_SIZE;

  logger.warn(`Forking for ${cpus} threads`);

  for (let i = 0; i < cpus; i++) {
    cluster.fork();
  }

  cluster.on("exit", (worker, code, signal) => {
    logger.warn(`worker ${worker.process.pid} died`);
    cluster.fork(); // Create a New Worker, If Worker is Dead
  });
} else {
  require("./app");
}
