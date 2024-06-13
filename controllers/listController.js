import List from '../models/List.js';

// Créer une nouvelle liste
const createList = async (req, res) => {
  const newList = new List(req.body);
  try {
    const savedList = await newList.save();
    res.status(201).json(savedList);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Obtenir une élement de la liste 
const getList = async (req, res) => {
  try {
    const list = await List.findById(req.params.id);
    res.json(list);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

//Affiche toutes la liste

export const getAllLists = async (req, res) => {
    try {
        const lists = await List.find();
        res.status(200).json(lists);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la récupération des listes", error: error });
    }
};

// Mettre à jour un élément de la liste
const updateList = async (req, res) => {
  try {
    const updatedList = await List.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedList);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Supprimer un élémenent de la  liste 

const deleteList = async (req, res) => {
  try {
    const result = await List.findByIdAndDelete(req.params.id);
    if (!result) {
      return res.status(404).json({ message: 'No list found with this ID' });
    }
    res.json({ message: 'List deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export { createList, getList, updateList, deleteList };