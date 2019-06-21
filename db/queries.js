const knex = require('./knex'); // the connection

module.exports = {
    getAll() {
        // 'sticker' car c'est le nom de la table a retourner
        return knex('sticker');
    }
}

