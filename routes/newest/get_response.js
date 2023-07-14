'use strict';

//config
const conf = require(REQUIRE_PATH.configure);
const code = conf.status_code
const status = conf.status

//express
const express_res = conf.express_res

//System modules
const getter = require(`${REQUIRE_PATH.modules}/linkage/newest/getter`)
const parser = require(`${REQUIRE_PATH.modules}/defaults/parser_${conf.env.ui_module}`)


/**
 * Get Newest response
 * @param {*} req 
 * @param {*} res 
 */
const getNewestResponse = async (req, res, logiD) => {

  console.log(`=========RESPONSE NEWEST===========`)

  //Get response
  const response = await getter.response(req.query.client, logiD)
    
  //Parse & response
  await parser.func(response, 'Newest', logiD)
    .then(results => {
      console.log(`=========${logiD} NEWEST Response res ${req.query.client}: ${JSON.stringify(results)}`)
      
      //Response contents
      const resMessages = {
        type : "API",
        status_code : code.SUCCESS_ZERO,
        status_msg : status.SUCCESS_ZERO,
        client : `${req.query.client}`,
        answer : results,
        udt : new Date(),
      }
      
      //Response
      express_res.func(res, resMessages)

      return 'success';
  });
};
module.exports.response = getNewestResponse;