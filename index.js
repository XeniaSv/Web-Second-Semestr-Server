const express = require("express");
const cors = require("cors");
const config = require("./config");
const mongoose = require("mongoose");

const app = express();
const PORT = config.PORT;
const urlDB = config.urlDB;

app.use(cors());

mongoose.set("useCreateIndex", true);

mongoose.connect(urlDB, {useUnifiedTopology: true, useNewUrlParser: true, useFindAndModify: false})
        .then((mongoose) => {
            console.log("Connect to DB success");

            app.listen(PORT, () => {
                console.log("Server is working");
            })
        })
