module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'jsdom',
    transform: {
      '^.+\\.tsx?$': 'ts-jest', // Transformer TypeScript avec ts-jest
      '^.+\\.js$': 'babel-jest', // Transformer JavaScript (modules ESM inclus)
    },
    transformIgnorePatterns: [
      '/node_modules/(?!(axios)/)', // Transforme axios et ses dépendances
    ],
    moduleNameMapper: {
      '\\.(css|less|scss|sass)$': 'identity-obj-proxy', // Gestion des fichiers CSS
    },
  };
  