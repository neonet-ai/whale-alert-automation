import cron from "node-cron";
import whaleAlert from "./src/main.js";

// Add a lock flag
let isRunning = false;

// Schedule the job to run every 45 minutes
cron.schedule("*/45 * * * *", async () => {
  if (isRunning) {
    console.log("Job is already running. Skipping this schedule.");
    return;
  }
  isRunning = true;
  try {
    await whaleAlert();
  } catch (err) {
    console.error("Scheduled job error:", err);
  } finally {
    isRunning = false;
  }
});

// Run once at startup
(async () => {
  if (isRunning) {
    console.log("Job is already running at startup. Skipping.");
    return;
  }
  isRunning = true;
  try {
    await whaleAlert();
  } catch (err) {
    console.error("Startup job error:", err);
  } finally {
    isRunning = false;
  }
})();
