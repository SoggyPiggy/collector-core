/* eslint-disable no-param-reassign */
export const insertOne = async function dbHelperInsertOne(collection, obj) {
  const { insertedId } = (await collection).insertOne(obj);
  return { ...obj, _id: insertedId };
};

export const updateOne = async function dbHelperUpdateOne(collection, obj, options) {
  (await collection).updateOne({ _id: obj._id }, { $set: obj }, options);
  return obj;
};

export const findOne = async function dbHelperFindOne(collection, query) {
  return (await collection).findOne(query);
};

export const findCursor = async function dbHelperFindCursor(collection, query = {}, options = {}) {
  return (await collection).find(query, options);
};

export const findArray = async function dbHelperFindArray(collection, query = {}, options = {}) {
  return (await findCursor(collection, query, options)).toArray();
};
