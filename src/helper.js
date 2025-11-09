export const checkHeading = (str) => {
  // Remove side spaces
  const text = str.trim();

  // If text begins with "**" then it's a heading
  return text.startsWith("**");
};

export const replacecheckHeading = (str) => {
  let text = str.trim();

  // Remove all leading stars (*)
  while (text.startsWith("*")) {
    text = text.slice(1);
  }

  // Remove all trailing stars (*)
  while (text.endsWith("*")) {
    text = text.slice(0, -1);
  }

  return text.trim();
};
