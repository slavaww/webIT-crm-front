export const minutesToHours = (totalMinutes) => {
  const hours = Math.floor(totalMinutes / 60); // Получаем целые часы
  const minutes = totalMinutes % 60; // Получаем остаток минут
  return { hours: hours, minutes: minutes }; // Возвращаем объект
};