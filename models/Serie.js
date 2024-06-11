<<<<<<< HEAD
import mongoose from 'mongoose';

const SerieSchema = new mongoose.Schema({
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

const Serie = mongoose.model('Serie', SerieSchema);

=======
import mongoose from 'mongoose';

const SerieSchema = new mongoose.Schema({
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

const Serie = mongoose.model('Serie', SerieSchema);

>>>>>>> origin/feature/auth
export default Serie;