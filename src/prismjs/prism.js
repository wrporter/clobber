import Prism from "prismjs";

import "prismjs/components/prism-javascript";
import "./prismjs-theme-darcula.css";

import "prismjs/plugins/normalize-whitespace/prism-normalize-whitespace";

Prism.plugins.NormalizeWhitespace.setDefaults({
	"remove-trailing": true,
	"remove-indent": true,
	"left-trim": true,
	"right-trim": true
});
