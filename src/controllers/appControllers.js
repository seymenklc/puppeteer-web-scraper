const { stopsScraper, tableScraper } = require("../utils/scraper");

const getStops = async (req, res) => {
    try {
        const stops = await stopsScraper();
        res.status(200).json(stops);
    } catch (error) {
        console.log(error);
    }
};

const getTableData = async (req, res) => {
    const { departureStop, arrivalStop } = req.body;
    try {
        const data = await tableScraper(departureStop, arrivalStop);
        res.status(200).json({
            departureTimes: data.departureTimes,
            arrivalTimes: data.arrivalTimes,
        });
    } catch (error) {
        console.log(error);
    }
};

module.exports = { getStops, getTableData };