'use strict'

//config
const conf = require(REQUIRE_PATH.configure);
const code = conf.status_code
const status = conf.status
const default_msg = conf.default_message;

/////////////////////////////////////////////////
/**
 * not use in 1.1.0
 * Result arrange
 * get intents, entiteis, arrange talk
 * @param {*} response
 */
const resultArrange = (response, idx) => {

  //Set bot talking for response set
  return {
    type: 'text',
    content: {
      message: response.output.text[idx],
    },
    text: response.output.text[idx],
    res_type : 'text',
  }
}
module.exports.resultArrange = resultArrange;


/////////////////////////////////////////////////
/**
 * Convert Error result
 * Error: Validate, Timeout, API error
 * @param {*} result 
 */
const convertErrors = (result) => {

  if (result.error) {

    //Retrun formatting JSON error answers
    return({
      status_code : code.ERR_A_SYSTEM_990,
      status_msg : status.ERR_A_SYSTEM_990,
      talk : {
        type: 'text',
        content: {
          message: default_msg.system_error,
        },
      },
      btalk_type: "text",
    });

  } else {

    //Retrun formatting JSON result answers
    return({
      status_code : result.status_code,
      status_msg : result.status,
      talk : result.talk,
      btalk_type: result.res_type,
    });
  }
};
module.exports.convertErrors = convertErrors;


/////////////////////////////////////////////////
/**
 * Bot talk convert
 * @param {*} answer
 * @param {unixtime} ut  
 * @param {date} dt 
 */
const convertBtalk = (answer, num) => {
  const dt = new Date()
  let ut = dt.getTime()
  const talk = answer
  return {
    mtime: ut + num,
    mtype: "bot",
    talk,
    cdt: dt,
  }
}
module.exports.convertBtalk = convertBtalk;


/////////////////////////////////////////////////
/**
 * Arrange responded
 * @param {*} answer
 * @param {*} messages 
 * @param {*} newest
 * @param {*} num
 * @param {*} status_code
 * @param {*} status_text
 */
const responded = (answer, messages, newest, num, status_code, status_text) => {
  
  status_code = (!status_code)? code.SUCCESS_ZERO : status_code
  status_text = (!status_text)? status.SUCCESS_ZERO : status_text

  const btalk = {
    type : "API",
    status_code : status_code,
    status_msg : status_text,
    qty: num,
    messages,
    newest,
  }
  return {
    btalk_type : answer[0].btalk_type,
    btalk,
  }
}
module.exports.responded = responded;