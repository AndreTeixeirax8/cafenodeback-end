/**Projeto feito de acordo com o curso disponivel no youtube
 * link do curso =
 * https://www.youtube.com/watch?v=ZHg2u4QNUdw&list=PLdRq0mbeEBmybqNI7hdNPp8RrYaIVkZlW&index=1
 */
const express = require("express");
var cors = require("cors");
const connection = require("./connection");
const userRoute = require("./routes/user");
const categoryRoute = require("./routes/category");
const productRoute = require("./routes/product");
const billRoute = require('./routes/bill')
const dashboardRoute = require('./routes/dashboard')
const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/user", userRoute);
app.use("/category", categoryRoute);
app.use("/product", productRoute);
app.use('/bill',billRoute);
app.use('/dashboard',dashboardRoute);


module.exports = app;
