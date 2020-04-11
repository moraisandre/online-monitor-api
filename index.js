const Joi = require('@hapi/joi');
const express = require('express');
const http = require('http');
const isUp = require('is-up');
const log = require('./util/logger');
const { port } = require('./config');

const app = express();

const API_VERSION = '/v1'

app.use(express.json());

app.post(`${API_VERSION}/ping`, (req, res) => {  

  const schemaIP = Joi.object({
    url: Joi.string().ip().required()
  });

  const schemaURI = Joi.object({
    url: Joi.string().uri().required()
  });

  const IPIsValid = schemaIP.valid().validate(req.body).error;
  const urlIsValid = schemaURI.valid().validate(req.body).error;

  log.info(IPIsValid);
  log.info(urlIsValid);

  if(IPIsValid && urlIsValid) {
    if (IPIsValid) {
      return res.status(400).send(schemaIP.valid().validate(req.body).error.details[0].message);
    } else if(urlIsValid) {
      return res.status(400).send(schemaURI.valid().validate(req.body).error.details[0].message);
    }
  }

  (async () => {

    if (await isUp(req.body.url)) {
      const ret  = 'host ' + req.body.url + ' is alive';
      log.info(ret);
      return res.status(200).send(ret);
    } else {
      const ret  = 'host ' + req.body.url + ' is dead';
      log.error(ret);
      return res.status(404).send(ret);
    }
    
  })();

});

app.listen(port, () => log.info(`Listening on ${port}...`));