import fetch from 'node-fetch';
import { getSessionToken } from '@shopify/app-bridge-utils';

const create = (app) => {
  const X = {};
  const methods = ['get', 'post', 'delete'];

  const fn = async (method, url, data, callback, callbackForError = null, headers = {}) => {
    let sessionToken = await getSessionToken(app);
    headers['Authorization'] = `Bearer ${sessionToken}`;
    let request = { headers: headers };
    switch(method) {
      case 'post':
        request = { method: 'POST', body: JSON.stringify(data), headers: headers };
        break;
      case 'delete':
        request = { method: 'DELETE', headers: headers };
        break;
    }
    return fetch(url, request)
      .then(response => {
        if (!response.ok) throw response;
        return response.json();
      })
      .then(callback)
      .catch(err => {
        if (err.message) {
          if (callbackForError) {
            callbackForError(err.message);
          } else {
            console.log(err)
          }
          return;
        }
        err.json().then(error => {
          if (callbackForError) {
            callbackForError(error.message);
          } else {
            console.log(error)
          }
        })
      });
  }
  
  methods.forEach(function(method) {
    if (method == 'post') {
      X[method] = (url, data = null, callback, callbackForError = null, headers = {}) => {
        return fn(method, url, data, callback, callbackForError, headers);
      };
    } else {
      X[method] = (url, callback, callbackForError = null, headers = {}) => {
        return fn(method, url, null, callback, callbackForError, headers);
      };
    }
  });

  return X;
}

export default create;


