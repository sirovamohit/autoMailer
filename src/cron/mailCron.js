const cron = require("node-cron");
const sendMailService = require("../services/send-mail.service");

cron.schedule("0 */4 * * *", async () => {
  console.log("CRON STARTED: Sending emails...");

  try {
    await sendMailService.sendMail();
    console.log("CRON DONE: Emails sent.");
  } catch (err) {
    console.error("CRON ERROR:", err);
  }
});