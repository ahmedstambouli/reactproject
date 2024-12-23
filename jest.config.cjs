module.exports = {
  transform: {
    "^.+\\.(ts|tsx)$": "babel-jest", // Utilisez babel-jest pour transformer les fichiers TS/TSX
  },
  transformIgnorePatterns: [
    "/node_modules/(?!axios)/", // Spécifie à Jest de ne pas ignorer axios
  ],
  testEnvironment: "jsdom",
};
