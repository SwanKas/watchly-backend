import mongoose from 'mongoose';

const SerieSchema = new mongoose.Schema({
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

const Serie = mongoose.model('SerieTESTSWAN', SerieSchema);

export default Serie;