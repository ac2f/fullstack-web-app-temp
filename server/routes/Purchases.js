const express = require("express");
const router = express.Router();
const { Purchases, APIVerificationKeys } = require("../models");
const config = require("../../client/src/config");
const chalk = require("chalk");

router.post("/", async (req, res) => {
    console.log(chalk.magentaBright("> REQUEST    /purchases"));
    var remoteAddress = req.socket.remoteAddress.substr(7)
    var reqv = config.parseHeader(req.body);
    if ((!config.config.validateSecret || (reqv.secretKey==secret && remoteAddress==req.hostname))) {
        if (reqv[0] == "getPurchases") {
            if ((await APIVerificationKeys.findAll({where: {username: reqv[1], index: reqv[19]}})).length>0) {
                
                res.send(await Purchases.findAll());
                return;
            };
        } else if (reqv[0] == "rrrr"){
           res.send("OK");
        };
    };
    res.send([]);
});
module.exports = router;