const express = require("express");
const app = express();
const db = require("./models");
const cors = require("cors");
const chalk = require("chalk");

app.use(express.json());
app.use(cors());

app.use("/stocks", require("./routes/Stocks"));
app.use("/users", require("./routes/Users"));
app.use("/offers", require("./routes/Offers"));
app.use("/purchases", require("./routes/Purchases"));
app.use("/s", require("./routes/Sec"));

db.sequelize.sync().then(() => {
    app.listen(3001, () => {
        console.log(chalk.blueBright("> REST API server listening at http://localhost:3001/"));
    });
});