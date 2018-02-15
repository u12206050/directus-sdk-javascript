const axios = require('axios');
const qs = require('qs');

class RemoteInstance {
  constructor(options) {
    const {accessToken, url, version, headers} = options;

    this.accessToken = accessToken;
    this.headers = headers || {};
    this.version = version || '1.1';

    if (!url) {
      throw new Error('No Directus URL provided');
    }

    this.base = url.replace(/\/+$/, '');
    this.api = this.base + '/api/';
    this.url = this.api + this.version + '/';
  }

  get _requestHeaders() {
    const headers = this.headers || {};

    if (this.accessToken) {
      headers.Authorization = 'Bearer ' + this.accessToken;
    }

    return headers;
  }

  _onCaughtError(err) {
    if (err.response && err.response.data) {
      return reject(err.response.data);
    }

    return reject(err);
  }

  _get(endpoint, params = {}, isAPI = false) {
    const headers = this._requestHeaders;
    const url = isAPI ? this.api : this.url;

    return new Promise((resolve, reject) => {
      axios.get(url + endpoint, {
        params,
        headers,
        paramsSerializer: params => qs.stringify(params, {arrayFormat: 'brackets'})
      })
        .then(res => resolve(res.data))
        .catch(err => this._onCaughtError(err));
    });
  }

  _post(endpoint, data = {}, isAPI = false) {
    const headers = this._requestHeaders;
    const url = isAPI ? this.api : this.url;

    return new Promise((resolve, reject) => {
      axios.post(url + endpoint, data, {headers})
        .then(res => resolve(res.data))
        .catch(err => this._onCaughtError(err));
    });
  }

  _put(endpoint, data = {}, isAPI = false) {
    const headers = this._requestHeaders;
    const url = isAPI ? this.api : this.url;

    return new Promise((resolve, reject) => {
      axios.put(url + endpoint, data, {headers})
        .then(res => resolve(res.data))
        .catch(err => this._onCaughtError(err));
    });
  }

  _delete(endpoint, data = {}, isAPI = false) {
    const headers = this._requestHeaders;
    const url = isAPI ? this.api : this.url;

    return new Promise((resolve, reject) => {
      axios.delete(url + endpoint, {headers, data})
        .then(res => resolve(res.data))
        .catch(err => this._onCaughtError(err));
    });
  }

  // Authentication
  // -------------------------------------------
  authenticate(email = requiredParam('email'), password = requiredParam('password')) {
    return new Promise((resolve, reject) => {
      this._post('auth/request-token', {email, password})
        .then(res => {
          if (res.success) {
            this.accessToken = res.data.token;
            return resolve(res);
          }
          return reject(res);
        })
        .catch(err => reject(err));
    });
  }

  // Items
  // ----------------------------------------------------------------------------------
  createItem(table = requiredParam('table'), data = {}) {
    return this._post(`tables/${table}/rows`, data);
  }

  getItems(table = requiredParam('table'), params = {}) {
    return this._get(`tables/${table}/rows`, params);
  }

  getItem(table = requiredParam('table'), id = requiredParam('id'), params = {}) {
    return this._get(`tables/${table}/rows/${id}`, params);
  }

  updateItem(table = requiredParam('table'), id = requiredParam('id'), data = requiredParam('data')) {
    return this._put(`tables/${table}/rows/${id}`, data);
  }

  deleteItem(table = requiredParam('table'), id = requiredParam('id')) {
    return this._delete(`tables/${table}/rows/${id}`);
  }

  createBulk(table = requiredParam('table'), data = requiredParam('data')) {
    if (Array.isArray(data) === false) {
      throw new TypeError(`Parameter data should be an array of objects`);
    }

    return this._post(`tables/${table}/rows/bulk`, {
      rows: data
    });
  }

  updateBulk(table = requiredParam('table'), data = requiredParam('data')) {
    if (Array.isArray(data) === false) {
      throw new TypeError(`Parameter data should be an array of objects`);
    }

    return this._put(`tables/${table}/rows/bulk`, {
      rows: data
    });
  }

  deleteBulk(table = requiredParam('table'), data = requiredParam('data')) {
    if (Array.isArray(data) === false) {
      throw new TypeError(`Parameter data should be an array of objects`);
    }

    return this._delete(`tables/${table}/rows/bulk`, {
      rows: data
    });
  }

  // Files
  // ----------------------------------------------------------------------------------
  createFile(data = {}) {
    return this._post('files', data);
  }

  getFiles(params = {}) {
    return this._get('files', params);
  }

  getFile(id = requiredParam('id')) {
    return this._get(`files/${id}`);
  }

  updateFile(id = requiredParam('id'), data = requiredParam('data')) {
    return this._put(`files/${id}`, data);
  }

  deleteFile(id = requiredParam('id')) {
    return this._delete(`files/${id}`);
  }

  // Tables
  // ----------------------------------------------------------------------------------
  createTable(name = requiredParam('name')) {
    return this._post('tables', {name});
  }

  getTables(params = {}) {
    return this._get('tables', params);
  }

