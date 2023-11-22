const fs = require('fs');
const axios = require('axios');
const { differenceInDays, parse, format } = require('date-fns');
const garmin_url_base = 'https://connect.garmin.com/usersummary-service/stats/steps/daily/'; //2023-10-02/2023-10-12

var startDate = new Date();
var endDate = new Date();

var totalDistance = 0;
const days = [];
var finishedFiles = 0;