const express = require("express");
const { sendApplicationEmail } = require("../utils/sendMail");
const sendMailService = require("../services/send-mail.service");
const router = express.Router();

router.post("/send-mail", async (req, res) => {
  try {
    const response=await sendMailService.sendMail();
    return res.json({ response });
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
