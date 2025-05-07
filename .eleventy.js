module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy("css");
  eleventyConfig.addPassthroughCopy("pages");
  eleventyConfig.addPassthroughCopy("src/assets");

  // Deutsche Concept-Art-Seiten
  eleventyConfig.addCollection("conceptArtDE", function (collectionApi) {
    return collectionApi.getFilteredByGlob("src/pages/concept-art/**/*.njk");
  });

  // Englische Concept-Art-Seiten
  eleventyConfig.addCollection("conceptArtEN", function (collectionApi) {
    return collectionApi.getFilteredByGlob("src/pages/en/concept-art/**/*.njk");
  });

  // Deutsche Games-Seiten
  eleventyConfig.addCollection("gamesDE", function (collectionApi) {
    return collectionApi.getFilteredByGlob("src/pages/games/**/*.njk");
  });

  // Englische Games-Seiten
  eleventyConfig.addCollection("gamesEN", function (collectionApi) {
    return collectionApi.getFilteredByGlob("src/pages/en/games/**/*.njk");
  });

  return {
    dir: {
      input: "src",
      includes: "_includes",
      data: "_data",
      output: "_site"
    }
  };
};