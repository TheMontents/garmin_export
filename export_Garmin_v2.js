const fs = require('fs');
const axios = require('axios');
const readline = require('readline');
const { differenceInDays, parse, format, addDays } = require('date-fns');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
const garmin_url_base = 'https://connect.garmin.com/usersummary-service/stats/steps/daily/';
const datesArray = new Array();
const headers = {
    'authority': 'connect.garmin.com',
    'accept': 'application/json, text/plain, */*',
    'accept-language': 'de-DE,de;q=0.9,en-US;q=0.8,en;q=0.7',
    'authorization': '***',
    'baggage': 'sentry-environment=prod,sentry-release=connect%404.67.218,sentry-transaction=%2Fmodern%2Freport%2F%3Cdigits%3E%2Fwellness,sentry-public_key=f0377f25d5534ad589ab3a9634f25e71,sentry-trace_id=9db37bd51dad4eb3b9b223e799286299,sentry-sample_rate=1',
    'di-backend': 'connectapi.garmin.com',
    'cookie': '***',
    'nk': 'NT',
    'referer': 'https://connect.garmin.com/modern/report/29/wellness/last_four_weeks',
    'sec-ch-ua': '"Google Chrome";v="111", "Not(A:Brand";v="8", "Chromium";v="111"',
    'sec-ch-ua-mobile': '?0',
    'sec-ch-ua-platform': '"Windows"',
    'sec-fetch-dest': 'empty',
    'sec-fetch-mode': 'cors',
    'sec-fetch-site': 'same-origin',
    'sentry-trace': '9db37bd51dad4eb3b9b223e799286299-a436b134a1588384-1',
    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36',
    'x-app-ver': '4.67.1.1'
};

var startDate = new Date();
var endDate = new Date();
var daysDifference = 0;
var walkingData = new Array();
var totalDistance = 0;
var numberOfRequests = 0;

var calculateDaysDiff = () => {
    daysDifference = differenceInDays(endDate, startDate);
    console.log('Days Difference:', daysDifference);
}

const fillDatesArray = () => {
    let tempDate = startDate;
    numberOfRequests = Math.ceil(daysDifference / 28);
    console.log(`'${numberOfRequests}' requests to be made`);

    for (let i = 0; i < numberOfRequests; i++) {
        const tempArray = [tempDate];
        tempDate = addDays(tempDate, i < numberOfRequests - 1 ? 27 : daysDifference % 28);
        tempArray.push(tempDate);
        datesArray.push(tempArray);
        console.log(`Request no. '${i + 1}' start date: '${format(tempArray[0], 'yyyy-MM-dd')}' end date: '${format(tempArray[1], 'yyyy-MM-dd')}'`);
        tempDate = addDays(tempDate, 1);
    }
};

async function sendRequests() {
    // Use map to create an array of promises
    const requestPromises = datesArray.map(async function (date) {
      const url = garmin_url_base + format(date[0], 'yyyy-MM-dd') + '/' + format(date[1], 'yyyy-MM-dd');
      console.log(`URL: '${url}'`);
  
      try {
        const response = await axios.get(url, { headers });
        walkingData.push(response.data);
      } catch (error) {
        console.error(error);
      }
    });
  
    // Use Promise.all to wait for all promises to resolve
    await Promise.all(requestPromises);
  
    // Continue with the program after all requests are complete
    console.log('All requests completed');
    calculateTotalDistance();
  }

var calculateTotalDistance = () => {
    const flattenedArray = [].concat(...walkingData);
    console.log(flattenedArray);
    console.log('================= Result =================')
    flattenedArray.forEach(data => {
        totalDistance += data.totalDistance;
    });
    console.log(`Congrats you reached a total distance of ${totalDistance/1000} kilometers!!!`)
    console.log('Keep on going champ!!!');
}

rl.question('Enter the start date (YYYY-MM-DD): ', (inputStartDate) => {
    startDate = parse(inputStartDate, 'yyyy-MM-dd', new Date());
    console.log(`Start date is: '${format(startDate, 'yyyy-MM-dd')}'`);
    rl.question('Enter the end date (YYYY-MM-DD): ', (inputStartDate) => {
        endDate = parse(inputStartDate, 'yyyy-MM-dd', new Date());
        console.log(`End date is: '${format(endDate, 'yyyy-MM-dd')}'`);
        calculateDaysDiff();
        fillDatesArray();
        sendRequests();
        rl.close();
    })
});