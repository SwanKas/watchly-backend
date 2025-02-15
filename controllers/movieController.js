import axios from 'axios';
import Movie from '../models/Movie.js';
import Providers from '../models/Providers.js';
import * as utils from '../utils/importDataUtils.js'; 

const fetchMovies = async (req, res) => {
  try {
    const movies = [];
    const type = "movie";
    console.log('Fetching movies from TMDB...');
    console.log('-------------------------------');
    for (let page = 1; page <= 20; page++) {
      const response = await axios.get(`https://api.themoviedb.org/3/discover/movie?api_key=${process.env.TMDB_API_KEY}&language=fr-FR&page=${page}`);
      movies.push(...response.data.results);
    }

    console.log(`Fetched ${movies.length} movies.`);
    console.log('-------------------------------');

    await utils.clearTables([Movie, Providers]);
    console.log('Database cleared.');
    console.log('-------------------------------');


    for (const film of movies) {
      console.log(`Processing: ${film.title}`);
      console.log('-------------------------------');

      const url_trailer = await utils.getProductTrailer(film.id, film.title, type);
      if (url_trailer) {
        console.log(`Trailer found for: "${film.title}"`);
      } else {
        console.log(`No trailer found for: "${film.title}"`);
      }


      const providers_id = await utils.fetchProvidersAndSave(film.id, type);
      const newMovie = new Movie({
        tmdb_id: film.id,
        title: film.title,
        release_date: film.release_date,
        vote_average: film.vote_average,
        vote_count: film.vote_count,
        overview: film.overview,
        runtime: film.runtime,
        tagline: film.tagline,
        backdrop_path: film.backdrop_path,
        poster_path: film.poster_path,
        genre: film.genre_ids, 
        popularity: film.popularity,
        url_trailer: url_trailer,
        providers_id: providers_id 
      });

      await newMovie.save();
      console.log(`✅ ${film.title} has been imported into the database.`);
      console.log('-------------------------------');
      console.log();
    }

    res.status(200).json({ message: "Movies saved successfully!" });

  } catch (error) {
    console.error('❌ Error fetching movies:', error);
    res.status(500).json({ error: 'An error occurred.' });
  }
};

// Fonction pour récupérer les films depuis la base de données
export const getMoviesFromDB = async (req, res) => {
  try {
    const movies = await Movie.find(); 
    res.status(200).json(movies); 
  } catch (error) {
    console.error("Erreur lors de la récupération des films :", error);
    res.status(500).json({ message: "Erreur lors de la récupération des films." });
  }
};

// Fonction pour récupérer un film par son tmdb_id
export const getMovieByTmdbId = async (req, res) => {
  try {
    const { id } = req.params; 

    const movie = await Movie.findOne({ tmdb_id: id });

    if (!movie) {
      return res.status(404).json({ message: "Movie not found" });
    }

    res.status(200).json(movie);
  } catch (error) {
    console.error("Error fetching movie:", error);
    res.status(500).json({ message: "Error fetching movie" });
  }
};



export default fetchMovies;
