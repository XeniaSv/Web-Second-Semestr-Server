const fetch = require("node-fetch");
const query = "https://api.openweathermap.org/data/2.5/weather";
const key = process.env.APPID_KEY;

async function getInformation(suffixs) {
    const url = new URL(query);

    url.searchParams.append("appid", key);
    url.searchParams.append("units", "metric");
    url.searchParams.append("lang", "ru");

    for (const suffix in suffixs) {
        url.searchParams.append(suffix, suffixs[suffix]);
    }

    let data = await fetch(url);

    if (data.status === 200) {
        return await data.json();
    }
}

async function getInfoCityName(cityName) {
    return await getInformation({q: cityName});
}

async function getInfoCoordinats(lat, lon) {
    return await getInformation({lat: lat, lon: lon});
}

module.exports = {
    getInfoCityName, getInfoCoordinats
}