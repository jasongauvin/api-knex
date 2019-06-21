// Ici la connexion sur la db

const environment = process.env.NODE_ENV || 'development';
const config = require('../knexfile');
const knex = require('knex');
const environmentConfig = config[environment];
const connection = knex(environmentConfig);

module.exports = connection;