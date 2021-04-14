const requests = require("./Requests/requests");
const getSchema = require("./DB/getSchema");
let express = require("express");
const asyncHandler = require("express-async-handler");
let routerWeather = express.Router();
let routerFavourites = express.Router();

routerWeather.get("/city", asyncHandler(async (req, res) => {
    const {q} = req.query;

    const request = await requests.getInfoCityName(q);

    if (request === null) {
        res.status(404).send();
        return;
    }

    res.status(200).send(request);
}))

routerWeather.get("/coordinates", asyncHandler(async (req, res) => {
    const {lat, lon} = req.query;

    const request = await requests.getInfoCoordinats(lat, lon);

    if (request === null) {
        res.status(404).send();
        return;
    }

    res.status(200).send(request);
}))


routerFavourites.get("/", asyncHandler( async (req, res) => {
    let cities = await schemaCity.find().exec();

    let citiesList = [];
    cities.forEach(info => citiesList.push(info.cityName));

    res.status(200).send({favouriteCities: citiesList})
}));

routerFavourites.post("/", asyncHandler(async(req, res) => {
    const {q} = req.query;

    const request = await requests.getInfoCityName(q);

    if (request == null) {
        res.status(404).send();
        return;
    }

    const ifExists = await schemaCity.findOne({cityName: request.name}).exec() !== null;

    if (ifExists) {
        res.status(409).send();
        return;
    }

    new schemaCity({cityName: request.name}).save();
    res.status(201).send(request);
}));

routerFavourites.delete("/", asyncHandler (async(req, res) => {
    const {q} = req.query;

    const remove = await schemaCity.findOneAndRemove({cityName: q});

    if (remove === null) {
        res.status(404).send();
        return;
    }

    res.status(204).send();
}))


let schemaCity;

function initSchemaCity(mongoose) {
    schemaCity = getSchema(mongoose);
}

module.exports = {
    routerWeather, routerFavourites, initSchemaCity
}
