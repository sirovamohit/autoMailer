const express = require("express");
require("dotenv").config();
const socialRouter = require("./routers/social");
require("./cron/mailCron");


const app = express();
app.use(express.json());

// app.use('/', (req, res) => {
//   res.send("Hello World!");
// })

app.use("/social", socialRouter);



app.listen(process.env.PORT, () => {
  console.log("listening to PORT : ", process.env.PORT);
});
