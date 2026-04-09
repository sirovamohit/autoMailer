const nodemailer = require("nodemailer");
const path = require("path");

// --------- CONFIGURE YOUR TRANSPORTER ----------
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// --------- MAIN FUNCTION ----------
async function sendApplicationEmail(
  companyEmail,
  companyName,
  name
) {
  const subject = `Referral Request – Backend Engineer with 3 Years in Scalable Systems`;

  const message = `
Hi ${name},

I hope you're doing well! I came across your profile and noticed you're working at ${companyName} — it's a place I've been genuinely excited about, and I'd love to explore opportunities there.

I'm Mohit Sirova, a Backend Engineer with 3 years of experience building scalable, high-performance systems. Here's a quick snapshot of what I bring:

• Currently a Software Engineer at OfficeBanao, where I built a warehouse management system that pushed inventory accuracy to 99.2% and cut tax-filing delays by 90% via SAP & ClearTax integrations.

• At Cardekho, I engineered a real-time bidding platform handling 10K+ concurrent users with <200ms WebSocket latency and a Redis pipeline processing 15K+ operations/sec.

• Core stack: Node.js, NestJS, TypeScript, PostgreSQL, Redis, AWS — with strong foundations in LLD, OOP, and design patterns.

• IIT Kanpur graduate (B.Tech, 2022).

If there's a backend role open at ${companyName} that you think could be a fit, I'd truly appreciate a referral or even just a quick chat to learn more about the team.

Happy to share my resume or any additional details. Thanks so much for considering it!

Warm regards,
Mohit Sirova
+91-7976817711 | 2001msirova@gmail.com
https://www.linkedin.com/in/mohit-sirova-646a71209/
`;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: companyEmail,
    subject: subject,
    text: message,
    attachments: [
      {
        filename: "Mohit_Sirova.pdf",
        path: path.join(__dirname, "../../Mohit's Resume.pdf"),
      },
    ],
  };

  try {
    const data = await transporter.sendMail(mailOptions);
    return data
  } catch (error) {
    console.error("Failed to send email:", error);
  }
}


module.exports = { sendApplicationEmail }
