'use strict'

//System modules
const arranger = require(`./arranger`)


/**
 * ///////////////////////////////////////////////////
 * レスポンスの結果を取得
 * @param {*} response 
 * @param {*} kind
 */
const parseResponse = async (response, kind, logiD) => {
  let results = []
  let talk
  for (let idx in response) {
    talk = JSON.parse(response[idx].talk)
    //without snack bar(snack bar enity do not have talk.type.)
    if (talk.type) {
      if (kind == 'Newest') {
        results.push({
          response_id : response[idx].response_id,
          type : talk.type,
          content : talk.content,
        })
      } else {
        results.push({
          worth_word : response[idx].worth_word,
          type : talk.type,
          content : talk.content,
        })
      }
    }
  }

  //For WorthWords not found message.
  if (!results.length && kind != 'Newest') {
    results.push({
      worth_word : kind,
      type : "text",
      content : { message : "Sorry...Not found the Words."}
    })
  }

  console.log(`=========${logiD} PARSE RESPONSE: ${JSON.stringify(results)}`)
  return results
};

/**
 * ///////////////////////////////////////////////////
 * 最終整形
 * @param {*} answer 
 */
const arrangeForOutput = (answer, logiD) => {

  //Convert message for Bot talking
  let num = 0
  let messages = []
  let newest
  for(let idx in answer) {
    if (answer[idx]) {
      //without snack bar
      if (answer[idx].type) {
        messages.push(arranger.convertBtalk(answer[idx], ++num));  
      }
    }
  }

  //Arrange responded
  const results = arranger.responded(answer, messages, newest, num)
  console.log(`=========${logiD} ARRANGER FOR OUTPUT: ${JSON.stringify(results)}`)
  return results
}

/**
 * ///////////////////////////////////////////////////
 * Parse for WhatYa
 * @param {*} newest 
 * @param {*} kind (Newest or WorthWords)
 */
const parser = async (response, kind, logiD) => {
  return await parseResponse(response, kind, logiD)
    .then(results => {
      return arrangeForOutput(results, logiD)
    })
    .catch(err => {
      throw new Error(err.message)
  });
}
module.exports.func = parser
