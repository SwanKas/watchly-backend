import mongoose from 'mongoose';

const movieSchema = new mongoose.Schema({
  tmdb_id: Number,
  title: String,
  poster_path: String, 
  release_date: Date,  
  vote_average: Number, 
  overview: String, 
});

const listSchema = new mongoose.Schema({
  name: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  movies: [movieSchema], 
});

const List = mongoose.model('List', listSchema);

export default List;
