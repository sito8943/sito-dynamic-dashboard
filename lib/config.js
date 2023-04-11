const {
  NEXT_PUBLIC_API_URL,
  NEXT_PUBLIC_IMAGEKIT_URL,
  NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY,
  NEXT_PUBLIC_IMAGEKIT_AUTH_URL,
  NEXT_PUBLIC_IMAGEKIT_DELETE_URL,
  // cookies
  NEXT_PUBLIC_LANGUAGE,
} = process.env;

const config = {
  imagekitUrl: NEXT_PUBLIC_IMAGEKIT_URL,
  imagekitPublicKey: NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY,
  imagekitAuthUrl: NEXT_PUBLIC_IMAGEKIT_AUTH_URL,
  imagekitDeleteUrl: NEXT_PUBLIC_IMAGEKIT_DELETE_URL,
  // cookie
  language: NEXT_PUBLIC_LANGUAGE,
  apiUrl: "http://localhost:3000/api/",
  // map box api
};

export default config;
