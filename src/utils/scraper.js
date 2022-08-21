const puppeteer = require("puppeteer");
const { URL } = require('../config/config');

const stopsScraper = async () => {
    try {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();

        await page.goto(URL, { waitUntil: 'load' });

        const data = await page.evaluate(() => {
            const options = Array.from(document.querySelector('#ctl00_CPH_drpHareketDur'));
            const values = options.map(el => Number(el.value));
            const names = options.map(option => option.innerText)
                .map(text => text.replace(/[\r\n]/gm, '.'))
                .map(word => word.split('.')[0]);

            return { names, values };
        });

        if (data) {
            const stopsData = data.names.map((stopName, idx) => {
                const keyValues = data.values.map(val => val)[idx];
                return {
                    stopName: stopName,
                    keyValue: keyValues
                };
            });

            await page.close();
            await browser.close();

            return stopsData;
        }
    } catch (error) {
        console.log(error);
    }
};

const tableScraper = async (departureStop = '38', arrivalStop = '-2') => {
    try {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();

        await page.goto(URL, { waitUntil: 'load' });

        // dropdown selections
        await page.select('#ctl00_CPH_drpHareketDur', String(departureStop));
        await page.waitForTimeout(300);
        await page.select('#ctl00_CPH_drpVarisDur', String(arrivalStop));
        await page.waitForTimeout(300);
        await page.click('#ctl00_CPH_Goster', { clickCount: 1 });
        await page.waitForTimeout(1000);

        // query the table
        const data = await page.evaluate(() => {
            const rows = document.querySelectorAll('table');
            return Array.from(rows, row => {
                const columns = row.querySelectorAll('tr');
                return Array.from(columns, column => column.innerText);
            })[0];
        });
        console.log(data);
        if (data) {
            const times = data.map(str => {
                return str.replace(/[\r\n\t]/gm, ' ').split(' ');
            }).slice(4);

            const departureTimes = times.map(t => t[0]);
            const arrivalTimes = times.map(t => t[1]);

            await page.close();
            await browser.close();

            return { arrivalTimes, departureTimes };
        }
    } catch (error) {
        console.log(error);
    }
};

module.exports = { stopsScraper, tableScraper };