module.exports = function (mongoose) {
    const Schema = mongoose.Schema;

    const favouriteCity = new Schema({cityName: {type: "string", unique: true}}, {versionKey: false});

    return mongoose.model("Cities", favouriteCity);
}