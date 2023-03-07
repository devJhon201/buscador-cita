const express = require("express");
const nodemailer = require("nodemailer");

const app = express();

app.use(express.json());

app.post("/send-email", async (req, res) => {
  const transporter = nodemailer.createTransport(
    {
      host: "smtp-mail.outlook.com",
      port: 587,
      auth: {
        user: "jhone_2001@hotmail.com",
        pass: "Jhoncar2001Jei1998",
      },
    },
    {
      priority: "high",
    }
  );

  const mailOptions = {
    from: req.body.from,
    to: req.body.to,
    subject: req.body.subject,
    text: req.body.text,
    attachments: req.body.attachments,
  };

  await transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      res.statusCode = 500;
      res.send(error.message);
      console.log(error.message);
    } else {
      console.log(info);
      res.send("Hecho");
    }
  });
});

app.listen(3000, () => {
  console.log("Servidor en localhost:3000");
});
