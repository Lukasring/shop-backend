const fs = require("fs");

const requestHandler = (req, res) => {
  const url = req.url;
  const method = req.method;

  res.setHeader("Content-Type", "text/html");

  if (url === "/") {
    res.write("<html>");
    res.write("<head> <title>YOYOYOYO</title> </head>");
    res.write(
      "<body> <form action='/message' method='POST'><input type='text' name='message'/> <button type='submit'>Send</button> </from> </body>"
    );
    res.write("</html>");
    return res.end();
  }

  // res.write("<body> <h1>Hello</h1> </body>");
  if (url === "/message" && method === "POST") {
    const body = [];
    req.on("data", (chunk) => {
      // console.log("---data---");
      // console.log(chunk);
      body.push(chunk);
    });

    return req.on("end", () => {
      // console.log("---end---");
      const parsedBody = Buffer.concat(body).toString();
      // console.log(parsedBody);
      const message = parsedBody.split("=")[1];
      fs.writeFile("message.txt", message, (err) => {
        if (err) console.log(err);
        res.statusCode = 302;
        res.setHeader("Location", "/");
        return res.end();
      });
    });
  }
  res.write("<html>");
  res.write("<head> <title>MY FIRST PAGE</title> </head>");
  res.write("<body><h1>Hello bruh</h1></body>");
  res.write("</html>");
  res.end();
};

module.exports = requestHandler;
