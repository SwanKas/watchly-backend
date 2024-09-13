import { Client } from "@elastic/elasticsearch";
import dotenv from "dotenv"; // Assure-toi d'importer dotenv ici

// Charger les variables d'environnement depuis le fichier .env
dotenv.config();

// Configurer le client ElasticSearch
const client = new Client({
  node: process.env.ELASTICSEARCH_URL, // URL d'ElasticSearch
  auth: {
    apiKey: process.env.ELASTICSEARCH_API_KEY, // Clé API
  },
});

export const testConnection = async () => {
  console.log("Tentative de connexion à ElasticSearch..."); // Log pour voir si la fonction est bien appelée
  try {
    const response = await client.info();
    console.log("ElasticSearch connected:", response);
  } catch (error) {
    console.error(
      "Erreur lors de la connexion à ElasticSearch:",
      error.message
    );
  }
};

// Fonction pour rechercher des films dans l'index 'movies'
export const searchMovies = async (query) => {
  try {
    const searchResult = await client.search({
      index: "movies",
      q: query,
    });
    return searchResult.hits.hits; // Retourne les résultats trouvés
  } catch (error) {
    console.error("Error searching movies:", error);
    throw error; // Propager l'erreur pour qu'elle soit gérée dans le serveur
  }
};
