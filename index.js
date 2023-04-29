/**Projeto feito de acordo com o curso disponivel no youtube
 * link do curso =
 * https://www.youtube.com/watch?v=ZHg2u4QNUdw&list=PLdRq0mbeEBmybqNI7hdNPp8RrYaIVkZlW&index=1
 */
const express = require("express");
var cors = require("cors");
const connection = require("./connection");
const userRoute = require("./routes/user");
const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/user", userRoute);

module.exports = app;
