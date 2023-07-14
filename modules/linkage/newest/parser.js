'use struct';

//Read CSV
const parseData = (spreadsheet, kind) => {
  return arranger2(spreadsheet, kind)
}
module.exports.parseData = parseData

/**
 * Make for Bwing type response Array
 * No Associative array(slider, chip) Base arrangement 
 * @param {*} data 
 */
function arranger2(data, kind) {
  const default_column_type_pos = 1 //csvデータのtypeのカラム位置 
  const default_column_msg_pos = 2 //csvデータのmessageのカラム位置 
  const default_column_qty = 3 //csvデータの必須カラム, 
  const default_column_name_pos = 3 //csvデータのカラム名の位置
  const value_column_pos = default_column_qty + 1 //csvデータの入力値の開始位置
  let column
  let num
  let sliders
  let values
  let resMsg
  let resArry = []
  let response_id = 0
  let worth_word
  for(let i in data) {

    let row = Number(i) + 1
    resMsg = {}
    worth_word = (kind == 'Newest')? null : data[i][0]

    switch (data[i][default_column_type_pos]) {
      case 'text' :
        if (!data[i][default_column_msg_pos]) throw new Error(`Messageが設定されていません。行:${row}`);
        resMsg = {
          type: data[i][default_column_type_pos],
          content: {
            message: data[i][default_column_msg_pos].replace(/\r?\n/g, '\\n'),
          },
          worth_word: worth_word,
        }
        break;
      case 'markdown' :
        if (!data[i][default_column_msg_pos]) throw new Error(`Messageが設定されていません。行:${row}`);
        let msg = data[i][default_column_msg_pos].replace(/###/g, data[i][3])
        msg = msg.replace(/&&&/g, data[i][4])
        resMsg = {
          type : data[i][default_column_type_pos],
          content : {
            message : msg,
          },
          worth_word: worth_word,
        }
        break;
      case 'telephone' :
        if (!data[i][default_column_msg_pos]) throw new Error(`Messageが設定されていません。行:${row}`);
        if (!data[i][default_column_qty]) throw new Error(`電話番号が設定されていません。行:${row}`);
        resMsg = {
          type : data[i][default_column_type_pos],
          content : {
            message : data[i][default_column_msg_pos],
            value : data[i][default_column_qty],
          },
          worth_word: worth_word,
        }
        break;
      case 'mail' :
        if (!data[i][default_column_msg_pos]) throw new Error(`Messageが設定されていません。行:${row}`);
        if (!data[i][default_column_qty]) throw new Error(`メールアドレスが設定されていません。行:${row}`);
        resMsg = {
          type : data[i][default_column_type_pos],
          content : {
            message : data[i][default_column_msg_pos],
            value : data[i][default_column_qty],
          },
          worth_word: worth_word,
        }
        break;
      case 'image' :
        if (!data[i][default_column_msg_pos]) throw new Error(`Messageが設定されていません。行:${row}`);
        if (!data[i][default_column_qty]) throw new Error(`イメージURLが設定されていません。行:${row}`);
        if (!data[i][default_column_qty]) throw new Error(`イメージAltが設定されていません。行:${row}`);
        resMsg = {
          type : data[i][default_column_type_pos],
          content : {
            message : data[i][default_column_msg_pos].replace(/\r?\n/g, '\\n'),
            img_url : data[i][default_column_qty],
            alt : data[i][value_column_pos],
          },
          worth_word: worth_word,
        }
        break;
      case 'string_string_slider' :
      case 'string_value_slider' :
      case 'string_image_slider' :
      case 'item_image_slider' :
      case 'link_image_slider' :
        if (!data[i][default_column_name_pos]) throw new Error(`カラム名が設定されていません。行:${row}`);
        column = data[i][default_column_name_pos].replace(/\r?\n/g, ',').split(',')
        if (!column[0] || column[0] != "item_name") throw new Error(`カラム名1に[itme_name]が設定されていません。行:${row}`);
        if (!column[1] || column[1] != "item_value") throw new Error(`カラム名2に[itme_value]が設定されていません。行:${row}`);
        if (!column[2] || column[2] != "img_url") throw new Error(`カラム名3に[img_url]が設定されていません。行:${row}`);
        if (!column[3] || column[3] != "alt") throw new Error(`カラム名4に[alt]が設定されていません。行:${row}`);
        if (data[i][default_column_type_pos] == 'link_image_slider') {
          if (!column[4] || column[4] != "link") throw new Error(`カラム名4に[link]が設定されていません。行:${row}`);
        }
        if (!data[i][default_column_msg_pos]) throw new Error(`Messageが設定されていません。行:${row}`);
        if (!data[i][value_column_pos]) throw new Error(`Slidersが設定されていません。行:${row}`);        
        num = 0
        sliders = []
        for (let y = value_column_pos; y < data[i].length; y++ ) {          
          let values = data[i][y].replace(/\r?\n/g, '|').split('|')
          if (column.length != values.length) throw new Error(`カラムとSlidersの数が一致していません。行:${row}`);
          let val = {}
          if (column.length == values.length) {
            for (let z in column) {
              val[column[z]] = values[z]
            }
            sliders.push(val)
          }
        }
        resMsg = {
          type : data[i][default_column_type_pos],
          content : {
            message : data[i][default_column_msg_pos].replace(/\r?\n/g, '\\n'),
            sliders,
          },
          worth_word: worth_word,
        }
        break;
      case 'string_string_chip' :
      case 'string_value_chip' :
      case 'string_avatar_chip' :
      case 'list' :
        if (!data[i][default_column_name_pos]) throw new Error(`カラム名が設定されていません。行:${row}`);
        column = data[i][default_column_name_pos].replace(/\r?\n/g, ',').split(',')
        if (!column[0] || column[0] != "item_name") throw new Error(`カラム名に[itme_name]が設定されていません。行:${row}`);
        if (!column[1] || column[1] != "item_value") throw new Error(`カラム名に[itme_value]が設定されていません。行:${row}`);
        if (!data[i][default_column_msg_pos]) throw new Error(`Messageが設定されていません。行:${row}`);
        if (!data[i][value_column_pos]) throw new Error(`Chipsが設定されていません。行:${row}`);        
        num = 0
        let chips = []
        for (let y = value_column_pos; y < data[i].length; y++ ) {          
          let values = data[i][y].replace(/\r?\n/g, '|').split('|')
          if (column.length != values.length) throw new Error(`カラムとChipsの数が一致していません。行:${row}`);
          let val = {}
          if (column.length == values.length) {
            for (let z in column) {
              val[column[z]] = values[z]
            }
            chips.push(val)
          }
        }
        resMsg = {
          type : data[i][default_column_type_pos],
          content : {
            message : data[i][default_column_msg_pos].replace(/\r?\n/g, '\\n'),
            chips,
          },
          worth_word: worth_word,
        }
        break;
      case 'dialog':
        if (!data[i][default_column_msg_pos]) throw new Error(`Messageが設定されていません。行:${row}`);
        let messages = data[i][default_column_msg_pos].replace(/message:/, '|').replace(/chip_accept:/, '|').replace(/chip_deny:/, '|').split("|")
        const message = messages[1].replace(/\r?\n/g, '\\n').replace(/(.*)\\n/g, '$1')
        const chip_accept = messages[2].replace(/\r?\n/g, '')
        const chip_deny = messages[3].replace(/\r?\n/g, '')
        let dialog_items = []
        let item_value ={}
        let dialog_values = []
        let z = -1

        let dialog_keys = []
        for (let y = default_column_name_pos; y < data[i].length; y++ ) {
          if (!data[i][y]) throw new Error(`Dialogが設定されていません。行:${row}`);
          let values = data[i][y].replace(/\r?\n/g, '|').split('|')
          if (values[0].match("type:")) {
            z++
            dialog_values = []
            dialog_keys[0] = values[0].replace(/type:/, '')
            dialog_keys[1] = values[1].replace(/label:/, '')
            dialog_keys[2] = values[2].replace(/key:/, '')
          } else {
            if (values[1] && values[2]) {
              dialog_values.push({
                item_name : values[1],
                item_value : values[2],
              })
            }
          }
          //always rewrite item values
          item_value = {
            type : dialog_keys[0],
            label : dialog_keys[1],
            key : dialog_keys[2],
            values : dialog_values,
          }
          dialog_items[z] = item_value
        }

        resMsg = {
          type : data[i][default_column_type_pos],
          content : {
            message,
            chip_accept,
            chip_deny,
            dialog_items,
          },
          worth_word: worth_word,
        }
        break;
      case 'image_card' :
        if (!data[i][default_column_name_pos]) throw new Error(`カラム名が設定されていません。行:${row}`);
        column = data[i][default_column_name_pos].replace(/\r?\n/g, ',').split(',')
        if (!column[0] || column[0] != "img_url") throw new Error(`カラム名に[img_url]が設定されていません。行:${row}`);
        if (!column[1] || column[1] != "link_label") throw new Error(`カラム名に[link_label]が設定されていません。行:${row}`);
        if (!column[2] || column[2] != "link_url") throw new Error(`カラム名に[link_url]が設定されていません。行:${row}`);
        if (!data[i][default_column_msg_pos]) throw new Error(`Messageが設定されていません。行:${row}`);
        if (!data[i][value_column_pos]) throw new Error(`Chipsが設定されていません。行:${row}`);          
        values = data[i][value_column_pos].replace(/\r?\n/g, '|').split('|')
        if (column.length != values.length) throw new Error(`カラムとCardの数が一致していません。行:${row}`);
        if (!data[i][5]) throw new Error(`Cardにコラム(説明)がありません。行:${row}`);        
        resMsg = {
          type : data[i][default_column_type_pos],
          content : {
            message : data[i][default_column_msg_pos],
            image: values[0],
            text : data[i][5].replace(/\r?\n/g, '\\n'),
            link: {
              label:values[1],
              url:values[2],
            }
          },
          worth_word: worth_word,
        }
        break;
      case 'snack_bar' :
        resMsg = {
          newest : {
            type : data[i][3],
            updated_at : new Date().getTime(),
            content : {
              message : data[i][default_column_msg_pos],
              value : data[i][4].replace(/\r?\n/g, '\\n'),
            },
            worth_word: worth_word,
          },
        }
        break;
      default :
    }
    //Set bot talking for response set
    if (kind == 'Newest') {
      resArry[ data[i][0] ] = resMsg;
    } else {
      response_id++
      resArry[ `${kind}_${response_id}` ] = resMsg;
    }
  }
  return resArry
}

/**
 * \n replace to \\n 
 * @param {*} data 
 */
function replaceN(data) {
  let resMsg
  let resArry = []
  for(let i in data) {
    let res = []
    resMsg = data[i][1].replace(/\r?\n/g, '\\n')
    resArry[ data[i][0] ] = resMsg;
  }
  return resArry
}