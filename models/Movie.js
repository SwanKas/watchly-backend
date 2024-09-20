
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
    tmdb_id: {
      type: Number, // Numérique pour correspondre à l'ID TMDB
      required: true,
      unique: true,
    },
    title: String,
    release_date: Date,
    vote_average: Number,
    vote_count: Number,
    overview: String,
    runtime: Number,
    tagline: String,
    backdrop_path: String,
    poster_path: String,
    genre: [Number],
    popularity: Number,
    url_trailer: String,
    providers_id: [{
      type: Map,
      of: new mongoose.Schema({
        types: {
          flatrate: [String],
          rent: [String],
          buy: [String]
        }
      }, { _id: false })
    }]
  });

const Movie = mongoose.model('MovieTESTSWAN', MovieSchema);

export default Movie;
