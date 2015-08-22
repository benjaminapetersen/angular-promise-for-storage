'use strict';
// usage, for basic model interactions that do not need unique logic
// $q
//   .when(
//     crud
//       .store('local')
//       .key('foo:bar'))
//   .then(function(foo) {
//     foo
//       .all();
//   });
//
//   at this point there is a returned object interface with the
//   basic .all() .get(id) .update(item) .remove() .clear() methods,
//   which are all promise oriented
//   .all()
//   .then(successFn, failFn)
angular.module('promise-for-storage')
  .factory('crud', [
    'localStore',
    'sessionStore',
    //'cookieStore',
    //'memoryStore',
    function(localStore, sessionStore) {
      var hash = {
            local: localStore,
            session: sessionStore
            // memory: memoryStore,
            // cookie: cookieStore
          }

      var Crud = function() {
        this.store = undefined;
        this.key = undefined;
        return this;
      }
      Crud.prototype.setStore = function(store) {
        this.store = store;
        return this;
      }
      Crud.prototype.setKey = function(key) {
        var self = this;
        this.key = key;
        if(!this.store) {
          throw new Error('select store with Crud().store(store_name)');
        }
        return {
          all: function(items) {
            return items ?
               hash[self.store].all(self.key, items) :
               hash[self.store].all(self.key);
          },
          create: function(item) {
            return hash[self.store].create(self.key, item);
          },
          update: function(item) {
            return hash[self.store].update(self.key, item);
          },
          get: function(id) {
            return hash[self.store].get(self.key, id);
          },
          remove: function(id) {
            return hash[self.store].remove(self.key, id);
          },
          clear: function(id) {
            return hash[self.store].clear(id);
          }
        };
      };
      return new Crud();
    }
  ]);
