const { createProxyMiddleware } = require('http-proxy-middleware')

/*
 * This is only used during frontend development so that API requests are properly forwarded.
 */

module.exports = function (app) {
  ['/api', '/websocket'].forEach(prefix => {
    app.use(
      prefix,
      createProxyMiddleware({
        // forward to the backend in Docker which is running at :8080
        target: 'http://localhost:8080',
        changeOrigin: true
      })
    )
  })
}
