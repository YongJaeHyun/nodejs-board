const express = require("express");
const http = require("http");
const app = express();
const cors = require("cors");
const formidable = require("formidable");
const fs = require("fs");

process.env.PORT = 3000;

app.set("views", __dirname + "/views");
app.set("view engine", "ejs");
process.env.PORT = 3000;
app.set("port", process.env.PORT || 3001);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/uploads"));

let pList = [];
let no = 1;

app.get("/", (req, res) => {
  res.render("index", { pList });
});

app.post("/fileUpload", (req, res) => {
  const form = new formidable.IncomingForm();
  form.parse(req, function (err, fields, files) {
    const oldPath = files.img.filepath;
    const newPath = `./src/uploads/${files.img.originalFilename}`;
    const rawData = fs.readFileSync(oldPath);
    pList.push({
      no: no++,
      id: fields.id,
      name: fields.name,
      email: fields.email,
      img: `http://localhost:3000/${files.img.originalFilename}`,
    });
    fs.writeFile(newPath, rawData, function (err) {
      if (err) console.log(err);
    });
  });
  res.redirect("/");
});

const server = http.createServer(app);
server.listen(app.get("port"), () => {
  console.log("Node.js 서버 실행 중 ... http://localhost:" + app.get("port"));
});
