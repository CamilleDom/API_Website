const API_BASE_URL = 'http://localhost:8080';

const recommendationService = {
  getTrendingProducts: async (limit = 12) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/recommendations/trending?limit=${limit}`);
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Erreur getTrendingProducts:', error);
      return { trending: [] };
    }
  },

  getSimilarProducts: async (productId, limit = 6) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/recommendations/similar/${productId}?limit=${limit}`);
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Erreur getSimilarProducts:', error);
      return { similarProducts: [] };
    }
  },

  getRecommendationsForUser: async (userId, limit = 10) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/recommendations/user/${userId}?limit=${limit}`);
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Erreur getRecommendationsForUser:', error);
      return { recommendations: [] };
    }
  }
};

export default recommendationService;