  getTable(table = requiredParam('table'), params = {}) {
    return this._get(`tables/${table}`, params);
  }

  // Columns
  // ----------------------------------------------------------------------------------
  createColumn(table = requiredParam('table'), data = {}) {
    return this._post(`tables/${table}/columns`, data);
  }

  getColumns(table = requiredParam('table'), params = {}) {
    return this._get(`tables/${table}/columns`, params);
  }

  getColumn(table = requiredParam('table'), column = requiredParam('column')) {
    return this._get(`tables/${table}/columns/${column}`);
  }

  updateColumn(table = requiredParam('table'), column = requiredParam('column'), data = {}) {
    return this._put(`tables/${table}/columns/${column}`, data);
  }

  deleteColumn(table = requiredParam('table'), column = requiredParam('column')) {
    return this._delete(`tables/${table}/columns/${column}`);
  }

  // Groups
  // ----------------------------------------------------------------------------------
  createGroup(name = requiredParam('name')) {
    return this._post('groups', {name});
  }

  getGroups() {
    return this._get('groups');
  }

  getGroup(id = requiredParam('id')) {
    return this._get(`groups/${id}`);
  }

  // Privileges
  // ----------------------------------------------------------------------------------
  createPrivileges(id = requiredParam('id'), data = {}) {
    return this._post(`privileges/${id}`, data);
  }

  getPrivileges(id = requiredParam('id')) {
    return this._get(`privileges/${id}`);
  }

  getTablePrivileges(id = requiredParam('id'), table = requiredParam('table')) {
    return this._get(`privileges/${id}/${table}`);
  }

  updatePrivileges(id = requiredParam('id'), table = requiredParam('table')) {
    return this._get(`privileges/${id}/${table}`);
  }

  // Preferences
  // ----------------------------------------------------------------------------------
  getPreferences(table = requiredParam('table')) {
    return this._get(`tables/${table}/preferences`);
  }

  updatePreference(table = requiredParam('table'), data = {}) {
    return this._update(`tables/${table}/preferences`, data);
  }

  // Messages
  // ----------------------------------------------------------------------------------
  getMessages(params = {}) {
    return this._get('messages/rows', params);
  }

  getMessage(id = requiredParam('id')) {
    return this._get(`messages/rows/${id}`);
  }

  // Activity
  // ----------------------------------------------------------------------------------
  getActivity(params = {}) {
    return this._get('activity', params);
  }

  // Bookmarks
  // ----------------------------------------------------------------------------------
  getBookmarks() {
    return this._get('bookmarks');
  }

  getUserBookmarks() {
    return this._get('bookmarks/self');
  }

  getBookmark(id = requiredParam('id')) {
    return this._get(`bookmarks/${id}`);
  }

  createBookmark(data = requiredParam('data')) {
    return this._post('bookmarks', data);
  }

  deleteBookmark(id = requiredParam('id')) {
    return this._delete(`bookmarks/${id}`);
  }

  // Settings
  // ----------------------------------------------------------------------------------
  getSettings() {
    return this._get('settings');
  }

  getSettingsByCollection(name = requiredParam('name')) {
    return this._get(`settings/${name}`);
  }

  updateSettings(name = requiredParam('name'), data = {}) {
    return this._put(`settings/${name}`, data);
  }

  // Users
  // ----------------------------------------------------------------------------------
  getUsers(params = {}) {
    return this._get('users', params);
  }

  getUser(id = requiredParam('id')) {
    return this._get(`users/${id}`);
  }

  getMe() {
    return this._get(`users/me`);
  }

  createUser(user = requiredParam('user')) {
    return this._post('users', user);
  }

  updateUser(id = requiredParam('id'), data = requiredParam('data')) {
    return this._put(`users/${id}`, data);
  }

  updateMe(data = requiredParam('data')) {
    return this._put('users/me', data);
  }

  // WARNING: Updating user password doesn't check strength or length
  updatePassword(password = requiredParam('password')) {
    return this._put('users/me', {password: password});
  }

  // API Endpoints
  // ----------------------------------------------------------------------------------

  getApi(api_endpoint = requiredParam('api_endpoint'), params = {}) {
    return this._get(api_endpoint, params, true);
  }

  postApi(api_endpoint = requiredParam('api_endpoint'), data = requiredParam('data')) {
    return this._post(api_endpoint, data, true);
  }

  putApi(api_endpoint = requiredParam('api_endpoint'), data = requiredParam('data')) {
    return this._put(api_endpoint, data, true);
  }

  deleteApi(api_endpoint = requiredParam('api_endpoint'), data = requiredParam('data')) {
    return this._delete(api_endpoint, data, true);
  }

  // Hash
  // ----------------------------------------------------------------------------------
  getHash(string = requiredParam('string'), data = {}) {
    return this._post('hash', data);
  }

  // Random
  // ----------------------------------------------------------------------------------
  getRandom(params = {}) {
    return this._post('random', params);
  }
}

function requiredParam(name) {
  throw new Error(`Missing parameter [${name}]`);
}

module.exports = RemoteInstance;
