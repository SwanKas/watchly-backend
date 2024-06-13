import mongoose from 'mongoose';

const listSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  // Ajoutez ici d'autres champs selon vos besoins
});

const List = mongoose.model('List', listSchema);

export default List;