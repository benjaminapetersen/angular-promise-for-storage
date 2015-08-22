'use strict';

// TODO:
// - refactor local Store and session store
// - this is a copy/paste of localStore at the moment.
angular.module('promise-for-storage')
  .factory('sessionStore', [
    '$log',
    '$q',
    function($log, $q) {
      var storage = window.sessionStorage;

      // another promise API, to get and retrieve the lists from localStorage
      // currently, all lists are stored as one item. Therefore each
      // method needs to deal with them as a set when going in and out of
      // localStorage
      var api = {
        all: function(key, items) {
          return items ?
                  $q.when(storage.setItem(key, JSON.stringify(items))) :
                  $q.when(JSON.parse(storage.getItem(key) || '[]'));
        },
        create: function(key, item) {
          return api
                  .all(key)
                  .then(function(items) {
                    items.push(item);
                    return storage.setItem(key, JSON.stringify(items));
                  });
        },
        get: function(key, id) {
          id = Number(id);
          return api
                  .all(key)
                  .then(function(items) {
                    return (
                            items && items.length ?
                              _.find(items, function(item) {
                                  return item.id === id;
                              }) :
                              undefined);
                  });
        },
        update: function(key, item) {
          return api
                  .remove(key, item.id)
                  .then(function(items) {
                    items.push(item);
                    storage.setItem(key, JSON.stringify(items));
                  });
        },
        remove: function(key, id) {
          id = Number(id);
          return api
                  .all(key)
                  .then(function(items) {
                    var filtered = _.reject(items, function(item) {
                                    return item.id === id;
                                  });
                    storage.setItem(key, JSON.stringify(filtered));
                    return filtered;
                  });
        },
        // deletes everything!
        clear: function(key) {
          return $q.when(storage.removeItem(key));
        }
      }

      return api;
    }
  ]);
