const knex = require('./knex'); // the connection

module.exports = {
    getAll() {
        // 'sticker' car c'est le nom de la table a retourner
        return knex('sticker');
    },

    getOne(id) {
        return knex('sticker').where('id', id).first();
    },

    create(sticker) {
        return knex('sticker').insert(sticker, '*');
    },

    update(id, sticker) {
        return knex('sticker').where('id', id).update(sticker, '*');
    },

    delete(id) {
        return knex('sticker').where('id', id).del();
    }
}

