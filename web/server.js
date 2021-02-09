var express = require("express");
var app = express();
var cors = require("cors");
var fs = require("fs");
var path = require("path");

app.use(cors());
app.use(express.json());
app.use(express.static("docs"));

app.get("*", async (req, res, next) => {
  var file = req.url.split("/").pop().replace(/[^0-9a-zA-Z_.]/g,"");
  //console.log("ue");
  //console.log(path.join("./docs", file))
  if (file.length > 0 && fs.existsSync(__dirname+"/docs/"+file)) {
    res.sendFile(__dirname+"/docs/"+file);
  } else {
    res.sendFile(__dirname+"/docs/index.html");
  }
})

var port = process.argv[2] || "80";
app.listen(80);

console.log("Listening on port " + port + ".");
