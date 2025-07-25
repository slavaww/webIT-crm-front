export const formatTaskDate = (dateString, fallback = '') => {
  if (!dateString) return fallback;
  
  try {
    return new Date(dateString).toLocaleDateString('ru-RU');
  } catch {
    return fallback;
  }
};