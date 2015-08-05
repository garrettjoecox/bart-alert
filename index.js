
var cp = require('child_process');
var xml2js = require('xml2js');
var request = require('request');
var url = 'http://api.bart.gov/api/etd.aspx?cmd=etd&orig=HAYW&key=MW9S-E7SL-26DU-VV8V&dir=n';

get(url)
  .then(xml)
  .then(function(data) {
    var train = data.root.station[0].etd[0].estimate[0];
    var dest = data.root.station[0].etd[0].destination[0];
    var command = 'say ' + train.length[0] + ' car ' + dest + ' train in ' + train.minutes[0] + ' minutes';
    exec(command);
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
