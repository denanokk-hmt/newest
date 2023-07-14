'use strict';

const conf = require(`../../../config/configure.js`);
const env = conf.env;

const NAMESPACE = `${env.kvs.service}-${env.client}-${env.environment}`
module.exports.NAMESPACE = NAMESPACE

const KIND = {
  RESPONSIES : `Responsies`,  //Response格納用
};
module.exports.KIND = KIND;

const responsies = require(`./queries.responsies`)
module.exports.responsies = responsies

const worthwords = require(`./queries.worthwords`)
module.exports.worthwords = worthwords

const store = require(`./store`)
module.exports.store = store
