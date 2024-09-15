import mongoose from 'mongoose';

const movieSchema = new mongoose.Schema({
  tmdb_id: Number,
  title: String,
  poster_path: String, // Poster du film
  release_date: Date,  // Date de sortie du film
  vote_average: Number, // Note IMDB
  overview: String, // Description ou synopsis du film
});

const listSchema = new mongoose.Schema({
  name: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  movies: [movieSchema], 
});

const List = mongoose.model('List', listSchema);

export default List;
