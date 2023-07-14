'use strict';

//config
const conf = require(REQUIRE_PATH.configure);

//moduler
const moduler = require(REQUIRE_PATH.moduler);

//System module
const ds_conf = moduler.kvs;
const spreadsheet = require(`./google/spreadsheet-reader`)


//////////////////////////////////////////////////
//Newest
//////////////////////////////////////////////////

/////////////////////////////////////////
/**
 * Update Newest response
 * @param {*} client
 */
const getNewestUpdate = async (client) => {
  console.log(`=========NEWEST UPDATE GET SPREADSHEET ${client}===========`)

  //Get newest responsies
  const data = await spreadsheet.func(client)
  .then(results => {
    let newester = []
    for (let idx in results) {
      if (results[idx].type && results[idx].content) {
        newester[idx] = results[idx]
      } else if (results[idx].newest && results[idx].newest.type != 'not_use') {
        newester[idx] = results[idx]
      }
    }
    return newester
  })
  .catch(err => {
    throw new Error(err.message)
  });

  console.log(`=========NEWEST UPDATE INSERT TO DS ${client}===========`)

  //Set namespace
  const namespace = `${conf.env.kvs.service}-${client}-${conf.env.environment}`

  //Get responsies
  const response = await ds_conf.responsies.getResponsies(namespace, client)
  .catch(err =>{
    throw new Error(err.message)
  })

  //Delete newest response
  for(let idx in response) {
    if (response[idx]) {
      await ds_conf.responsies.deleteResponse(namespace, response[idx].response_id)
      .catch(err =>{
        throw new Error(err.message)
      })
    }
  }

  //Insert newest response
  for(let idx in data) {
    await ds_conf.responsies.insertResponse(namespace, client, idx, JSON.stringify(data[idx]))
    .catch(err =>{
      throw new Error(err.message)
    })
  }

  return true;
}
module.exports.update = getNewestUpdate;

/////////////////////////////////////////
/**
 * Get Newest response
 * @param {*} client 
 */
const getNewestResponse = async (client, logiD) => {

  //Set namespace
  const namespace = `${conf.env.kvs.service}-${client}-${conf.env.environment}`

  //Get responsies
  const response = await ds_conf.responsies.getResponsies(namespace, client)
  .catch(err =>{
    throw new Error(err.message)
  })

  return response

};
module.exports.response = getNewestResponse;


//////////////////////////////////////////////////
//Worth Words
//////////////////////////////////////////////////

/////////////////////////////////////////
/**
 * Update Worth words response
 * @param {*} client
 */
const getWorthWordsUpdate = async (client) => {
  console.log(`=========WORTH WRDS UPDATE GET SPREADSHEET ${client}===========`)

  //Get newest responsies
  const data = await spreadsheet.func(client, 'WorthWords')
  .catch(err => {
    throw new Error(err.message)
  });

  //Set namespace
  const namespace = `WhatYa-WorthWords-${client}-${conf.env.environment}`

  console.log(`=========WORTH WORDS UPDATE INSERT TO DS `, namespace)

  //Delete worth words response
  await ds_conf.worthwords.deleteResponseByAll(namespace)
  .catch(err =>{
    throw new Error(err.message)
  })

  //Insert worth words response
  for(let idx in data) {
    await ds_conf.worthwords.insertResponse(namespace, client, idx, JSON.stringify(data[idx]))
    .catch(err =>{
      throw new Error(err.message)
    })
  }

  return true;
}
module.exports.updateWorthWords = getWorthWordsUpdate;

/////////////////////////////////////////
/**
 * Get Worth Words responsies
 * @param {*} client 
 * @worth_words {*} { worth_word, user_prof, chatwindow_open }
 */
const getWorthWordsResponsies = async (client, worth_word, logiD) => {

  //Set namespace
  const namespace = `WhatYa-WorthWords-${client}-${conf.env.environment}`

  //Get worth words responsies
  const response = await ds_conf.worthwords.getWorthWordsResponsies(namespace, client, worth_word)
  .catch(err =>{
    throw new Error(err.message)
  })

  return response

};
module.exports.getWorthWordsResponsies = getWorthWordsResponsies;