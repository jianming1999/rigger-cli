function InertToHTMLPlugin(options) {
	this.options = options;
}

InertToHTMLPlugin.prototype.apply = function(compiler) {
    var paths = this.options.paths;
    compiler.plugin('compilation', function(compilation, options) {
        compilation.plugin('html-webpack-plugin-before-html-processing', function(htmlPluginData, callback) {
        	var beforeIndex = htmlPluginData.assets.js.length - 1;
            for (var i = paths.length - 1; i >= 0; i--) {
				htmlPluginData.assets.js.splice(beforeIndex, 0, paths[i]);
                // htmlPluginData.assets.js.unshift(paths[i]);
            }
            callback(null, htmlPluginData);
        });
    });
};

module.exports = InertToHTMLPlugin;