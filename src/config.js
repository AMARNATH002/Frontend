// Configuration for different environments
const config = {
  development: {
    API_BASE_URL: 'http://localhost:5000',
  },
  production: {
    API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'https://your-backend-domain.com',
  }
};

const environment = import.meta.env.MODE || 'development';

export default config[environment];