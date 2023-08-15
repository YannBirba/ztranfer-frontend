export const formatDateTimeToFrenchFormat = (dateString: string) => {
  const date = new Date(dateString);
  const min = date.getMinutes() > 9 ? "mins" : "min";
  return date
    .toLocaleString()
    .split(" ")
    .join(" à ")
    .split(":")
    .slice(0, 2)
    .join(" h ")
    .concat(` ${min}`);
};

export const formatDateToFrenchFormat = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("fr-FR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};
