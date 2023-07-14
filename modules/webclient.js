'use strict';

const webclient = require("request");
const conf = require(`../config/configure`);
const code = conf.status_code


/**
 * Get newest response
 * Need response return status_code, answer(contents of response)
 * @param {*} url
 * @param {*} params 
 */
const getRequest = (url, params) => {
  return new Promise(function(resolve, reject) {
    webclient.get({
      url: url,
      headers: {
        'Content-Type': 'Accept: application/json',
      },
      qs: params
    }, function (error, response, body) {
      if (error) {
        reject(error)
      } else {
        //const res 
        try {
          const res = JSON.parse(body)
          if (code) {
            switch (res.status_code) {
              case code.SUCCESS_ZERO :
              case code.WAR_V_ASKER_UPDATE_104 :
                resolve(res);
                break;
              default :
                console.error(body)
                reject(res)
            }
          } else {
            //this case server initailize, not have status code
            switch (res.status_code) {
              case 0: 
                resolve(res);
                break;
              default :
                console.error(body)
                reject(res)
            }            
          }
        } catch(err) {
          console.error(err)
          reject("Server error")
        }
      }
    })
  })
}
module.exports.getRequest = getRequest;