const fs = require('fs')

const files = ['./fetch_period_1.json', './fetch_period_2.json'];


var totalDistance = 0;
const days = [];
var finishedFiles = 0;


const result = () => {
    finishedFiles++;
    if(finishedFiles === files.length) {
        console.log(totalDistance, 'in meters');
        console.log(totalDistance/1000, 'in kilometers');
    }
}

files.forEach(file => {
    fs.readFile(file, 'utf8', (err, data) => {
        if (err) throw err;
        const values = JSON.parse(data);
    
        values.forEach(value => {
            const calendarDate = value.calendarDate;
            if(days.indexOf(calendarDate) === -1) {
                days.push(calendarDate);
                totalDistance += value.totalDistance;
                console.log(value.calendarDate, value.totalDistance, totalDistance);
            } else {
                console.log(calendarDate, 'already considered');
            }
        });

        result();
    });
});