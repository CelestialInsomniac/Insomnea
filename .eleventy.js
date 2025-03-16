module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy("css");
  eleventyConfig.addPassthroughCopy("pages");

  return {
    dir: {
      includes: "_includes",
      output: "_site"
    }
  };
};