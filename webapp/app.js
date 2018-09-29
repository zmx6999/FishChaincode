const express = require("express");
const app = express();
require("express-async-error");
const morgan = require("morgan");
app.use(morgan("combined"));
const bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(require("./middleware/res"));
app.use("/fish",require("./router/fish"));
app.use((err,req,res,next) => {
    res.fail(err.toString());
});
app.listen(8000);
