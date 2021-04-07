const express = require("express");
const cors = require("cors");
const config = require("./config");
const mongoose = require("mongoose");

const Requests = require("./Requests/requests");
const getSchema = require("./DB/getSchema");

const app = express();
const PORT = config.PORT;
const urlDB = config.urlDB;

app.use(cors());

mongoose.set("useCreateIndex", true);

mongoose.connect(urlDB, {useUnifiedTopology: true, useNewUrlParser: true, useFindAndModify: false})
        .then((mongoose) => {
            console.log("Подключение к БД");

            app.listen(PORT, () => {
                console.log("Сервер работает");
            })


            const schemaCity = getSchema(mongoose);

            app.get("/favourites", async (req, res) => {
                let cities = undefined;
                let error = undefined;

                await schemaCity.find().then(value => cities = value).catch(e => error = e);

                if (error) {
                    console.log(error);
                    res.send(500);
                    return;
                }

                let citiesList = [];
                cities.forEach(info => citiesList.push(info.cityName));

                res.send({favouriteCities: citiesList})
            })

            app.post("/favourites", async(req, res) => {
                Requests.getInfoCityName(req.query.q)
                .then(async data => {
                    let city = undefined;
                    let error = undefined;

                    await schemaCity.find({cityName: data.name})
                                   .then(value => city = value[0])
                                   .catch(e => error = e);
                    
                    if (error) {
                        console.log(error);
                        res.send(500);
                        return;
                    }

                    if (city !== undefined) {
                        res.status(409).send("Город уже существует");
                        return;
                    }

                    new schemaCity({cityName: data.name}).save();
                    res.send(data);
                })
                .catch(() => res.status(404).send("Город не найден"));
            });

            app.delete("/favourites", async(req, res) => {
                let error = undefined;

                await schemaCity.findOneAndRemove({cityName: req.query.q})
                                .catch(e => error = e);
                
                if (error) {
                    console.log(error);
                    res.send(500);
                    return;
                }

                res.send();
            })
        })
        .catch(console.log("Ошибка"))
