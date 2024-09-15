import mongoose from 'mongoose';

const movieSchema = new mongoose.Schema({
  id: Number,
  title: String,
  poster: String,
  year: String,
  rating: Number,
  description: String,
  type: String
});

const listSchema = new mongoose.Schema({
  name: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  movies: [movieSchema], 
});

const List = mongoose.model('List', listSchema);

export default List;
