'use strict';

angular.module('myApp', [
  'promise-for-storage'
])
// a simple custom service using the localStorage module
.factory('users', [
  '$log',
  '$q',
  'localStore',
  function($log, $q, storage) {
    var key = 'promise-for-storage:users';

    // TODO:
    // this needs to be updated to be a real API,
    // not a hard coded array in the service.
    return {
      // get all
      all: function(items) {
        return items ?
               storage.all(key, items) :
               storage.all(key);
      },
      create: function(item) {
        return storage.create(key, item);
      },
      update: function(item) {
        return storage.update(key, item);
      },
      get: function(id) {
        return storage.get(key, id);
      },
      remove: function(id) {
        return storage.remove(key, id);
      },
      clear: function() {
        return storage.clear(id);
      }
    };
  }
])
// exercising the above service by requesting all users from storage,
// then saving another
.run([
  'users',
  function(users) {
    users
      .all()
      .then(function(userItems) {
        users
          .create({
            name: {
              first: 'John',
              last: 'Doe'
            },
            id: Date.now()
          });

      });
  }
])
// exercising local storage
.run([
  'localStore',
  function(storage) {
    var key = 'promise-for-storage:local';

    storage
      .all(key)
      .then(function(stuff) {
        storage
          .create(key, {
            text: 'stuff and things...' + Date.now()
          })
      });

  }
])
// exercising session storage
.run([
  'sessionStore',
  function(storage) {
    var key = 'promise-for-storage:session';

    storage
      .all(key)
      .then(function(stuff) {
        storage
          .create(key, {
            text: 'stuff and things...' + Date.now()
          })
      });

  }
])

