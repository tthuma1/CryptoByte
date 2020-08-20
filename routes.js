const routes = (module.exports = require('next-routes')());

routes
  .add('/account/:address', '/account')
  .add('/gift/:id', '/gift')
  .add('/sell/:id', '/sell')
  .add('/token/:id', '/token')
  .add('/tokens/:owner', '/tokens/owner');
