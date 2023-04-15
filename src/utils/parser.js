// @ts-check

/**
 *
 * @param {any} dateA
 * @returns
 */
export const parseDateString = (dateA) => {
  if (typeof dateA === "object") {
    const [month, day, year] = dateA.toLocaleDateString().split("/");
    return { year: Number(year), month: Number(month), day: Number(day) };
  } else if (typeof dateA === "string") {
    const [date] = dateA.split("T");
    const [year, month, day] = date.split("-");
    return { year: Number(year), month: Number(month), day: Number(day) };
  }
};

/**
 * @param {string} name
 */
export const parsePluralName = (name) => {
  if (name === "survey") return "surveys";
  if (name === "news") return "news";
  if (name[name.length - 1] === "y")
    return `${name.substring(0, name.length - 1)}ies`;
  return `${name}s`;
};

/**
 *
 * @param {string} href
 */
export const parseLocalHref = (href) => {
  let newHref = "";
  let count = 0;
  for (let i = 0; i < href.length; i += 1) {
    if (href[i] === "/") count += 1;
    if (count >= 3) newHref += href[i];
  }
  return newHref;
};

/**
 *
 * @param {string} string
 */
export const parseStringToArray = (string) => {
  const toReturn = [];
  const commaSplit = string.split(",");
  commaSplit.forEach((item) => {
    toReturn.push(item);
  });
  return toReturn;
};

/**
 *
 * @param {string} queries
 */
export const parseQueries = (queries) => {
  const toReturn = {};
  const queryParams = queries.substring(1).split("&");
  queryParams.forEach((item) => {
    const [param, value] = item.split("=");
    toReturn[param] = value;
  });
  return toReturn;
};

/**
 *
 * @param {object[]} apps
 * @returns
 */
export const parseApps = (apps) => {
  let toReturn = "";
  apps.forEach((item, i) => {
    if (i < apps.length - 1) toReturn += `${item.name}, `;
    else toReturn += item.name;
  });
  return toReturn;
};

export const parseDate = (number) => {
  const newDate = new Date();
  newDate.setTime(number);
  return `${newDate.getDate()}/${
    newDate.getMonth() + 1
  }/${newDate.getFullYear()} ${newDate.getHours()}:${newDate.getMinutes()}`;
};

/**
 *
 * @param {string} name
 */
export const parserAccents = (name) => {
  let newName = name;
  const accents = ["á", "é", "í", "ó", "ú"];
  const vocals = ["a", "e", "i", "o", "u"];
  accents.forEach((item, i) => {
    // @ts-ignore
    newName = newName.replaceAll(item, vocals[i]);
  });
  return newName;
};

/**
 *
 * @param {string} name
 */
export const parserAccentsBack = (name) => {
  let newName = name;
  const accents = ["á", "é", "í", "ó", "ú"];
  const vocals = ["a", "e", "i", "o", "u"];
  // @ts-ignore
  vocals.forEach((item, i) => (newName = newName.replaceAll(item, accents[i])));
  return newName;
};

/**
 *
 * @param {number} start
 * @param {number} i
 * @returns
 */
export const parseI = (start, i) => {
  let toReturn = start;
  for (let j = 0; j < i; j += 1) toReturn += 0.2;
  return toReturn;
};

/**
 * Find the first upper case letter in a string.
 * @param {string} str - The string to search through.
 * @returns {number} The index of the first uppercase letter in the string.
 */
export const findFirstUpperLetter = (str) => {
  const upperLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  for (let i = 0; i < str.length; i += 1)
    if (upperLetters.indexOf(str[i]) > -1) return i;
  return -1;
};

/**
 * Returns the index of the first number in a string
 * @param {string} str - The string to search through.
 * @returns {number} The index of the first number in the string.
 */
export const findFirstNumber = (str) => {
  const numbers = "012345678";
  for (let i = 0; i < str.length; i += 1)
    if (numbers.indexOf(str[i]) > -1) return i;
  return -1;
};

/**
 * Return the index of the first lowercase letter in the string, or -1 if there are no lowercase
 * letters.
 * @param {string} str - the string to search through
 * @returns {number} The index of the first lowercase letter in the string.
 */
export const findFirstLowerLetter = (str) => {
  const lowerLetters = "abcdefghijklmnopqrstuvwxyz";
  for (let i = 0; i < str.length; i += 1)
    if (lowerLetters.indexOf(str[i]) > -1) return i;
  return -1;
};

/**
 * Validates a password based on the following rules:
 *
 * @param {string} password - the password to validate
 * @param {string} user - the user's email address
 * @returns {number} error type, -1 if everything is ok
 *
 * - 0 The password must be between 8 and 12 characters long.
 * - 1 The password must contain at least one upper case letter, one lower case letter, and one number.
 * - 2 The password must not contain the user's name
 */
export const passwordValidation = (password, user) => {
  // validating password length
  if (password.length < 8 || password.length > 25) return 0;
  // validating password special characters
  if (
    findFirstUpperLetter(password) === -1 ||
    findFirstLowerLetter(password) === -1 ||
    findFirstNumber(password) === -1
  )
    return 1;
  if (password.indexOf(user) !== -1) return 2;
  return -1;
};

/**
 *
 * @param {string} password
 * @param {string} rpassword
 * @param {string} user
 * @returns
 */
export const passwordsAreValid = (password, rpassword, user) => {
  // validating passwords
  let passwordValidationResult = passwordValidation(password, user);
  if (passwordValidationResult > -1) return passwordValidationResult;
  passwordValidationResult = passwordValidation(rpassword, user);
  if (passwordValidationResult > -1) return passwordValidationResult;
  return -1;
};
