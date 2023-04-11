// @ts-check
var CryptoJS = require("crypto-js");

/* const { fetchAll, updatePlaceTypes } = require("./placeTypes"); */
import { keys, connections, usersOnline } from "../../lib/auth";
import { fetchModel, updateModel } from "../driver";

const noAccessAttributes = ["password", "id"];

/**
 *
 * @param {boolean} remember
 * @returns
 */
const giveToken = (remember) => {
  return remember ? 30 : 1;
};

/**
 *
 * @param {string} user
 */
export const signOut = async (user) => {
  const data = await fetchModel("users", ["id"], user);
  if (data) {
    if (data.sessionLog)
      data.sessionLog.push({
        date: new Date().getTime(),
        action: "log-out",
      });
    else
      data.sessionLog = [
        {
          date: new Date().getTime(),
          action: "log-out",
        },
      ];
    updateModel("users", data);
    return {
      status: 200,
      data: {
        message: "logged out",
      },
    };
  }
  return {
    status: 422,
    data: {
      error: "not found",
    },
  };
};

/**
 *
 * @param {string} user
 * @param {string} password
 * @param {boolean} remember
 * @returns user data
 */
export const login = async (user, password, remember) => {
  let theUser = {};
  console.log(user);
  let data = await fetchModel("users", ["id"], user);
  if (data !== undefined) {
    theUser.password = data.password;
    theUser.user = data.user;
    theUser.apps = data.apps ? data.apps.map((item) => item.id) : undefined;
    theUser.id = data.id;
    // @ts-ignore
    theUser.publicName = data.publicName;
    if (theUser.password.toLowerCase() === password.toLowerCase()) {
      const expiration = giveToken(remember);
      const token =
        /* It's encrypting the token */
        CryptoJS.AES.encrypt(
          `${user}[!]${password}`,
          "decorazon.app"
        ).toString();
      usersOnline[user] = { user, password };
      // @ts-ignore
      keys[user] = { token, user, password, time: expiration.number };
      if (data.sessionLog)
        data.sessionLog.push({
          date: new Date().getTime(),
          action: "log-in",
        });
      else
        data.sessionLog = [
          {
            date: new Date().getTime(),
            action: "log-in",
          },
        ];
      // update("users", theUser.id, data);
      return {
        status: 200,
        data: {
          user: theUser.user,
          publicName: theUser.publicName,
          apps: theUser.apps,
          token,
          expiration,
        },
      };
    } else return { status: 401, data: { error: "wrong password" } };
  }
  return { status: 401, data: { error: "wrong password" } };
};
