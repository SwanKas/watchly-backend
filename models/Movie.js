<<<<<<< HEAD

import mongoose from 'mongoose';
/*
//------------ Film Schema OMDB ------------//
const MovieSchema = new mongoose.Schema({
    title: String,
    year: String,
    Rated : String,
    Released: String,
    Runtime: String,
    Genre: String,
    Director: String,
    Writer: String,
    Actors: String,
    Plot: String,
    Language: String,
    Country: String,
    Awards: String,
    Poster: String,
    Ratings: Array,
    Metascore: String,
    imdbRating: String,
    imdbVotes: String,
    imdbID: String,
    Type: String,
    DVD: String,
    BoxOffice: String,
    Production: String,
    Website: String,
    Response: String
});
*/

//------------ Film Schema TMDB ------------//
const MovieSchema = new mongoose.Schema({
    title: String,
    release_date: String,
    vote_average: String,
    vote_count: String,
    overview: String,
    runtime: String,
    tagline: String,
    backdrop_path: String,
    poster_path: String,
    genre: Array,
    budget: String,
    popularity: String,

});     

const Movie = mongoose.model('Movie', MovieSchema);

export default Movie;
=======

import mongoose from 'mongoose';
/*
//------------ Film Schema OMDB ------------//
const MovieSchema = new mongoose.Schema({
    title: String,
    year: String,
    Rated : String,
    Released: String,
    Runtime: String,
    Genre: String,
    Director: String,
    Writer: String,
    Actors: String,
    Plot: String,
    Language: String,
    Country: String,
    Awards: String,
    Poster: String,
    Ratings: Array,
    Metascore: String,
    imdbRating: String,
    imdbVotes: String,
    imdbID: String,
    Type: String,
    DVD: String,
    BoxOffice: String,
    Production: String,
    Website: String,
    Response: String
});
*/

//------------ Film Schema TMDB ------------//
const MovieSchema = new mongoose.Schema({
    title: String,
    release_date: String,
    vote_average: String,
    vote_count: String,
    overview: String,
    runtime: String,
    tagline: String,
    backdrop_path: String,
    poster_path: String,
    genre: Array,
    budget: String,
    popularity: String,

});     

const Movie = mongoose.model('Movie', MovieSchema);

export default Movie;
>>>>>>> origin/feature/auth
