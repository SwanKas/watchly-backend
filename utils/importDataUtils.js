// utils/filmUtils.js
import axios from 'axios';
import Providers from '../models/Providers.js';
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
export const fetchProvidersAndSave = async (productId, type) => {
    try {
      const url = `https://api.themoviedb.org/3/${type}/${productId}/watch/providers?api_key=${process.env.TMDB_API_KEY}`;
      const response = await axios.get(url);
      const providersData = response.data.results;
      const regions = ['FR', 'US', 'GB']; // Providers country to get from api
  
      const providersByCountry = [];
  
      for (const region of regions) {
        if (providersData[region]) {
          const providerInfo = providersData[region];
          const providersByType = {
            flatrate: [],
            rent: [],
            buy: []
          };
  
          ['flatrate', 'rent', 'buy'].forEach(type => {
            if (providerInfo[type]) {
              providerInfo[type].forEach(async (provider) => {
                providersByType[type].push(provider.provider_id);
  
                const existingProvider = await Providers.findOne({ id_providers: provider.provider_id, country_code: region });
                if (!existingProvider) {
                  const newProvider = new Providers({
                    id_providers: provider.provider_id,
                    name: provider.provider_name,
                    url_providers_img: `https://image.tmdb.org/t/p/original${provider.logo_path}`,
                    country_code: region,
                    type: type,
                  });
                  await newProvider.save();
                }
              });
            }
          });

          providersByCountry.push({
            [region]: {
              types: providersByType
            }
          });
        }
      }
      return providersByCountry;
    } catch (error) {
      console.error('Error fetching providers:', error);
      return [];
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

