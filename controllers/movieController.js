import mongoose from 'mongoose';
import axios from 'axios';
import Movie from '../models/Movie.js';
import Providers from '../models/Providers.js';

// Fonction pour vider les collections
const clearTables = async (models) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      throw new Error('MongoDB is not connected');
    }

    for (const model of models) {
      await model.deleteMany({});
      console.log(`Collection ${model.modelName} cleared`);
    }
  } catch (error) {
    console.error('Error clearing collections:', error);
  }
};

// Fonction pour obtenir l'URL du trailer d'un film
const getMovieTrailer = async (movieId, moovieName) => {
  const url = `https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=${process.env.TMDB_API_KEY}`;
  try {
    const response = await axios.get(url);
    const videos = response.data.results;
    if (videos && videos.length > 0) {
      const trailer = videos.find(video => video.type === "Trailer" && video.site === "YouTube");
      if (trailer) {
        const trailerUrl = `https://www.youtube.com/watch?v=${trailer.key}`;
        console.log('Trailer found for: ' + moovieName);
        return trailerUrl;
      } else {
        console.log('Trailer NOT found for: ' + moovieName);
        return null;
      }
    }
  } catch (error) {
    console.error('Error fetching movie trailer:', error);
  }
};

// Fonction pour récupérer et sauvegarder les providers
const fetchProvidersAndSave = async (movieId) => {
  try {
    const url = `https://api.themoviedb.org/3/movie/${movieId}/watch/providers?api_key=${process.env.TMDB_API_KEY}`;
    const response = await axios.get(url);
    const providersData = response.data.results;
    const regions = ['FR', 'US', 'GB']; // Exemples de pays

    const providersByCountry = [];

    // Parcourir les régions pour récupérer les informations de provider
    for (const region of regions) {
      if (providersData[region]) {
        const providerInfo = providersData[region];
        const providersByType = {
          flatrate: [],
          rent: [],
          buy: []
        };

        // Collecter les informations par type : flatrate, rent, buy
        ['flatrate', 'rent', 'buy'].forEach(type => {
          if (providerInfo[type]) {
            providerInfo[type].forEach(async (provider) => { // Marquer comme `async` pour pouvoir utiliser `await` à l'intérieur
              providersByType[type].push(provider.provider_id);

              // Vérifier si le provider existe déjà dans la collection Providers
              const existingProvider = await Providers.findOne({ id_providers: provider.provider_id, country_code: region });
              if (!existingProvider) {
                // Sauvegarder le nouveau provider dans la collection Providers
                const newProvider = new Providers({
                  id_providers: provider.provider_id,
                  name: provider.provider_name,
                  url_providers_img: `https://image.tmdb.org/t/p/original${provider.logo_path}`, // Lien vers l'image du provider
                  country_code: region,
                  type: type,
                });
                await newProvider.save(); // Sauvegarder en base
              }
            });
          }
        });

        // Ajouter les providers par pays dans la structure finale
        providersByCountry.push({
          [region]: {
            types: providersByType
          }
        });
      }
    }

    return providersByCountry; // Retourner le tableau structuré avec pays en clé et types en valeur
  } catch (error) {
    console.error('Error fetching providers:', error);
    return [];
  }
};

// Fonction pour récupérer les films et les séries, et les sauvegarder dans MongoDB
const fetchMoviesAndSeries = async (req, res) => {
  try {
    const movies = [];

    // Récupérer les 100 premiers films
    for (let page = 1; page <= 2; page++) {
      const response = await axios.get(`https://api.themoviedb.org/3/discover/movie?api_key=${process.env.TMDB_API_KEY}&language=fr-FR&page=${page}`);
      movies.push(...response.data.results);
    }

    await clearTables([Movie, Providers]);

    // Récupérer les films et ajouter le trailer et les providers
    for (const film of movies) {
      const url_trailer = await getMovieTrailer(film.id, film.title);
      const providers_id = await fetchProvidersAndSave(film.id);

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
        genre: film.genres,
        budget: film.budget,
        popularity: film.popularity,
        url_trailer: url_trailer,
        providers_id: providers_id // Enregistrer l'objet des providers par type
      });

      await newMovie.save(); // Sauvegarder le film dans MongoDB
    }

    res.status(200).json({ message: "Movies saved successfully!" });

  } catch (error) {
    console.error('Error fetching movies and series:', error);
    res.status(500).json({ error: 'An error occurred.' });
  }
};

export default fetchMoviesAndSeries;
