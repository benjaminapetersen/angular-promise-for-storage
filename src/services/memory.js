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
