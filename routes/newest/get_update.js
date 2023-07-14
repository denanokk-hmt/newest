'use strict';

//config
const conf = require(REQUIRE_PATH.configure);
const code = conf.status_code

//express
const express_res = conf.express_res

//System modules
const getter = require(`${REQUIRE_PATH.modules}/linkage/newest/getter`)


/**
 * Update Newest response
 * @param {*} req 
 * @param {*} res 
 */
const getNewestUpdate = async (req, res) => {

  console.log(`=========UPDATE NEWEST===========`)

  //Update response
  await getter.update(req.query.client)
  .then(result => {
    //Response contents
    const resMessages = {
      type : "API",
      status_code : code.SUCCESS_ZERO,
      status_msg : `Success Update Newest.`,
      client : `${req.query.client}`,
      udt : new Date(),
    }
    //Response
    express_res.func(res, resMessages)

    return 'success';
  });
};
module.exports.update = getNewestUpdate;