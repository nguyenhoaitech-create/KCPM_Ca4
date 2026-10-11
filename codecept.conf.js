/** @type {CodeceptJS.MainConfig} */
export const config = {
  tests: "./tests/*_test.js",
  output: "./output",
  helpers: {
    Playwright: {
      browser: "chromium",
      url: "http://localhost:5500",
      show: true,
    },
  },
  include: {
    I: "./steps_file.js",
  },
  noGlobals: false,
  plugins: {},
  name: "DA_ITS",
};
