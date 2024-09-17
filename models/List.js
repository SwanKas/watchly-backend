import mongoose from 'mongoose';

const movieSchema = new mongoose.Schema({
  tmdb_id: { type: Number, required: true },
  title: String,
  release_date: Date,
  vote_average: Number,
  poster_path: String
});

const serieSchema = new mongoose.Schema({
  tmdb_id: { type: Number, required: true },
  title: String,
  release_date: Date,
  vote_average: Number,
  poster_path: String
});

const listSchema = new mongoose.Schema({
  name: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  movies: [movieSchema],
  series: [serieSchema]
});

const List = mongoose.model('List', listSchema);

export default List;