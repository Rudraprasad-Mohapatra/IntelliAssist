const path = require("path");

module.exports = {
    entry: "./extension.js",
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js'
    }
}