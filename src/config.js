const {
  VITE_API_URL,
  VITE_IMAGEKIT_URL,
  VITE_IMAGEKIT_PUBLIC_KEY,
  VITE_IMAGEKIT_AUTH_URL,
  VITE_IMAGEKIT_DELETE_URL,
  // cookies
  VITE_LANGUAGE,
  VITE_BASIC_KEY,
  VITE_APPS_KEY,
  VITE_ACCEPT_COOKIE,
  VITE_DECLINE_COOKIE,
  // map box
  VITE_MAPBOX_API,
} = import.meta.env;

const config = {
  imagekitUrl: VITE_IMAGEKIT_URL,
  imagekitPublicKey: VITE_IMAGEKIT_PUBLIC_KEY,
  imagekitAuthUrl: VITE_IMAGEKIT_AUTH_URL,
  imagekitDeleteUrl: VITE_IMAGEKIT_DELETE_URL,
  // cookie
  language: VITE_LANGUAGE,
  apiUrl: VITE_API_URL,
  basicKeyCookie: VITE_BASIC_KEY,
  appsCookie: VITE_APPS_KEY,
  acceptCookie: VITE_ACCEPT_COOKIE,
  declineCookie: VITE_DECLINE_COOKIE,
  // map box api
  mapBoxAPI: VITE_MAPBOX_API,
};

export default config;
