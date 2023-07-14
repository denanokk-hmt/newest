'use strict'


const ds_conf = require('./config.js');
const store = require('./store.js');

/**
 * Update respomse
 * @param {*} namespace
 * @param {*} client
 * @param {*} response_id
 * @param {JSON} talk 
 */
const insertResponse = (namespace, client, response_id, talk) => {
  
  const dt = new Date();

  //entity生成
  const key = store.datastore.key({
    namespace: namespace,
    path: [ ds_conf.KIND.RESPONSIES, response_id ],
  })
  const data = [
    {
      name: 'client',
      value: client,
    },
    {
      name: 'response_id',
      value: response_id,
    },
    {
      name: 'udt',
      value: dt,
    },
    {
      name: 'cdt',
      value: dt,
    },
    {
      name: 'talk',
      value: talk,
      excludeFromIndexes: true,
    },
  ]
  const entity = {
    key: key,
    data: data,
  }
  return new Promise((resolve, reject) => {
    store.putEntity(entity).then(result => {
      resolve(result)
    })
    .catch(err => {
      console.log(err)
      reject(err)
    })
  });
}
module.exports.insertResponse = insertResponse;

/**
 * Delete respomse
 * @param {*} namespace
 * @param {*} response_id
 */
const deleteResponse = (namespace, response_id) => {

  //Key生成
  const key = store.datastore.key({
    namespace: namespace,
    path: [ ds_conf.KIND.RESPONSIES, response_id ],
  })

  return new Promise((resolve, reject) => {
    store.deleteEntity(key).then(result => {
      resolve(result)
    })
    .catch(err => {
      console.log(err)
      reject(err)
    })
  });
}
module.exports.deleteResponse = deleteResponse;

/**
 * Get responsies
 * @param {*} namespace
 * @param {int} client
 */
const getResponsies = (namespace, client) => {
  return new Promise((resolve, reject) => {

    //Set namespace
    store.datastore.namespace = namespace

    //set Query
    const query = store.datastore
      .createQuery(ds_conf.KIND.RESPONSIES)
      .filter('client', '=', client)
      .limit(100);

    //run query
    store.datastore.runQuery(query)
      .then(results => {
        const entities = results[0];
        resolve(entities);
      }).catch(err => {
        console.log(err)
        reject(err)
      })
    });
}
module.exports.getResponsies = getResponsies;