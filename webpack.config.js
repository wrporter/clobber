const CleanWebpackPlugin = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const webpack = require("webpack");

const config = {
	entry: {
		main: "./src/index.js"
	},
	output: {
		filename: "[name].js"
	},
	resolve: {
		extensions: [".js"]
	},
	module: {
		rules: [
			{ test: /\.js$/, exclude: /node_modules/, loader: "babel-loader" },
			{
				test: /\.s?css$/,
				use: ["style-loader", "css-loader", "sass-loader"]
			},
			{
				test: /\.(png|jpe?g|gif|svg|eot|ttf|woff|woff2)$/,
				loader: "url-loader",
				options: {
					limit: 10000
				}
			}
		]
	},
	plugins: [
		new CleanWebpackPlugin(),
		new HtmlWebpackPlugin({
			template: "./src/index.html"
		}),
		new webpack.HotModuleReplacementPlugin()
	],
	devServer: {
		contentBase: "src",
		historyApiFallback: true,
		hot: true,
		open: true
	}
};

module.exports = (env, argv) => {
	if (argv.mode === "development") {
		config.devtool = "source-map";
	}

	return config;
};
