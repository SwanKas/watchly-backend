// utils/filmUtils.js
import axios from 'axios';
import Providers from '../models/Providers.js';
import Movie from '../models/Movie.js';
import mongoose from 'mongoose';

// Fonction pour obtenir les fournisseurs et les sauvegarder
export const clearTables = async (models) => {
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
export const fetchProvidersAndSave = async (tmdb_id) => {
  try {
    const url = `https://api.themoviedb.org/3/movie/${tmdb_id}/watch/providers?api_key=${process.env.TMDB_API_KEY}`;
    const response = await axios.get(url);
    const providersData = response.data.results;

    const providersForMovie = {
      US: {
        types: {
          flatrate: providersData.US?.flatrate?.map((provider) => provider.provider_name) || [],
          rent: providersData.US?.rent?.map((provider) => provider.provider_name) || [],
          buy: providersData.US?.buy?.map((provider) => provider.provider_name) || []
        }
      },
      UK: {
        types: {
          flatrate: providersData.GB?.flatrate?.map((provider) => provider.provider_name) || [],
          rent: providersData.GB?.rent?.map((provider) => provider.provider_name) || [],
          buy: providersData.GB?.buy?.map((provider) => provider.provider_name) || []
        }
      },
      FR: {
        types: {
          flatrate: providersData.FR?.flatrate?.map((provider) => provider.provider_name) || [],
          rent: providersData.FR?.rent?.map((provider) => provider.provider_name) || [],
          buy: providersData.FR?.buy?.map((provider) => provider.provider_name) || []
        }
      }
    };

    // Met à jour le film en utilisant `tmdb_id` comme champ de recherche
    await Movie.findOneAndUpdate({ tmdb_id }, { providers_id: providersForMovie }, { new: true });
  } catch (error) {
    console.error("Erreur lors de la récupération des providers:", error);
  }
};

export const getProductTrailer = async (productId, productName, type) => {
    const url = `https://api.themoviedb.org/3/${type}/${productId}/videos?api_key=${process.env.TMDB_API_KEY}`;
    try {
      const response = await axios.get(url);
      const videos = response.data.results;
      if (videos && videos.length > 0) {
        const trailer = videos.find(video => video.type === "Trailer" && video.site === "YouTube");
        if (trailer) {
          const trailerUrl = `https://www.youtube.com/watch?v=${trailer.key}`;
          return trailerUrl;
        } else {
          return null;
        }
      }
    } catch (error) {
      console.error(`Error fetching ${type} trailer:`, error);
    }
  };

