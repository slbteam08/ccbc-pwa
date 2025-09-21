/**
 * API configuration for the application
 * In development, uses proxy to avoid CORS issues
 * In production, uses the actual API domain
 */
const getApiDomain = (): string => {
  // In development, use proxy path to avoid CORS
  if (import.meta.env.DEV) {
    return "/api";
  }
  // In production, use the actual API domain
  return import.meta.env.VITE_API_DOMAIN || "";
};

export const API_DOMAIN = getApiDomain();

export const endpoints = {
  login: `${API_DOMAIN}/index.php/v1/ccbc_plugin/login`,
  getArticle: `${API_DOMAIN}/index.php/v1/content/articles`,
};
