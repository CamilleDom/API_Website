// Service séparé pour l'administration avec API Key
const ADMIN_API_KEY = 'API_Key_5IrdIsm-NOx9MmiXHzp732eT7Si9aGy4hoi0ocPTBKoGWU7-FJHrQQ3zgVHblIeER2atzUQqbiErCQjRw89xWg-YP6kBgZE982fyXAnSUMGlKNeDTlSWP0ljjDxI6bu7FsExMf20iCCHIMiiHYQ6X5EaAuSLjEe3KY_8DOohptLmJSXLkQeLYP4uuYJblki2MDzpPI28YT0P5-OPZW3cpZA0WWZQXalBvLFqV52hs7pECHItxTMBISEcUsyBxKXI';

const API_BASE_URL = 'http://localhost:8080';

export const adminAPI = {
  // Récupérer les statistiques admin
  getStats: async () => {
    const response = await fetch(`${API_BASE_URL}/api/admin/stats`, {
      headers: {
        'Authorization': ADMIN_API_KEY,
        'Content-Type': 'application/json',
      },
    });
    return response.json();
  },

  // Mettre à jour la configuration
  updateConfig: async (config) => {
    const response = await fetch(`${API_BASE_URL}/api/admin/config`, {
      method: 'POST',
      headers: {
        'Authorization': ADMIN_API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(config),
    });
    return response.json();
  },
};