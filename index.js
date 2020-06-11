const express = require('express');
const log = require('./util/logger');
const { port } = require('./config');
var ping = require('ping');
const isReachable = require('is-reachable');
var request = require('request');

const app = express();

const API_VERSION = '/v1'

app.use(express.json());

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", '*');
  res.header("Access-Control-Allow-Credentials", true);
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header("Access-Control-Allow-Headers", 'Origin,X-Requested-With,Content-Type,Accept,content-type,application/json');
  next();
});

app.post(`${API_VERSION}/ping`, (req, res) => {  

  (async () => {
    
    await isReachable(req.body.url).then(result => {
      if (result) {
        log.info('host ' + req.body.url + ' is alive');
        return res.status(200).send(true);
        
      }

      ping.sys.probe(req.body.url, (isAlive) => {
        if (isAlive) {
          log.info('host ' + req.body.url + ' is alive');
          return res.status(200).send(true);
        }
        log.error('host ' + req.body.url + ' is dead');
        return res.status(200).send(false);
  
      });

    });
  })();

});

app.post(`${API_VERSION}/api`, (req, res) => {  

  request({
    url: req.body.url,
    method: "POST",
    json: true,
    body: req.body.body
  }, function (error, response, body){
    if (!error && response.statusCode == 200) {
      log.info('api ' + req.body.url + ' is up');
      return res.status(200).send(true);
    }
    log.error('api ' + req.body.url + ' is not responding properly');
    return res.status(200).send(false);
});

});

app.listen(port, () => log.info(`Listening on ${port}...`));