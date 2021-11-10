const express = require("express");
const router = express.Router();
const { Users, Tokens, SupportTickets, SupportTicketIDs, APIVerificationKeys } = require("../models");
const axios = require("axios");
const crypto = require("crypto");
const config = require("../../client/src/config");
const chalk = require("chalk");
const uuid = require("uuid");
const { Op } = require('sequelize');

function crypt(text, repeatXtimes = 1) {
  try {
    var repeatXtimes =
      typeof repeatXtimes != typeof 1 || repeatXtimes < 1 ? 1 : repeatXtimes;
    var last = "";
    for (var i = 0; i < repeatXtimes; i++) {
      last = crypto
        .createHash("sha256")
        .update(
          Array.from(i < 1 ? text : last)
            .map((each) => each.charCodeAt(0).toString(2))
            .join(" ")
        )
        .digest("base64");
    }
    return last;
  } catch (e) {
    return e;
  }
}
function editDistance(s1, s2) {
  s1 = s1.toLowerCase();
  s2 = s2.toLowerCase();

  var costs = new Array();
  for (var i = 0; i <= s1.length; i++) {
    var lastValue = i;
    for (var j = 0; j <= s2.length; j++) {
      if (i == 0) costs[j] = j;
      else {
        if (j > 0) {
          var newValue = costs[j - 1];
          if (s1.charAt(i - 1) != s2.charAt(j - 1))
            newValue = Math.min(Math.min(newValue, lastValue), costs[j]) + 1;
          costs[j - 1] = lastValue;
          lastValue = newValue;
        }
      }
    }
    if (i > 0) costs[s2.length] = lastValue;
  }
  return costs[s2.length];
}
function similarity(s1, s2) {
  var longer = s1;
  var shorter = s2;
  if (s1.length < s2.length) {
    longer = s2;
    shorter = s1;
  }
  var longerLength = longer.length;
  if (longerLength == 0) {
    return 1.0;
  }
  return (
    (longerLength - editDistance(longer, shorter)) / parseFloat(longerLength)
  );
}
const token = (value) => {
  var value = value.length > 0 ? value[0] : value;
  console.log(value, 2222222222119902)
  return config.aes.encrypt(
    crypt(
      config.randomBytes(17),
      11
    ) + `::${value.username}::${value.email}::${value.isEmailVerified}::${(Date.now()/604800000).toString().split(".")[0]}`,
    "token"
  );
};
const elapsedTime = (value, format = "m") => {
  return (
    (Date.now() - Date.parse(value.createdAt)) /
    (format == "m" ? 600000 : format == "hr" ? 3600000 : 1)
  );
};
/*router.post("/", async (req, res) => {
  console.log(chalk.magentaBright("> REQUEST    /users"));
  console.log(req.body);
  var valuePick = false;
  var secret = require("../index");
  var remoteAddress = req.body.test;
  var reqv = req.body;
  reqv.secretKey && (reqv.secretKey = null);
  reqv.password && (reqv.password = crypt(reqv.password, 7));
  reqv.passwordNew && (reqv.passwordNew = crypt(reqv.passwordNew, 7));
  if (!config.config.validateSecret || reqv.secretKey == secret) {
    if (reqv.rtype == "rrrr") {
      reqv.isEmailVerified = "false";
      reqv.verificationCode = (Math.random() + 1).toString(36).substring(6);
      var users = await Users.findAll();
      for (var c = 0; c < users.length; c++) {
        if (
          users[c].email == reqv.email ||
          users[c].username == reqv.username
        ) {
          res.send("exist");
          return;
        } else if (
          users[c].ownerIP == reqv.test &&
          elapsedTime(users[c], "hr") <= 30
        ) {
          res.send("cooldown_30_d");
          return;
        }
      }
      await Users.create(
        Object.assign({}, reqv, { ownerIP: reqv.test, test: null })
      );
      res.send("true");
      return;
    } else if (reqv.rtype == "hhh") {
      var users = await Users.findAll();
      var tokens = await Tokens.findAll();
      for (var c = 0; c < users.length; c++) {
        if (
          (reqv.username == users[c].username ||
            reqv.username == users[c].username) &&
          reqv.password == users[c].password
        ) {
          var userToken = token(users[c]);
          var tokenIP = crypt(users[c].ownerIP, 11);
          for (var c2 = 0; c2 < tokens.length; c2++) {
            if (tokens[c2].token == userToken) {
              if (reqv.tokentest != tokenIP) {
                await Tokens.update(
                  { tokenIP: tokenIP },
                  { where: { id: tokens[c2].id } }
                );
              }
              res.send(tokens[c2].token);
              return;
            }
          }
          await Tokens.create({ token: userToken, tokenIP: tokenIP });
          res.send(userToken);
          return;
        }
      } 
      res.send("bad_credentials");
    } else if (reqv.rtype == "hhht") {
      var temp = await Tokens.findAll({ where: { token: reqv.token } });
      temp = temp.length ? temp[0].dataValues : false;
      if (temp) {
        if (
          !config.config.validatePublicIP ||
          temp.tokenIP == crypt(reqv.tokentest, 4)
        ) {
          res.send("true");
          return;
        }
        res.send("ipNotMatch");
        return;
      }
      res.send("false");
    } else if (reqv.rtype == "hhhv") {
        var temp = await Users.findAll({where: {username: reqv.username, verificationCode: reqv.verificationCode}});temp = temp.length ? temp[0] : false;
        if (temp) {
            await Users.update(
            { isEmailVerified: "true" },
            { where: { id: temp.id } }
            );
            await Tokens.destroy(
                { where: { token: reqv.oldToken } }
            );
            res.send("true");
            return;
        };
        res.send("false");
    } else if (reqv.rtype == "hhhcp") {
      const temp = await Users.findAll();
      for (var c = 0; c < temp.length; c++) {
        if (
          (temp[c].username == reqv.username || temp[c].email == reqv.email) &&
          temp[c].password == reqv.password
        ) {
          if (
            temp[c].createdAt != temp[c].updatedAt &&
            Date.now() / 1000 - Date.parse(temp[c].updatedAt) / 1000 >=
              config.config.timeouts.changePassword
          ) {
            await Users.update(
              { password: reqv.passwordNew },
              { where: { id: temp[c].id } }
            );
            await Tokens.update({
              token: config.aes.encrypt(
                token(Object.assign({}, temp[c], { password: passwordNew })),
                "token"
              ),
            });
            res.send("true");
            return;
          }
          res.send(`timeout::${config.config.timeouts.changePassword}`);
          return;
        }
      }
      res.send("bad_credentials");
    } else if (reqv.rtype == "hhhcc") {
      if (reqv.x in [Array(Date.now() + 20000).keys()]) {
        res.send(true);
      }
      res.send(false);
    } else if (reqv.rtype == "hhhp") {
      res.send(remoteAddress);
    };
  };
  res.send("false");
});*/
router.post("/", async (req, res) => {
  console.log(chalk.magentaBright("> REQUEST    /users"));
  console.log(req.body);
  var valuePick = false;
  var secret = require("../index");
  var remoteAddress = req.body.test;
  var reqv = config.parseHeader(req.body);
  reqv.secretKey && (reqv[19] = null);
  reqv.password && (reqv[3] = crypt(reqv[3], 7));
  reqv.passwordNew && (reqv[4] = crypt(reqv[4], 7));
  console.log(chalk.redBright(`> REQUESTTYPE    ${reqv[0]}`));
  if (!config.config.validateSecret || reqv[19] == secret) {
    if (reqv[0] == "rrrr") {
      //reqv.isEmailVerified = "false";
      //reqv.verificationCode = (Math.random() + 1).toString(36).substring(6);
      var user = await Users.findAll();
      for (var c = 0; c < user.length; c++) {
        if (
          user[c].email == reqv[2] ||
          user[c].username == reqv[1]
        ) {
          res.send("exist");
          return;
        };
      };
      await Users.create(
        {username: reqv[1], email: reqv[2], password: config.crypt(reqv[3], 7), isEmailVerified: "false", ownerIP: config.crypt(reqv[17], 3), verificationCode: (Math.random() + 1).toString(36).substring(6)},
      );
      res.send("true");
      return;
    } else if (reqv[0] == "hhh") {
      var user = (await Users.findAll({where: {
        [Op.or]: [{username: reqv[1]}, {email: reqv[1]}],
        password: config.crypt(reqv[3], 7)
      }})); user = user.length>0 ? user[user.length-1].dataValues : false;
      if (user) {
        console.log(chalk.red("\n\n---\n"))
        console.log(reqv);
        console.log(chalk.red("\n\n---\n"))
        console.log(chalk.red("\n\n---\n"))
        for (var val in user) {
          console.log(chalk.red(val))
        }
        var cachedToken = token(user);
        console.log(chalk.magentaBright(cachedToken))
        var wherePrefix = {where: {username: "test", isDesktopDevice: config.crypt(reqv[8], 3)}};
        var inputDataPrefix = {token: cachedToken, username: reqv[2], tokenIP: config.crypt(reqv[17], 3), isDesktopDevice: config.crypt(reqv[8], 3)};
        console.log(wherePrefix);
        if ((await Tokens.findAll(wherePrefix)).length > 0) {
          await Tokens.update(inputDataPrefix, wherePrefix);
        } else {
          await Tokens.create(inputDataPrefix);
        };
        res.send("true");
        return;
      };
      res.send("bad_credentials");
      /*var users = await Users.findAll();
      var tokens = await Tokens.findAll();
      for (var c = 0; c < users.length; c++) {
        console.log(chalk.green("for loop " + c.toString()))
        if (
          (reqv[1] == users[c].username ||
            reqv[1] == users[c].email) &&
            config.crypt(reqv[3], 7) == users[c].password
        ) {
          console.log(chalk.green(`reqv[1] == username or email. reqv[1] = ${reqv[1]}`))
          var userToken = token(users[c]);
          var tokenIP = crypt(users[c].ownerIP, 11);
          for (var c2 = 0; c2 < tokens.length; c2++) {
            console.log(chalk.green("2nd for loop "+c2.toString()))
            if (tokens[c2].token == userToken) {
              console.log(chalk.green("tokens[c2].token == userToken"))
              if (reqv[17] != tokenIP) {
                console.log(chalk.green("ip not match"))
                await Tokens.update(
                  { tokenIP: tokenIP },
                  { where: { id: tokens[c2].id } }
                );
              };
              res.send(tokens[c2].token);
              return;
            }
          }
          await Tokens.create({ token: userToken, tokenIP: tokenIP });
          res.send(userToken);
          return;
        };
      };*/
      res.send("bad_credentials");
    } else if (reqv[0] == "hhht") {
      var temp = await Tokens.findAll({ where: { token: reqv[16] } });
      temp = temp.length ? temp[0].dataValues : false;
      if (temp) {
        if (
          !config.config.validatePublicIP ||
          temp.tokenIP == crypt(reqv[17], 4)
        ) {
          res.send("true");
          return;
        }
        res.send("ipNotMatch");
        return;
      }
      res.send("false");
    } else if (reqv[0] == "hhhv") {
      console.log("hhhv")
        var temp = await Users.findAll({where: {username: reqv[1], verificationCode: reqv[5]}});temp = temp.length ? temp[0] : false;
        console.log(temp);
        if (temp) {
            console.log(chalk.greenBright("temp!=false"))
            await Users.update(
            { isEmailVerified: "true" },
            { where: { id: temp.id } }
            );
            await Tokens.destroy(
                { where: { token: reqv[15] } }
            );
            res.send("true");
            return;
        };
        res.send("false");
    } else if (reqv[0] == "hhhcp") {
      const temp = await Users.findAll();
      for (var c = 0; c < temp.length; c++) {
        if (
          (temp[c].username == reqv[1] || temp[c].email == reqv[2]) &&
          temp[c].password == config.crypt(reqv[3], 7)
        ) {
          if (
            temp[c].createdAt != temp[c].updatedAt &&
            Date.now() / 1000 - Date.parse(temp[c].updatedAt) / 1000 >=
              config.config.timeouts.changePassword
          ) {
            await Users.update(
              { password: config.crypt(reqv[4], 7) },
              { where: { id: temp[c].id } }
            );
            await Tokens.update({
              token: config.aes.encrypt(
                token(Object.assign({}, temp[c], { password: config.crypt(reqv[4], 7) })),
                "token"
              ),
            });
            res.send("true");
            return;
          }
          res.send(`timeout::${config.config.timeouts.changePassword}`);
          return;
        }
      }
      res.send("bad_credentials");
    }else if (reqv[0] == "hhhp") {
      res.send(remoteAddress);
    } else if (reqv[0] == "getSupportTickets") {
      var dataToSend = await SupportTicketIDs.findAll({where: Object.assign({}, {username: config.crypt(reqv[2], 2)}, reqv[10]?{ticketID: reqv[10]}:{})});
      console.log(dataToSend);
      res.send(dataToSend);
    } else if (reqv[0] == "postSupportTicket") {
      try {
        var tickets = await SupportTicketIDs.findAll();
        var data = {
          ticketID: (tickets.length>0?parseInt(tickets[tickets.length - 1].ticketID)+config.randomInteger(1, 6):100000+config.randomInteger(1, 12)).toString(),
          title: config.aes.encrypt(reqv[13], "supportTicketTitle"),
          accessCode: config.crypt(uuid.v4()+Date.now().toString(), 2).toString().replace("/", "").replace("=", "").replace("+", "").replace("/", ""),
          username: config.crypt(reqv[12], 2),
          status: config.aes.encrypt("open", "supportTicketStatus")
        };
        var data2 = {
          ticketID: data.ticketID,
          sentMessage: config.aes.encrypt(reqv[14], "supportTicketMessage"),
          messageSender: config.aes.encrypt(reqv[12], "supportTicketMessageSender")
        };
        await SupportTicketIDs.create(data);
        await SupportTickets.create(data2);
        res.send(config.aes.encrypt(`${data.ticketID}::${data.accessCode}`, "vars"));
      } catch (error) {
        res.send("false");
      };
  } else if (reqv[0] == "getSupportMessages") {
    console.log(chalk.redBright(">>>>>>>>>>>>>>>>>>>>>>>"));
    var temp = await SupportTicketIDs.findAll({where: {ticketID: reqv[10]}});
    // (await APIVerificationKeys.findAll({where: {username: reqv[1], index: reqv[5]}})).length>0
    if (temp.length>0 ? (temp[0].accessCode == reqv[9]) : false) {
      console.log(chalk.redBright("<<< verificationCode passed >>>"));
      console.log(await SupportTickets.findAll({where: {ticketID: reqv[10]}}));
      res.send(await SupportTickets.findAll({where: {ticketID: reqv[10]}}));
      return;
    } else {
      res.send(config.aes.encrypt("auth_failed", "vars"));
    };
    res.send([]);
  } else if (reqv[0] == "postSupportMessage") {
    try {
      var data = {
        ticketID: reqv[10],
        sentMessage: config.aes.encrypt(reqv[11], "supportTicketMessage"),
        messageSender: config.aes.encrypt(reqv[2], "supportTicketMessageSender")
      };
      await SupportTickets.create(data);
      res.send("true");
    } catch (error) {
      console.log(chalk.redBright("error handled > reqv[0]=postSupportMessage > "+error.toString()));
      res.send("false");
    };
  };
  res.send("false");
}});

module.exports = router;
