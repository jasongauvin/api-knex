const express =  require('express');
const router = express.Router();  

// on appelle queries
const queries =  require('../db/queries');
		
router.get('/', (req, res)  =>  {
// après le then() stickers c'est le nom du paramètre
    // getAll() récupère le résultat de la fonction getAll de queries.js et .then() lui dans le nom de stickers
    queries.getAll().then(stickers =>  {
    // et stickers le nom de la variable de la fonction then()
        res.json(stickers);
    })
})

module.exports  = router;