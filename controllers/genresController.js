
import axios from 'axios';
import Genres from '../models/Genres.js';
import * as utils from '../utils/importDataUtils.js'; 


export const fetchAndSaveGenres = async (req, res) =>{
    utils.clearTables([Genres]);
    const url = `https://api.themoviedb.org/3/genre/movie/list?api_key=${process.env.TMDB_API_KEY}`;
    try {
        const response = await axios.get(url);
        const genresData = response.data.genres;
        for (const genre of genresData) {
            const newGenre = new Genres({
            id_genres: genre.id,
            name: genre.name
        });
        await newGenre.save();
        }

        console.log('Genres imported successfully!');
        res.status(200).json({ message: "Genres saved successfully!" });
    } catch (error) {
        console.error('Error fetching and saving genres:', error);
    }
};
export const getGenres = async (req, res) => {
    try {
        const genres = await Genres.find({}, 'id_genres name'); // Récupère uniquement id_genres et name
        res.status(200).json(genres); // Renvoie le tableau des genres
    } catch (error) {
        console.error('Error retrieving genres:', error);
        res.status(500).json({ message: "Error retrieving genres" });
    }
};