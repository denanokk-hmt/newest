'use strict';

//if you want to get new google spreadsheet token
//Access below document page, And get credential.json
//Node.js Quickstart (https://developers.google.com/sheets/api/quickstart/nodejs?hl=ja)
//release comment below line. And node start by terminal.
//const google_spread = require(`../modules/linkage/newest/google/initial`)

//config
const conf = require(REQUIRE_PATH.configure);
const code = conf.status_code
const status = conf.status

//express
var express = require('express')
var router = express.Router()
const express_res = conf.express_res

//moduler
const moduler = require(REQUIRE_PATH.moduler)

//System module
const adf = require(`${REQUIRE_PATH.modules}/api_default_func`).apiDefaultFunc
const valid = moduler.validation
const crypto = moduler.crypto

//[routes modules]
const getNewestUpdate = require(`./newest/get_update`)
const getNewestResponse = require(`./newest/get_response`)
const getWorthWordsUpdate = require(`./worthwords/get_update`)
const getWorthWordsResponse = require(`./worthwords/get_response`)


/**
 * ///////////////////////////////////////////////////
 * Error Response
 * @param {*} err 
 * @param {*} next 
 */
function errHandle2Top(err, next) {
  const result = {
    type: "API",
    status_code: code.ERR_S_API_REQ_902,
    status_msg : status.ERR_S_API_REQ_902,
    approval: false,
    status: err.status,
    message: err.message,
    stack: err.stack,
  }
  next(result)
}

/**
 * ///////////////////////////////////////////////////
 * Basic validation (Is value & Version)
 * @param {*} res
 * @param {*} params
 */
function basicValidation(res, params) {

  //Validation IsValue
  let valid_result
  valid_result = valid.isParamValue(params)
  if (!valid_result.approval) {
    express_res.funcErr(res, valid_result.status_msg, valid_result.status_code);
    return 'IsValue valid error.'
  }

  //Validation Version auth
  valid_result = valid.versionAuth(params.version)
  if (!valid_result.approval) {
    express_res.funcErr(res, valid_result.status_msg, valid_result.status_code);
    return 'Version valid error.'
  }

}

/**
 * ///////////////////////////////////////////////////
 * [[[For Developement]]]
 * Get Node process env
 */
router.get('/get/env', adf.firstSet, adf.loggingParams, async (req, res, next) => {
  let result = process.env
  result.node_version = process.version
  res.end(JSON.stringify(result));
})

/**
 * ///////////////////////////////////////////////////
 * Get config
 */
router.get('/get/config', adf.firstSet, adf.loggingParams, async (req, res, next) => {

  //Parameter
  let params = {
    version: req.query.version,
    token: req.query.token,
  }

  //Basic validation
  const result = basicValidation(res, params);
  if (result) {
    return result
  }

  //Token validation
  const valid_result = valid.tokenAuthKeel(params.token)
  if (!valid_result.approval) {
    express_res.funcErr(res, valid_result.status_msg, valid_result.status_code);
    return 'Token valid error.'
  }

  //Response configures
  express_res.func(res, conf)

  return true
})

/**
 * ///////////////////////////////////////////////////
 * [[[For Developement]]]
 * Issue Token
 */
router.get('/get/token', adf.firstSet, adf.loggingParams, async (req, res, next) => {

  //parameter
  const params = {
    client : req.query.client,
    version : req.query.version,
  }

  //Basic validation
  const result = basicValidation(res, params);
  if (result) {
    return result
  }

  //Validation IsValue
  let valid_result
  valid_result = valid.isParamValue(params)
  if (!valid_result.approval) {
    express_res.funcErr(res, valid_result.status_msg, valid_result.status_code);
    return 'IsValue valid error.'
  }

  //Hash token made from id & pw
  const hashIdPw = await crypto.hashMac(params.id, params.pw)
  if (!hashIdPw.issue) {
    express_res.func(res, hashIdPw);
    return 'Token issue Error.';
  }

  //Create random seed 8
  const seed = (req.query.seed)? req.query.seed : crypto.seedRandom8()

  //Encrypt from seed & hashIdPw.token 
  console.log(`${seed}${hashIdPw.token}`)
  const encrypt = crypto.encrypt(`${seed}${hashIdPw.token}`)
  if (!encrypt.issue) {
    express_res.func(res, encrypt);
    return 'Encrypt error'  
  }

  res.end(JSON.stringify(encrypt));
})

