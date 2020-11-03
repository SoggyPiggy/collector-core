/* eslint-disable no-param-reassign */
export const insertOne = async function dbHelperInsertOne(collection, obj) {
  collection = await collection;
  return new Promise((resolve, reject) => {
    collection.insertOne(obj)
      .catch(reject)
      .then(({ insertedId }) => resolve({ ...obj, _id: insertedId }));
  });
};

export const updateOne = async function dbHelperUpdateOne(collection, obj, options) {
  collection = await collection;
  return new Promise((resolve, reject) => {
    collection.updateOne({ _id: obj._id }, { $set: obj }, options)
      .catch(reject)
      .then(() => resolve(obj));
  });
};

export const findOne = async function dbHelperFindOne(collection, query) {
  collection = await collection;
  return new Promise((resolve, reject) => {
    collection.findOne(query)
      .catch(reject)
      .then(resolve);
  });
};
