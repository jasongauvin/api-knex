

API REST WITH KNEX
(https://youtu.be/xFsaRVNLtxI)

Ne pas oublier "body-parser"

PREREQUIS :
 - node et gitignore

		brew install node
 
		 npm install gitignore -g
		 
 - postgres
 
		 brew install postgres
	 
		 brew services start postgres
		 
		 createdb
		 
 - Express generator
 
		npm install -g express-generator
		
 - knex install
 
		npm install -g knex


1 - Créer un dossier serveur :

	mkdir api-crud
	mkdir server
		express
		git init
		gitignore node

		
2 - Créer la db :

		createdb cjs-web-store


3 - Initialiser le project knex :

		npm install --save knex pg

		knex init
		
		knexfile.js --> //transformer en
	
			module.exports  =  {
				development:  {
					client:  'pg',
					connection:  'postgres://localhost/cjs-xeb-store'
					},
			};

4 - Créer les tables migrations :

![](https://github.com/edwinvautier/knex-postgres/blob/master/entity.png?raw=true
)

		knex migration:make create-sticker

migration (dossier migration) :
		  

	exports.up  =  function(knex, Promise)  {

		return knex.schema.createTable('sticker', (table)=>  {

			table.increment();

			table.text('title');

			table.text('description');

			table.float('rating');

			table.text('url');

		})

	};

	  

	exports.down  =  function(knex, Promise)  {

		return knex.schema.dropTable('sticker');
	};

Puis : 

		knex migrate:latest

Accéder à la db "cjs-web-store" postgres crée plus haut :

		pcql cjs-web-store
		
Puis pour afficher les tables : 

		\dt

Puis pour afficher la table "sticker" : 

		\d sticker
		
5 - Préparer fixtures/echantillons :

		knex seed:make 01_sticker

Puis les envoyer : 

		knex seed:run

Afficher le contenu de la db "sticker":
	
		select * from sticker;
		// \x pour affichage élargi
		
		// :x pour sortir

6 - Convertir app express en JSON API

Dans app.js supprimer :

		// view engine setup
		app.set('views', path.join(__dirname, 'views'));
		app.set('view engine', 'jade');
		// Puis supprimer le dossier "view".


Dans app.js supprimer :

		app.use(express.static(path.join(__dirname, 'public')));
		// Puis supprimer le dossier "routes"


Dans app.js supprimer :

		var indexRouter =  require('./routes/index');
		var usersRouter =  require('./routes/users');
		// et donc aussi
		app.use('/', indexRouter);
		app.use('/users', usersRouter);
		// Puis supprimer le dossier "public"

Dans app.js modifier :

		 // error handler
		app.use(function(err, req, res, next)  {
		// set locals, only providing error in development
			res.locals.message  = err.message;
			res.locals.error  = req.app.get('env')  ===  'development'  ? err :  {};
		
		// render the error page
		res.status(err.status  ||  500);
		res.render('error');
		});
En : 

		app.use(function(err, req, res, next)  {
			res.status(err.status  ||  500);
			res.json({
				message: err.message,
				error: req.app.get('env')  ===  'development'  ? err :  {}
			});
		});

Faire :

		npm uninstall jade
		npm i

Puis vérifier le fonctionnement du serveur :

		npm start
		// localhost:3000/# doit renvoyer
		// {"message":"Not Found","error":{"message":"Not Found"}}

7 - Créer le dossier API et le router

		mkdir api
		touch stickers.js

Dans stickers.js, déclarer le router et créer la première route :

		const express =  require('express');
		const router = express.Router();
		router.get('/', (req, res)  =>  {
			res.json({
				message:  ':D it\'s ok'
				})
			})

		  

		module.exports  = router;

Dans app.js, modifier tout les "var" en "const" puis déclarer le router "stickers.js" du dossier api : 

		const stickers =  require('./api/stickers');
		// puis rajouter la ligne suivant pour utiliser la route
		app.use('/api/v1/stickers', stickers);

Puis installer "nodemon" :

		npm install nodemon --save-dev

Modifier le fichier "packages.json" :

		"scripts": {
			"start":  "node ./bin/www",
			"dev":  "nodemon"
			},

Puis faire : 

		npm run dev

8 - Créer connexion db et le fichier de requète

Créer le dossier db et le ficher knex.js :

		mkdir db
		touch knex.js

Dans knex.js :

		const environment = process.env.NODE_ENV  ||'development';
		const config =  require('../knexfile');
		const knex =  require('knex');
		const environmentConfig = config[environment];
		const connection =  knex(environmentConfig);

		module.exports  = connection;

Puis creer le fichier queries.js dans le dossier db : 

		touch queries.js 

Dans queries.js :

		const knex =  require('./knex');  // la connection

		module.exports  =  {
			getAll()  {
				// 'sticker' car c'est le nom de la table a retourner de la db
				return  knex('sticker');
			}
		}

9 - Lister le contenu de la table "sticker"  avec GET (getAll() )

Dans le dossier api, sur le fichier stickers.js modifier comme ceci :

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

10 - Tests unitaire avec mocha, chai et supertest

Commencez par installer :

		npm install --save-dev mocha chai supertest

Puis modifier le fichier knexfile.js en ajoutant le lien vers la nouvelle db "text-cjs-web-store" :

		// Update with your config settings.
		// listing des db

		module.exports  =  {

			development:  {
				client:  'pg',
				connection:  'postgres://localhost/cjs-web-store'
			},
			test:  {
				client:  'pg',
				connection:  'postgres://localhost/test-cjs-web-store'
			}
		};

Créer le dossier test et le fichier app.test.js :

		mkdir test
		touch test/app.test.js

Dans app.test.js écrire : 

		const knex = require('../db/knex');
		
		describe('CRUD stickers', ()  =>  {
		});

Dans pachage.json modifier "scripts" comme ceci : 
On va supprimer la db puis en créer une nouvelle !

		"scripts": {
			"start":  "node ./bin/www",
			"dev":  "nodemon",
			"test":  "(dropdb --if-exist test-cjs-web-store && createdb test-cjs-web-store) && NODE_ENV=test mocha"
		},
		...

Ensuite on va tester les migrations et les seeds dans notre app.test.js comme ceci :

		const knex =  require('../db/knex');

		describe('CRUD stickers', ()  =>  {
			before(()  =>  {
				// run migrations
				knex.migrate.latest()
					.then(()  =>  {
					// run seeds
					return knex.seed.run();
					});
			});
		});

Pour lancer les tests :

		npm test

11 - Vérifier que les tests fonctionnent :

Modifier le fichier app.test.js comme ceci :

		...
		before((done)  =>  {
			// run migrations
			knex.migrate.latest()
				.then(()  =>  {
				// run seeds
				return knex.seed.run();
			}).then(()  =>  done()  );
		});

		it('works...', function()  {
			console.log('It\'s working!');
		})
		...


Maintenant, nous allons tester la route /api/v1/stickers avec supertest. 
Modifier app.test.js comme ceci :

		const request =  require('supertest');
		const knex =  require('../db/knex');

		const app =  require('../app');
		const fixtures =  require('./fixtures');

		describe('CRUD stickers', ()  =>  {
			before((done)  =>  {
				// run migrations
				knex.migrate.latest()
					.then(()  =>  {
					// run seeds
					return knex.seed.run();
			}).then(()  =>  done()  );
		});

		it('List All Records', (done)  =>  {
			request(app)
				.get('/api/v1/stickers')
				.set('Accept', 'application/json')
				.expect('Content-type', /json/)
				.then((response)  =>  {
					expect(response.body).to.be.a('array');
					expect(response.body).to.deep.equal(fixtures.stickers);
					done();
				});
			console.log('It\'s okay ! Next step')
			})
		});

Voilà ! Faites :

		npm test

12 - Lister un seul contenu de la table "sticker"  avec GET sur /api/v1/stickers/:id

Sur le fichier api/stickers.js, on crée une fonction qui vérifie si notre id est valide ou non :

		function  isValidId(req, res,next){
			if(!isNaN(req.params.id)){
				return  next();
			}  else  {
				next(new  Error('invalid ID'))
			}
		}
On crée une route :id avec une id valide :

		router.get('/:id', isValidId, (req, res)  =>  {
			res.json({
				message: "helloooooo!"
			})
		})

On met la route:id sur la db :

Dans api/stickers.js on modifie : 

		...
		router.get('/:id', isValidId, (req, res, next)  =>  {
			queries.getOne(req.params.id).then(sticker =>  {
				if(sticker) {
					res.json(sticker)
				} else {
					// ici next() fait la gestion des erreur, voir app.js.
					next();
				}
			})
		})
		...

Et dans queries.js on rajoute la requète getOne() qui va chercher le contenu spécifique à l'id:

		...
		getOne(id)  {
			return  knex('sticker').where('id', id).first();
		}
		...

Maintenant on va rajouter des test unitaires sur l'id 1 et 5. Modifier le fichier app.test.js en rajoutant les tests :

		...
		it('Show one records by id', (done)  =>  {
			request(app)
				// on spécifie la route à tester
				.get('/api/v1/stickers/1')
				.set('Accept', 'application/json')
				.expect('Content-type', /json/)
				.expect(200)
				.then((response)  =>  {	
					// ici un object car on va chercher un seul record (sticker) dans l'array (stickers)
					expect(response.body).to.be.a('object');
					// on indique quel numéro dans le tableau (qui part de 0 bien entendu !)
					expect(response.body).to.deep.equal(fixtures.stickers[0]);
					done();
				});
		})

		it('Show one records by id', (done)  =>  {
			request(app)
				.get('/api/v1/stickers/5')
				.set('Accept', 'application/json')
				.expect('Content-type', /json/)
				.expect(200)
				.then((response)  =>  {	
					expect(response.body).to.be.a('object');
					expect(response.body).to.deep.equal(fixtures.stickers[4]);
					done();
				});
		})
		...

13 - Créer un contenu avec POST sur /api/v1/stickers

Déjà on commence par créer la route POST dans api/stickers.js : 

		router.post('/', (req, res, next)  =>  {
		
		});

Après on créé la fonction qui validera notre contenu à inserer en db :

		function  validSticker(sticker)  {
			// on vérifie que le type est bien une string puis que le contenu n'est pas égal à null
			const hasTitle =  typeof sticker.title  ==  'string'  && sticker.title.trim()  !=  '';
			const hasURL =  typeof sticker.url  ==  'string'  && sticker.url.trim()  !=  '';
			const hasDescription =  typeof sticker.description  ==  'string'  && sticker.description.trim()  !=  '';
			const hasRating =  !isNaN(sticker.rating);
			
			return hasTitle && hasURL && hasDescription && hasRating;
		}

On rempli la route POST : 


		router.post('/', (req, res, next)  =>  {
			if(validSticker(req.body)){
				//insert into db
				// On passe en requète le corps de l'autocollant
				queries.create(req.body).then(stickers =>  {
					res.json(stickers[0]);
				})
			}  else  {
				next(new  Error('Invalid sticker'));
			}
		});

Ensuite on rajoute dans queries.js la requète correspondante : 

		create(sticker)  {
			return  knex('sticker').insert(sticker, '*');
		}

14 - Créer un test d'enregistrement

Dans app.test.js, a la suite écrire :


		it('Create a records', (done)  =>  {
			request(app)
				.post('/api/v1/stickers')
				.send(fixtures.sticker)
				.set('Accept', 'application/json')
				.expect('Content-type', /json/)
				.expect(200)
				.then((response)  =>  {	
					expect(response.body).to.be.a('object');
					fixtures.sticker.id  = response.body.id;
					expect(response.body).to.deep.equal(fixtures.sticker);
					done();
				});
		});

15 - Update un contenu avec PUT sur /api/v1/stickers/id

On commence par créer la route put et on vérifie que l'id est valide : 

		router.put('/:id', isValidId, (req, res, next)  =>  {
			// on utilise la function validSticjer pour vérifier le contenu
			if(validSticker(req.body)){
				// update the sticker
				queries.update(req.params.id, req.body).then(stickers =>  {
				res.json(stickers[0]);
				})
			}  else  {
				next(new  Error('Invalid sticker'));
			}
		});

Ensuite on rajoute dans queries.js la requète correspondante : 

		...
		update(id, sticker)  {
			return  knex('sticker').where('id', id).update(sticker, '*');
		},
		...

16 - Créer un test d'update

		...
		it('Update a records', (done)  =>  {
			fixtures.sticker.rating  =  5
			request(app)
				.put('/api/v1/stickers/10')
				.send(fixtures.sticker)
				.set('Accept', 'application/json')
				.expect('Content-type', /json/)
				.expect(200)
					.then((response)  =>  {
					expect(response.body).to.be.a('object');
					expect(response.body).to.deep.equal(fixtures.sticker);
					done();
				});
		});
		...

17 - Delete un content avec DELETE sur api/v1/stickers/id

On commence par créer la route et utiliser la function isValidId pour vérifier que l'id est bien valide (pour changer) : 

		router.delete('/:id', isValidId, (req, res)  =>  {
			// delete a record
			queries.delete(req.params.id).then(()  =>  {			
				res.json({
					deleted:  true
				});
			});			
		});

Ensuite on rajoute dans queries.js la requète correspondante : 

		delete(id)  {
			return  knex('sticker').where('id', id).del();
		}


Puis on crée le test correspondant : 

		it('Delete a records', (done)  =>  {
			request(app)
				.delete('/api/v1/stickers/10')
				.set('Accept', 'application/json')
				.expect('Content-type', /json/)
				.expect(200)
				.then((response)  =>  {
					expect(response.body).to.be.a('object');
					expect(response.body).to.deep.equal({
					deleted:  true
					});
					done();
				});
		});