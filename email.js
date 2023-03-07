const headers = new Headers();
headers.append("Content-Type", "application/json");

const email = async (subject, text) => {
  let body = JSON.stringify({
    from: "Cita Extranjería 🇪🇸 <jhone_2001@hotmail.com>",
    to: "jhone2001@gmail.com",
    subject,
    text,
    attachments: [
      {
        filename: "extranjeria.png",
        path: "./extranjeria.png",
      },
    ],
  });

  await fetch("http://localhost:3000/send-email", {
    method: "POST",
    body: body,
    headers: headers,
  });
};

module.exports.email = email;
