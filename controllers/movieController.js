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

      const providersData = await utils.fetchProvidersAndSave(film.id, type);
      const providers_id = Object.values(providersData.US.types).flat(); // Transformation ici

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

export const getMovieByTmdbId = async (req, res) => {
  try {
    const { id } = req.params;

    const movie = await Movie.aggregate([
      { $match: { tmdb_id: parseInt(id) } },
      {
        $lookup: {
          from: 'providers', // Nom de la collection
          localField: 'providers_id', // IDs des providers dans Movie
          foreignField: 'id_providers', // IDs des providers dans Providers
          as: 'platforms' // Alias pour les résultats
        }
      },
      {
        $project: {
          tmdb_id: 1,
          title: 1,
          release_date: 1,
          vote_average: 1,
          vote_count: 1,
          overview: 1,
          runtime: 1,
          tagline: 1,
          backdrop_path: 1,
          poster_path: 1,
          genre: 1,
          popularity: 1,
          url_trailer: 1,
          'platforms.name': 1, // Inclure le nom de la plateforme
          'platforms.url_providers_img': 1 // Inclure le logo de la plateforme
        }
      }
    ]);

    if (!movie || movie.length === 0) {
      return res.status(404).json({ message: "Movie not found" });
    }

    res.status(200).json(movie[0]); // Retourne les résultats
  } catch (error) {
    console.error("Error fetching movie:", error);
    res.status(500).json({ message: "Error fetching movie" });
  }
};

 export default fetchMovies;  