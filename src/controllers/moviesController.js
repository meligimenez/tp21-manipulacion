const db = require('../database/models');
const sequelize = db.sequelize;

const Movies = db.Movie;
const Genres = db.Genre;

const moviesController = {
    'list': (req, res) => {
        db.Movie.findAll()
            .then(movies => {
                res.render('moviesList.ejs', { movies })
            })
    },
    'detail': (req, res) => {
        db.Movie.findByPk(req.params.id)
            .then(movie => {
                res.render('moviesDetail.ejs', { movie, title: movie.title });
                console.log(movie.name)
            });
    },
    'new': (req, res) => {
        db.Movie.findAll({
            order: [
                ['release_date', 'DESC']
            ],
            limit: 5
        })
            .then(movies => {
                res.render('newestMovies', { movies });
            });
    },
    'recomended': (req, res) => {
        db.Movie.findAll({
            where: {
                rating: { [db.Sequelize.Op.gte]: 8 }
            },
            order: [
                ['rating', 'DESC']
            ]
        })
            .then(movies => {
                res.render('recommendedMovies.ejs', { movies });
            });
    }, //Aqui debemos modificar y completar lo necesario para trabajar con el CRUD
    add: function (req, res) {
        // TODO   

        Genres.findAll({
            order: ["name"]
        })
            .then(genres => res.render("moviesAdd", { genres }))
            .catch((error) => console.log(error))
    },
    create: function (req, res) {
        // TODO
        const { title, release_date, awards, length, rating, genre_id } = req.body
        db.Movie.create({
            title: title.trim(),
            rating,
            length,
            awards,
            release_date,
            genre_id
        })
            .then(movie => {
                console.log(movie);
                return res.redirect("/movies")
            })
            .catch((error) => console.log(error))
    },
    edit: function (req, res) {
        // TODO

        let Movie = Movies.findByPk(req.params.id)

        let allGenres = Genres.findAll({
            order: ['name']
        })

        Promise.all([Movie, allGenres])

            .then(([Movie, allGenres]) => {

                return res.render('moviesEdit', { Movie, allGenres })
            }).catch(error => console.log(error))

    },
    update: function (req, res) {
        // TODO
        const { title, rating, awards, length, genre_id, release_date } = req.body;

        Movies.update(
            {
                title: title.trim(),
                rating,
                awards,
                length,
                genre_id,
                release_date
            },
            {
                where: {
                    id: req.params.id
                }
            }
        ).then(() => res.redirect("/movies/detail/" + req.params.id))
            .catch(error => console.log(error))

    },
    delete: function (req, res) {
        // TODO
        Movies.findByPk(req.params.id)
            .then(movie => {
                return res.render("moviesDelete", { movie })
            })
    },
    destroy: function (req, res) {
        // TODO
        db.Movie.destroy({
            where: { id: req.params.id },
        });
        res.redirect("/movies");
    }
}

module.exports = moviesController;