'use strict';

angular.module('promise-for-storage', [])
  .config([
    function() {
      // nothing to do here.
    }
  ]);

'use strict';

// if(_.isObject(value)) {
//   value = JSON.stringify(value);
// }
// return $.when(storage.setItem(key, value));

angular.module('promise-for-storage')
  .factory('localStore', [
    '$log',
    '$q',
    function($log, $q) {
      var storage = window.localStorage;

      // another promise API, to get and retrieve the lists from localStorage
      // currently, all lists are stored as one item. Therefore each
      // method needs to deal with them as a set when going in and out of
      // localStorage
      var api = {
        // get, or
        // set if items provided
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

// same interface, but provide storage via cookies
// obviously cookies are less pleasant, but it may be
// useful.  in any case, might as well do it for the exercise!

// same as local and session as far as the API,
// but just hangs everything as a key on an object in memory,
// nothing is actually stored in any form of persistance.
// useful to keep track of things via the same API
// but not care about them long term.
//
//
// TODO:
// - obvously, make this. w/same API
// - BUT, ideally since all of these have the same API, there should
//   be a wrapper object that really gets returned, but around a generally
//   shared API.  so a mixin, wrapper, whatever.

// need something to sort of simulate SQL queries
// db
//  .select()
//  .where()
//  .count()
//  .exists()
//  .get() <- over select? or no?  sugar?
//
// is it just for queries, or should it:
// .create()
// .read()
// .update()
// .delete()/.remove()
//
// need to look at a few other impls of this kind of thing.
// much of it is probably just specific usage of _ types of methods.

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
