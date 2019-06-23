// Update with your config settings.
// listing des db

module.exports = {

  development: {
    client: 'pg',
    connection: 'postgres://localhost/cjs-web-store'
  },
  test: {
    client: 'pg',
    connection: 'postgres://localhost/test-cjs-web-store'
  }
};
