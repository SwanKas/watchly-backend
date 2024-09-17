
import axios from 'axios';
import Genres from '../models/Genres.js';
import * as utils from '../utils/importDataUtils.js'; 


const fetchAndSaveGenres = async (req, res) =>{
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

export default fetchAndSaveGenres;
