// Uses VITE_API_URL when provided, otherwise falls back to the local/prod relative API.
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
