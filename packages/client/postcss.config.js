const purgecss = require("@fullhuman/postcss-purgecss")({
  // Specify the paths to all of the template files in your project
  content: ["./src/**/*.tsx", "./public/index.html"],

  // Include any special characters you're using in this regular expression
  defaultExtractor: (content) => content.match(/[A-Za-z0-9-_:/]+/g) || [],
});

module.exports = {
  plugins: [
    require("postcss-import"),
    require("tailwindcss")("./tailwind.config.js"),
    require("postcss-preset-env")({ stage: 1 }),
    ...(process.env.NODE_ENV === "production" ? [purgecss] : []),
  ],
};