/**
 * ///////////////////////////////////////////////////
 * Update Newest response
 */
router.get('/get/newest/update', adf.firstSet, adf.loggingParams, async (req, res, next) => {

  //parameter
  const params = {
    client : req.query.client,
    version : req.query.version,
    token : req.query.token,
  }

  //Basic validation
  const result = basicValidation(res, params);
  if (result) {
    return result
  }

  //Token auth client
  const valid_result = valid.tokenAuthClient(params.client, params.token)
  if (!valid_result.approval) {
    express_res.funcErr(res, valid_result.status_msg, valid_result.status_code);
    return 'Token valid error.'
  }

  //Update Newest response
  getNewestUpdate.update(req, res)
  .catch(err => {
    errHandle2Top(err, next)
    return 'Update newest error'
  });
})

/**
 * ///////////////////////////////////////////////////
 * Get Newest response
 */
router.get('/get/newest/response', adf.firstSet, adf.loggingParams, async (req, res, next) => {

  const logiD = req.query.logiD

  //parameter
  const params = {
    client : req.query.client,
    version : req.query.version,
    token : req.query.token,
    text : req.query.text,
  }

  //Basic validation
  const result = basicValidation(res, params);
  if (result) {
    return result
  }

  //Token auth client
  const valid_result = valid.tokenAuthKeel(params.token)
  if (!valid_result.approval) {
    express_res.funcErr(res, valid_result.status_msg, valid_result.status_code);
    return 'Token valid error.'
  }

  //Update Newest response
  getNewestResponse.response(req, res, logiD)
  .catch(err => {
    errHandle2Top(err, next)
    return 'get newest error'
  });
})


/**
 * ///////////////////////////////////////////////////
 * Update worth words response
 */
router.get('/get/worthwords/update', adf.firstSet, adf.loggingParams, async (req, res, next) => {

  //parameter
  const params = {
    client : req.query.client,
    version : req.query.version,
    token : req.query.token,
  }

  //Basic validation
  const result = basicValidation(res, params);
  if (result) {
    return result
  }

  //Token auth client
  const valid_result = valid.tokenAuthClient(params.client, params.token)
  if (!valid_result.approval) {
    express_res.funcErr(res, valid_result.status_msg, valid_result.status_code);
    return 'Token valid error.'
  }

  //Update Worth words response
  getWorthWordsUpdate.update(req, res)
  .catch(err => {
    errHandle2Top(err, next)
    return 'Update worth words error'
  });
})

/**
 * ///////////////////////////////////////////////////
 * Get Worth words response
 */
router.get('/get/worthwords/response', adf.firstSet, adf.loggingParams, async (req, res, next) => {

  const logiD = req.query.logiD

  //parameter
  const params = {
    client : req.query.client,
    version : req.query.version,
    token : req.query.token,
    text : req.query.text,
    worth_words : req.query.worth_words
  }

  //Basic validation
  const result = basicValidation(res, params);
  if (result) {
    return result
  }

  //Token auth client
  const valid_result = valid.tokenAuthKeel(params.token)
  if (!valid_result.approval) {
    express_res.funcErr(res, valid_result.status_msg, valid_result.status_code);
    return 'Token valid error.'
  }

  //Update Newest response
  getWorthWordsResponse.response(req, res, logiD)
  .catch(err => {
    errHandle2Top(err, next)
    return 'get worth words error'
  });
})

module.exports = router;        