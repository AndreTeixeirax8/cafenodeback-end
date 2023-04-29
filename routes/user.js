const express = require("express");
const connection = require("../connection");
const router = express.Router();

const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
require("dotenv").config();
var auth = require("../services/authentication");
var checkRole = require("../services/checkRole");

router.post("/signup", (req, res) => {
  let user = req.body;
  query = "select email,password,role,status from user where email=?";
  connection.query(query, [user.email], (err, results) => {
    if (!err) {
      if (results.length <= 0) {
        query =
          "insert into user(name,contactNumber,email,password,status,role) values(?,?,?,?,'false','user')";
        connection.query(
          query,
          [user.name, user.contactNumber, user.email, user.password],
          (err, results) => {
            if (!err) {
              return res.status(200).json({ message: "Sucesso no registro" });
            } else {
              return res.status(500).json(err);
            }
          }
        );
      } else {
        return res.status(400).json({ message: "email já existe" });
      }
    } else {
      return res.status(500).json(err);
    }
  });
});

router.post("/login", (req, res) => {
  const user = req.body;
  query = "select  email,password,role,status from user where email=?";
  connection.query(query, [user.email], (err, results) => {
    if (!err) {
      if (results.length <= 0 || results[0].password != user.password) {
        return res.status(401).json({ message: "Incorreto User ou senha" });
      } else if (results[0].status === "false") {
        return res.status(401).json({ message: "Wait for admin approvall" });
      } else if (results[0].password == user.password) {
        const response = { email: results[0].email, role: results[0].role };
        const acecessToken = jwt.sign(response, process.env.ACCESS_TOKEN, {
          expiresIn: "24h",
        });
        res.status(200).json({ token: acecessToken });
      } else {
        return res
          .status(400)
          .json({ message: "something went wrong. Please try again later" });
      }
    } else {
      return res.status(500).json(err);
    }
  });
});

var transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
});

router.post("/forgotPassword", (req, res) => {
  const user = req.body;
  query = "select email,password from user where email=?";
  connection.query(query, [user.email], (err, results) => {
    if (!err) {
      if (results.length <= 0) {
        return res
          .status(200)
          .json({ message: "Password enviado para seu e-mail" });
      } else {
        var mailOptions = {
          from: process.env.EMAIL,
          to: results[0].email,
          subject: "Password do Café",
          html:
            "<p><b>Seu login e detalhes do café</b><br><b>Email:</b>" +
            results[0].email +
            "<br><b>Password:</b>" +
            results[0].password +
            "<br><a href='http://localhost:4200'>Clique aqui para login</a></p>",
        };
        transporter.sendMail(mailOptions, function (error, info) {
          if (error) {
            console.log(error);
          } else {
            console.log("email: " + info.response);
          }
        });
        return res
          .status(200)
          .json({ message: "Password enviado para seu e-mail" });
      }
    } else {
      return res.status(500).json(err);
    }
  });
});

router.get("/get", auth.authenticateToken, (req, res) => {
  var query =
    "select id,name,email,contactNumber,status from user where role='user'";
  connection.query(query, (err, results) => {
    if (!err) {
      return res.status(200).json(results);
    } else {
      return res.status(500).json(err);
    }
  });
});

router.patch("/update", auth.authenticateToken, (req, res) => {
  let user = req.body;
  var query = "update user set status=? where id=?";
  connection.query(query, [user.status, user.id], (err, results) => {
    if (!err) {
      if (results.affectedRows == 0) {
        return res
          .status(404)
          .json({ message: "Usuario id informado não existe" });
      }
      return res
        .status(200)
        .json({ message: "Usuario atualizado com sucesso" });
    } else {
      return res.status(500).json(err);
    }
  });
});

router.get("./checkToken", auth.authenticateToken, (req, res) => {
  return res.status(200).json({ message: "true" });
});

//router.post("/changePassword", (req, res) => {});

module.exports = router;
