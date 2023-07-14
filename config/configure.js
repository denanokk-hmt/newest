'use strict';

//System modules
const { getRequest } = require(`${REQUIRE_PATH.moduler}/stand_alone`).wakeup('http')


/**
 * Set configure
 * @param args {*} {  
 * @param {*} appli_name 
 * @param {*} server_code 
 * @param {*} environment
 * } 
 */
const configuration = async (args) => {

  /////////////////////////
  //Set basic server configs

  //NODE ENV
  const hostname = process.env.HOSTNAME
  console.log(`hostname:${hostname}`)

  //Direcotry pass
  const dirpath =(process.env.NODE_ENV == 'prd')? '/home/dev' : '.'
  module.exports.dirpath = dirpath

  //express response common
  const express_res = require(`../routes/express_res`);
  module.exports.express_res = express_res

  //Application name
  const appli_name = args.appli_name
  module.exports.appli_name = appli_name

  //Server code
  const server_code = args.server_code
  module.exports.server_code = server_code

  //Depoy environmebt
  const environment = args.environment
  module.exports.environment = environment

  //short sha commit id
  const sha_commit_id = process.env.SHA_COMMIT_ID || null;

  //deploy stamp
  const deploy_unixtime = process.env.DEPLOY_UNIXTIME || 0;

  //restart stamp
  const restart_unixtime = process.env.RESTART_UNIXTIME || 0;

  //Set commitid
  //restart is grater than deploy_unixtime --> Restart, using latest revisions :: [sha_commit_id]_[restart_unixtime]
  //Other than that --> Deploy or Restart, using history revisions :: [sha_commit_id]
  const commitid =(deploy_unixtime < restart_unixtime)? `${sha_commit_id}_${restart_unixtime}` : sha_commit_id;

  /////////////////////////
  //Get configure by control tower

  //Set control tower credentials
  const run_domain = 'control-tower2.bwing.app';
  const run_version = '2.0.0';
  const run_token = require('./keel_auth.json').token;
  const domain = (process.env.NODE_ENV == 'prd')? `https://${run_domain}` : `http://localhost:8081`;
  const url = `${domain}/hmt/get/configuration`;
  const params = {
    appli_name : appli_name,
    version : run_version,
    token : run_token,
    server_code : server_code,
    environment : environment,
    hostname: process.env.HOSTNAME || 'localhost',
    commitid: commitid,
    component_version: process.env.VERSION || ((args.series=='v2')? '2.0.0' : '1.1.0'),
  }

  //Get configure
  const result = await getRequest(url, params, )
  .then(response => {
    if (response.data?.status_code != 0) {
      throw Error(`status_code:${response.data?.status_code}`)
    }
    return response.data
  })
  .catch(err => {
    console.error(err)
    process.exit(-1)
  })

  /////////////////////////
  //Exports configure
  
  //formation
  const formation = result.formation
  module.exports.formation = formation;

  //Project id
  const google_prj_id = result.google_prj_id
  module.exports.google_prj_id = google_prj_id
  
  //env
  const env = result.env;
  module.exports.env = env;

  //version
  const version = params.component_version;
  module.exports.version = version;

  //common(status_code, status_msg, dummy)
  const common = result.common
  const status_code = common.status_code;
  const status = common.status_msg;
  const dummy = common.dummy;
  module.exports.status_code = common.status_code;
  module.exports.status = common.status_msg;
  module.exports.dummy = common.dummy;

  //Tokens for client
  const tokens_client = result.tokens_client
  module.exports.tokens_client = tokens_client

  //Newest Google spreadsheet
  const newest_sheet_config = result.newest_sheet_config;
  module.exports.newest_sheet_config = newest_sheet_config;

  //Newest config
  const conf_keel = result.keel_auth;
  module.exports.conf_keel = conf_keel

  /////////////////////////
  //Local config files exports

  //AI deefault message
  const default_message = require(`./default.message.json`);
  module.exports.default_message = default_message;

  //GooglespreadSheets api credentials path
  const google_sheets_credentials_path = `${dirpath}/config/${server_code}/google_sheets_api/credentials.json`;
  module.exports.google_sheets_credentials = google_sheets_credentials_path

  //GooglespreadSheets api token path
  const google_sheets_token_path = `${dirpath}/config/${server_code}/google_sheets_api/token.json`;
  module.exports.google_sheets_token = google_sheets_token_path
  
  //commit id : Use pod instance group id
  console.log(`COMMITID: ${process.env.COMMITID}`)
  const commit_id = process.env.COMMITID
  module.exports.commit_id = commit_id

  /////////////////////////
  //Return to app
  return {
    server_code,
    formation,
    env,
    status_code,
    status,
  }
} 

module.exports = { configuration }