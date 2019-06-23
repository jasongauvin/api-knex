const express =  require('express');
const router = express.Router();  

// on appelle queries
const queries =  require('../db/queries');

function isValidId(req, res, next) {
    if(!isNaN(req.params.id)) return next(); 
    next(new Error('Invalid ID'));
}

function validSticker(sticker) {
    const hasTitle = typeof sticker.title == 'string' && sticker.title.trim() != '';
    const hasURL = typeof sticker.url == 'string' && sticker.url.trim() != '';
    const hasDescription = typeof sticker.description == 'string' && sticker.description.trim() != '';
    const hasRating = !isNaN(sticker.rating);
    
    return hasTitle && hasURL && hasDescription && hasRating;
}
		
router.get('/', (req, res)  =>  {
// après le then() stickers c'est le nom du paramètre
    // getAll() récupère le résultat de la fonction getAll de queries.js et .then() lui dans le nom de stickers
    queries.getAll().then(stickers =>  {
    // et stickers le nom de la variable de la fonction then()
        res.json(stickers);
    })
});

router.get('/:id', isValidId, (req, res, next)  =>  {
    queries.getOne(req.params.id).then(sticker => {
        if(sticker) {
            res.json(sticker)
        } else {
            next();
        }
    })
});

router.post('/', (req, res, next) => {
    if(validSticker(req.body)){
        //insert into db
        // On passe en requète le corps de l'autocollant
        queries.create(req.body).then(stickers => {
            res.json(stickers[0]);
        })
    } else {
        next(new Error('Invalid sticker'));
    }
});

router.put('/:id', isValidId, (req, res, next) => {
    if(validSticker(req.body)){
        // update the sticker
        queries.update(req.params.id, req.body).then(stickers => {
            res.json(stickers[0]);
        })
    } else {
        next(new Error('Invalid sticker'));
    }
});

router.delete('/:id', isValidId, (req, res) => {
    // delete a record
    queries.delete(req.params.id).then(() => {
        res.json({
            deleted: true
        });
    });
});

module.exports  = router;