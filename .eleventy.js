module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy("css");
  eleventyConfig.addPassthroughCopy("pagesDE");
  eleventyConfig.addPassthroughCopy("pagesEN");

  return {
    dir: {
      includes: "_includes",
      output: "_site"
    }
  };
};