import mongoose from 'mongoose';

const SerieSchema = new mongoose.Schema({
    tmdb_id: Number,
    title: String,
    release_date: Date,
    vote_average: Number,
    vote_count: Number,
    overview: String,
    backdrop_path: String,
    poster_path: String,
    genre: [Number],
    popularity: Number,
    url_trailer: String,
    providers_id: [{
        type: Map,
        of: new mongoose.Schema({
          types: {
            flatrate: [Number],
            rent: [Number],
            buy: [Number]
          }
        }, { _id: false })
      }]

});

const Serie = mongoose.model('Serie', SerieSchema);

export default Serie;