'use strict';

const conf = require(`../config/configure`);
const code = conf.status_code
const status = conf.status
const tokens = conf.tokens_client

const validation = function (question) {

	//var arryValidErr = {　'min_len' : 'true' };
	let exclusion_judge = false; 

	//Matching exclusion words to question.
	for (let key in conf.config.exclusion_min_length_strings) {
		//console.log(key + " : " + conf.exclusion_min_length_strings[key]);
		if (question == conf.config.exclusion_min_length_strings[key]) {
			exclusion_judge = true; 
			break;
		} else {
			exclusion_judge = false;
		}
	}

	//Validation minimum question length
	if (!exclusion_judge) {
		if (conf.config.under_min_length.question_min_length > question.length) {
			//arryValidErr['min_len'] = false;
			return {
				type : 'Validation',
				status_code : code.ERR_V_LEN_MIN_202,
				status  : status.ERR_V_LEN_MIN_202,
				approval : false,
				content  : conf.config.under_min_length,
			}
		} else if (conf.config.over_max_length.question_max_length < question.length) {
			//arryValidErr['min_len'] = false;
			return {
				type : 'Validation',
				status_code : code.ERR_V_LEN_MAX_203,
				status  : status.ERR_V_LEN_MAX_203,
				approval : false,
				content  : conf.config.over_max_length,
			}
		}
	}
	
	//arryValidErr['min_len'] = true;
	return {
		type : 'Validation',
		status_code : code.SUCCESS_ZERO,
		status  : 'Length Validation OK.',
		approval : true,
	}

};
module.exports.func = validation;

/**
 * Parameter is
 * @param {*} params 
 */
const isParamValue = (params) => {
	let result
	for (let key in params) {
		result = IsValue(params[key], key)
		if (!result.approval) {
			break;
		}
	}	
	return result
}
module.exports.isParamValue = isParamValue

/**
 * Value is or not
 * @param {*} value 
 * @param {*} key
 */
const IsValue = (value, key) => {
	if (value) {
		return {
			type : 'Validation',
			status_code : code.SUCCESS_ZERO,
			status_msg : `Validation OK.`,
			approval : true,
		}
	} else {
		return {
			type : 'Validation',
			status_code : code.ERR_V_IS_VAL_201,
			status_msg : `${key} ${status.ERR_V_IS_VAL_201}`,
			approval : false,
		}
	}
}


/**
 * Major Version check
 * @param {*} version 
 */
const versionAuth = version => {
	
	if (version) {
		if (conf.version.split(".")[0] == version.split(".")[0]) {
			return {
				type : "Auth",
				status_code : code.SUCCESS_ZERO,
				status_msg : "Version auth Success.",
				approval : true,
			}
		}
	}
	
	return {
		type : "Auth",
		status_code : code.ERR_A_VERSION_302,
		status_msg : status.ERR_A_VERSION_302,
		version : "Version Error",
		approval : false,
	}	
}
module.exports.versionAuth = versionAuth;

/**
 * Auth Token
 * @param {*} client
 * @param {*} token
 */
const tokenAuthClient = (client, token) => {

	for (let idx in tokens.list[client]) {
		if (tokens.list[client][idx] == token) {
			return {
				type : "Token Auth",
				status_code : code.SUCCESS_ZERO,
				status_msg : "Token auth Success.",
				approval : true,
			}
		}
	}

	return {
		type : "Auth",
		status_code : code.ERR_A_OAUTH_NON_303,
		status_msg : status.ERR_A_OAUTH_NON_303,
		approval : false,
	}
}
module.exports.tokenAuthClient = tokenAuthClient;

/**
 * Auth Token Keel
 * @param {*} token
 */
const tokenAuthKeel = (token) => {

	if (conf.conf_newest.token == token) {
		return {
			type : "Token Auth",
			status_code : code.SUCCESS_ZERO,
			status_msg : "Token auth Success.",
			approval : true,
		}
	}

	return {
		type : "Auth",
		status_code : code.ERR_A_OAUTH_NON_303,
		status_msg : status.ERR_A_OAUTH_NON_303,
		approval : false,
	}
}
module.exports.tokenAuthKeel = tokenAuthKeel;