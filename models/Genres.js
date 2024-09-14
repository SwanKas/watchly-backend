import mongoose from 'mongoose';

const GenresSchema = new mongoose.Schema({
    id_genres: {
        type: Number,
        required: true
    },
    name: {
        type: String,
        required: true
    }
}, {
    versionKey: false, // Désactiver le champ __v
    toJSON: {
        transform: (doc, ret) => {
            delete ret._id;
            delete ret.__v;
        }
    },
    toObject: {
        transform: (doc, ret) => {
            delete ret._id;
            delete ret.__v;
        }   
    }
});      

const Genres = mongoose.model('Genres', GenresSchema);

export default Genres;
