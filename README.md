# angular-promise-for-storage
Promise driven wrappers around browser based storage mechanisms

## Work in progress

This is a prototype.

## Demo

Check out the `/demo` directory for a simple working example of
the `localStore`, `sessionStore` and `crud` modules.  `localStore`
and `sessionStore` are used directly, then a custom `users` service
is created for a more formal model object, and finally `crud` is used
to simulate a formal model object similar to what is generated
with the `users` service.

Run the demo via `python -m SimpleHTTPServer` (or whatever server you like)
and navigate to the `./demo` directory.  Examine local and session storage
via browser tools.
