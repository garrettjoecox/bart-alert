
// Example Cronjob runs every weekday 7am - 9am every 15 minutes
// */15 7,8,9 * * 1-5 /usr/local/bin/node {PWD}/index.js

//// Dynamic Variables

// http://api.bart.gov/docs/overview/abbrev.aspx
var stationAbbreviation = 'HAYW';

// http://api.bart.gov/docs/etd/etd.aspx [n/s]
var routeDirection = 'n';

// http://api.bart.gov/api/register.aspx
var apiKey = 'MW9S-E7SL-26DU-VV8V';

//// End of Dynamic Variables

var cp = require('child_process');
var xml2js = require('xml2js');
var request = require('request');
var url = 'http://api.bart.gov/api/etd.aspx?cmd=etd&orig=HAYW&key=MW9S-E7SL-26DU-VV8V&dir=n';

get(url)
  .then(xml)
  .then(function(data) {
    var train = data.root.station[0].etd[0].estimate[0].length[0] + ' car ' + data.root.station[0].etd[0].destination[0] + ' train ';
    var minutes = data.root.station[0].etd[0].estimate[0].minutes[0];

    if (minutes === '1') {
      minutes = 'in ' + minutes + ' minute.';
    } else if (minutes === 'Leaving') {
      minutes = 'now leaving.';
    } else {
      minutes = 'in ' + minutes + ' minutes.';
    }

    exec('say ' + train + minutes);
  });

function exec(command) {
  return new Promise(function(resolve, reject) {
    var child = cp.exec(command, function(err, stdout, stderr) {
      if (err) reject(err);
      else resolve(stdout);
    });
  });
}
function get(options) {
  return new Promise(function(resolve, reject) {
    request(options, function(err, res, body) {
      if (err) reject(err);
      else resolve(body);
    });
  });
}
function xml(string) {
  return new Promise(function(resolve, reject) {
    xml2js.parseString(string, function(err, result) {
      if (err) reject(err);
      else resolve(result);
    });
  });
}
