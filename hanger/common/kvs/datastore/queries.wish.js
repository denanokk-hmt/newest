'use strict';

// Datastore
const ds = require('./config_wish');
const store = ds.store;

/**
 * Insert Wish data.
 *
 * @param {Object} {*}
 * @param {string} ns namespace
 * @param {string} hmt_id
 *
 * @return {string} keyName || null
 */
const createWish = async ({ ns, hmt_id }) => {
  const key = store.datastore.key({ namespace: ns, path: [ds.KIND.WISH, hmt_id] });
  const date = new Date();
  const data = [
    {
      name: 'cdt',
      value: date,
    },
    {
      name: 'udt',
      value: date,
    },
  ];
  const entity = {
    key: key,
    data: data,
  };
  const wishResult = await store.putEntity(entity);
  return wishResult?.key?.name ?? null;
};

/**
 * Insert AttachmentItem data.
 *
 * @param {Object} {*}
 * @param {string} ns namespace
 * @param {string} parentKey Entity group parent key
 * @param {string} item_id Attachment商品ID
 *
 * @return {Promise}
 */
const createWishAttachmentItem = ({ ns, parentKey, item_id }) => {
  const key = store.datastore.key({
    namespace: ns,
    path: [ds.KIND.WISH, parentKey, ds.KIND.WISH_ATTACHMENT_ITEM],
  });
  const date = new Date();
  const data = [
    {
      name: 'item_id',
      value: item_id,
    },
    {
      name: 'cdt',
      value: date,
    },
    {
      name: 'udt',
      value: date,
    },
  ];
  const entity = {
    key: key,
    data: data,
  };
  return new Promise((resolve, reject) => {
    store
      .putEntity(entity)
      .then((result) => {
        resolve(result);
      })
      .catch((err) => {
        console.log(err);
        reject(err);
      });
  });
};

/**
 * Retrieve Wish Key name.
 *
 * @param {Object} {*}
 * @param {string} ns namespace
 * @param {string} hmt_id
 *
 * @returns {string} wishKeyName || null
 */
const getWishKey = async ({ ns, hmt_id }) => {
  const wishResult = await store.getEntityByKey({ ns, kind: ds.KIND.WISH, key: hmt_id, customNm: true });

  if (!wishResult || !wishResult[0] || !wishResult[0][store.datastore.KEY]) {
    return null;
  }

  return wishResult[0][store.datastore.KEY].name ?? null;
};

/**
 * Get 1 AttachmentItem by item_id
 *
 * @param {Object} {*}
 * @param {string} ns namespace
 * @param {string} hmt_id
 * @param {string} item_id Attachment商品ID
 *
 * @return {Object} attachmentItems
 */
const getAttachmentItem = async ({ ns, hmt_id, item_id }) => {
  // Set namespace
  store.datastore.namespace = ns;
  const parentKey = store.datastore.key({ namespace: ns, path: [ds.KIND.WISH, hmt_id] });
  const query = store.datastore
    .createQuery(ds.KIND.WISH_ATTACHMENT_ITEM)
    .hasAncestor(parentKey)
    .filter('item_id', '=', item_id)
    .limit(1);

  // put entity
  return await store.datastore
    .runQuery(query)
    .then((results) => {
      let entities = results[0];
      if (!entities[0]) {
        return null;
      }
      entities[0]['key_id'] = entities[0][store.datastore.KEY].id;
      return entities[0];
    })
    .catch((err) => {
      throw err;
    });
};

/**
 * Create Wish and AttachmentItem
 *
 * @param {Object} {*}
 * @param {string} ns namespace
 * @param {string} hmt_id
 * @param {string} item_id Attachment商品ID
 *
 * @return {Boolean} is created flag
 */
const createWishForAttachment = async ({ ns, hmt_id, item_id }) => {
  try {
    // get wish data from parent kind
    let parentKey = await getWishKey({ ns, hmt_id });
    // Check if Wish data exists. If it doesn't exist, insert a new Wish data.
    if (!parentKey) {
      parentKey = await createWish({ ns, hmt_id });
    }
    if (!parentKey) {
      return false;
    }
    const wishResult = await createWishAttachmentItem({ ns, parentKey, item_id });
    const isCreated = wishResult?.key ? true : false;
    return isCreated;
  } catch (err) {
    throw err;
  }
};

/**
 * Get AttachmentItem list by hmt_id
 *
 * @param {Object} {*}
 * @param {string} ns namespace
 * @param {string} hmt_id
 *
 * @return {Object} attachment items
 */
const getAttachmentItemList = async ({ ns, hmt_id }) => {
  const wishKey = store.datastore.key({ namespace: ns, path: [ds.KIND.WISH, hmt_id] });
  //Set namespace
  store.datastore.namespace = ns;
  const query = store.datastore.createQuery(ds.KIND.WISH_ATTACHMENT_ITEM).hasAncestor(wishKey);

  // put entity
  return await store.datastore
    .runQuery(query)
    .then((results) => {
      const entities = results[0];
      const itemIds = entities.reduce((itemIdList, entity) => {
        itemIdList.push({
          item_id: entity.item_id,
          cdt: entity.cdt,
          udt: entity.udt,
        });
        return itemIdList;
      }, []);
      return itemIds;
    })
    .catch((err) => {
      throw err;
    });
};

/**
 * Delete AttachmentItem
 *
 * @param {Object} {*}
 * @param {string} ns namespace
 * @param {string} hmt_id
 * @param {string} item_id Attachment商品ID
 *
 * @return {Boolean} is deleted flag
 */
const deleteAttachmentItem = async ({ ns, hmt_id, item_id }) => {
  try {
    const wishAttachmentItem = await getAttachmentItem({ ns, hmt_id, item_id });
    const id = wishAttachmentItem.key_id;
    // Key生成
    const key = store.datastore.key({
      namespace: ns,
      path: [ds.KIND.WISH, hmt_id, ds.KIND.WISH_ATTACHMENT_ITEM, Number(id)],
    });

    const isDeleted = await store
      .deleteEntity(key)
      .then((key) => {
        if (key) {
          return true;
        }
        return false;
      })
      .catch((err) => {
        throw err;
      });
    return isDeleted;
  } catch (err) {
    throw err;
  }
};

module.exports = {
  createWishForAttachment,
  getAttachmentItem,
  getAttachmentItemList,
  deleteAttachmentItem,
};
