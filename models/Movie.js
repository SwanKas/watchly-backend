import mongoose from 'mongoose';

// Schéma pour les films
const MovieSchema = new mongoose.Schema({
  tmdb_id: Number,
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
  providers_id: [Number] // Modification pour stocker les IDs des providers
});

const Movie = mongoose.model('Movie', MovieSchema);

export default Movie;