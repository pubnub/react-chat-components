export const getNameInitials = (name: string): string => {
  if (!name.length) return "";
  const nameSplit = name.split(" ");
  const initials =
    nameSplit.length == 1 ? nameSplit[0].substring(0, 2) : nameSplit[0][0] + nameSplit[1][0];
  return initials.toUpperCase();
};

export const getPredefinedColor = (uuid: string): string => {
  const colors = ["#80deea", "#9fa7df", "#aed581", "#ce93d8", "#ef9a9a", "#ffab91", "#ffe082"];
  const sum = uuid
    .split("")
    .map((c) => c.charCodeAt(0))
    .reduce((a, b) => a + b);
  return colors[sum % colors.length];
};
