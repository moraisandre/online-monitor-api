const express = require('express');
const log = require('./util/logger');
const { port } = require('./config');
var ping = require('ping');
const isReachable = require('is-reachable');

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

app.listen(port, () => log.info(`Listening on ${port}...`));