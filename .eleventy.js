module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy("css");
  eleventyConfig.addPassthroughCopy("pages");
  eleventyConfig.addPassthroughCopy("src/assets");

  return {
    dir: {
      includes: "_includes",
      input: "src",
      output: "_site"
    }
  };
};