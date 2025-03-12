module.exports = function(eleventyConfig) {
  eleventyConfig.addPassthroughCopy("pagesDE");

  return {
    dir: {
      input: ".",
      includes: "_includes",
      output: "_site"
    }
  };
};