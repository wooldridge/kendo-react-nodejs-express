const config = require('../setup/config'); // Use project settings in setup config
const axios = require('axios');

/**
* Handle REST errors.
*/
const handleError = (err) => {
  if (err.error &&
      err.error.errorResponse &&
      err.error.errorResponse.message) {
    console.error('Error: ' + err.error.errorResponse.message);
  } else {
    console.error(JSON.stringify(err, null, 2));
  }
  throw(err);
}

const baseURL = 'http://' + config.host + ':' + config.rest["rest-api"].port;

const auth = {
  username: config.user['user-name'],
  password: config.user.password
}

/**
* Get documents by collection.
*/
const getDocs = async (coll) => {
  const options = {
    method: 'GET',
    url: '/v1/search?format=json&options=search-options&pageLength=999&collection=' + coll,
    baseURL: baseURL,
    headers: {'Content-type': 'application/json'},
    auth: auth
  }
  try {
    const response = await axios(options);
    if (response && response.status === 200) {
      let parsed = response.data.results.map(r => {
        return r.extracted.content[0][coll];
      })
      return parsed;
    }
  } catch (error) {
      handleError(error);
  }
}

/**
* Get next ID available greatest in document collection.
*/
const getNextId = async (coll) => {
  const docs = await getDocs(coll);
  let ids = docs.map(d => {
    return parseInt(d['ProductID']);
  })
  ids = ids.sort(function(a, b) { return a - b; });
  return ids[ids.length-1] + 1;
}

/**
* Update document in collection by ID.
*/
const updateDoc = async (id, item, coll) => {
  const uri = '/product/product' + id + '.json';
  let data = {};
  data[coll] = item;
  data[coll]['ProductId'] = id;
  data[coll]['inEdit'] = false;
  const options = {
    method: 'PUT',
    url: '/v1/documents?format=json&uri=' + uri,
    baseURL: baseURL,
    headers: {'Content-type': 'application/json'},
    data: data,
    auth: auth
  }
  try {
    const response = await axios(options);
    if (response && response.status === 200) {
      return response;
    }
  } catch (error) {
      handleError(error);
  }
}

/**
* Create a document in the collection.
*/
const createDoc = async (item, coll) => {
  const id = await getNextId('product');
  const uri = '/' + coll + '/' + coll + id + '.json';
  let data = {};
  data[coll] = item;
  data[coll]['ProductID'] = id;
  data[coll]['inEdit'] = false;
  const options = {
    method: 'PUT',
    url: '/v1/documents?format=json&uri=' + uri + '&collection=' + coll,
    baseURL: baseURL,
    headers: {'Content-type': 'application/json'},
    data: data,
    auth: auth
  }
  try {
    const response = await axios(options);
    if (response && response.status === 200) {
      return response;
    }
  } catch (error) {
      handleError(error);
  }
}

/**
* Delete a document.
*/
const deleteDoc = async (id) => {
  const uri = '/product/product' + id + '.json';
  const options = {
    method: 'DELETE',
    url: '/v1/documents?uri=' + uri,
    baseURL: baseURL,
    headers: {'Content-type': 'application/json'},
    auth: auth
  }
  try {
    const response = await axios(options);
    if (response && response.status === 200) {
      return response;
    }
  } catch (error) {
      handleError(error);
  }
}

const marklogic = {
  getDocs: getDocs,
  getNextId: getNextId,
  updateDoc: updateDoc,
  createDoc: createDoc,
  deleteDoc: deleteDoc,
};

module.exports = marklogic;