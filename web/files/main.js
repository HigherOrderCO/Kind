const express = require("express");
const app = express();
const path = require("path");
const cors = require("cors");

app.use(cors());
app.use(express.static(path.join(__dirname, "..", "..", "base")));
app.get('*', (req, res) => { res.send(''); });
app.listen(7172)



