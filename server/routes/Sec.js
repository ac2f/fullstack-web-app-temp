const express = require("express");
const router = express.Router();
const { APIVerificationKeys } = require("../models");
const config = require("../../client/src/config");
const chalk = require("chalk");

router.post("/", async (req, res) => {
    console.log(chalk.magentaBright("> REQUEST    /s"));
    var remoteAddress = req.socket.remoteAddress.substr(7)
    /*var reqv = config.parseHeader(req.body);
    console.log(config.aes.decrypt(req.body["user;;|$|;.;"+parseInt(Date.now()/15000).toString()], "headersUserKey"));
    return;*/
    let reqv = config.parseHeader(req.body);
    console.log(reqv)   
    if ((!config.config.validateSecret || (reqv.secretKey==secret && remoteAddress==req.hostname))) {
        if (reqv[0] == "getSecureCode") {
            if ((await APIVerificationKeys.findAll({where: {username: reqv[1]}})).length < 1) {
                await APIVerificationKeys.create({username: reqv[1], index: Math.floor(Math.random() * (Math.floor(1999999) - Math.ceil(1000000)) + Math.ceil(1000000))});
            };
            await APIVerificationKeys.update({index: Math.floor(Math.random() * (Math.floor(1999999) - Math.ceil(1000000)) + Math.ceil(1000000))}, {where: {username: reqv[1]}});
            res.send((await APIVerificationKeys.findAll({where: {username: reqv[1]}}))[0].index);
            return;
        } else if (reqv.rtype=="rrrr"){
           res.send("OK");
           return;
        };
    };
    res.send("false");
});
module.exports = router;