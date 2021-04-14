const express = require("express");
const cors = require("cors");
const config = require("./config");
const mongoose = require("mongoose");
const { request } = require("express");

const routes = require("./routes")

const app = express();
const PORT = config.PORT;
const urlDB = config.urlDB;

const routerWeather = routes.routerWeather;
const routerFavourites = routes.routerFavourites;
const initSchemaCity = routes.initSchemaCity;

app.use(cors());

mongoose.set("useCreateIndex", true);

async function startApplication() {
    try {
        let dataBase = await mongoose.connect(urlDB, {useUnifiedTopology: true, useNewUrlParser: true, useFindAndModify: false});

        initSchemaCity(dataBase);

        app.use("/weather", routerWeather);
        app.use("/favourites", routerFavourites);

        app.listen(PORT, () => {
            console.log("Сервер работает");
        })
    } catch (error) {
        console.log(error);
    }
}

startApplication();
