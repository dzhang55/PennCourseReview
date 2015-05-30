// This is an annotated version of the source code found here: 
// http://bl.ocks.org/mbostock/4063269
// Any somewhat abiguous line is explained in the comment immediately
// above that line. Additionally, the code is reformatted in some
// areas to make the code's function more clear.
var diameter = 960,
	// All this format does when applied to a number is add commas to the number.
	// example: format(12345678) yields "12,345,678"
	// This is only used on line 73 of this file.
	// source: // https://github.com/mbostock/d3/wiki/Formatting#d3_format
	format = d3.format(",d"),
	// constructs a new ordinal scale with a range of twenty categorical colors
	// This is only used on line 86 of this file.
	// source: https://github.com/mbostock/d3/wiki/Ordinal-Scales#category20c
	color = d3.scale.category20c();

// pack layout: https://github.com/mbostock/d3/wiki/Pack-Layout
// a better name for this might be "bubbleLayout"
var bubble = d3.layout.pack()
	// A null comparator disables sorting and uses tree traversal order. 
	.sort(null)
	// sets size of pack layout rectangle
	.size([diameter, diameter])
	// sets the padding between adjacent circles
	.padding(1.5);

// puts an SVG in the body with the same size as the bubble layout
var svg = d3.select("body").append("svg")
	.attr("width", diameter)
	.attr("height", diameter)
	// sets the SVG's class to "bubble"
	// (unnecessary for this example but is useful for styling)
	.attr("class", "bubble");

// d3.json documentation: https://github.com/mbostock/d3/wiki/Requests#d3_json
d3.json("flare.json", function (error, root) {
	// node refers to an array of SVG g elements
	// select all elements with class "node"
	// (unnecessary for this example but is useful for node styling)
	var node = svg.selectAll(".node")
		// You should understand what the classes function (defined below)
		// does before trying to understand what this next line does.
		// This is probably the most confusing and most important part of the file.
		// pack.nodes(root) computes the pack layout and returns the array of nodes.
		// This means that it computes a bunch of stuff and adds information
		// to our array of objects. The array returned by pack.nodes is then
		// filtered to only get the leaf nodes.
		// pack.nodes documentation: https://github.com/mbostock/d3/wiki/Pack-Layout#nodes
		.data(bubble.nodes(classes(root))
					.filter(function (d) { 
						return !d.children;
					}))
		// creates a bunch of placeholder nodes for the data
		// enter() documentation: https://github.com/mbostock/d3/wiki/Selections#enter
		.enter()
		// container for each node
		// SVG g element documentation: https://developer.mozilla.org/en-US/docs/Web/SVG/Element/g
		.append("g")
		// sets g element's class to node
		// (unnecessary for this example but is useful for node styling)
		.attr("class", "node")
		// sets the position of each node
		.attr("transform", function (d) {
			// If you remember from the classes function,
			// we defined d to have the following properties:
			// packageName, className, value. The x and the y
			// properties used below came from the pack.nodes(root)
			// call above. Check out the pack.nodes documentation above.
			return "translate(" + d.x + "," + d.y + ")"; 
		});

	// A title appears when you hover your mouse over a circle
	node.append("title")
		.text(function (d) {
			return d.className + ": " + format(d.value);
		});

	node.append("circle")
		// r was computed by pack.nodes probably by using each
		// node's size property
		.attr("r", function (d) {
			return d.r;
		})
		// nodes in flare.json whose parents have the
		// same name are the same color
		.style("fill", function (d) {
			return color(d.packageName);
		});

	node.append("text")
		// vertical centering
		.attr("dy", ".3em")
		// horizontal centering
		.style("text-anchor", "middle")
		// ensures the text stays inside the circle
		.text(function (d) {
			return d.className.substring(0, d.r / 3);
		});

});

// Returns a flattened hierarchy containing all leaf nodes under the root.
// In this case, the root is the root of flare.json.
// Examine the structure of flare.json, before reading this.
function classes(root) {
	var classes = [];

	// If you're new to JavaScript note that the dot notation used
	// on nodes in this function allows easy access to the object
	// properties of flare.json.
	// For example, root.name would yield "flare".
	// Similarly, root.children[0].name would yield "analytics".
	// This is pretty cool if you come from a Java background.
	// JavaScript JSONs: http://www.w3schools.com/js/js_json.asp
	function recurse(name, node) {
		// If a node isn't a leaf, for each of its children,
		// recursively call this method where the "name" parameter
		// is the name of this node (child's parent) and the
		// "node" parameter is the child node.
		if (node.children) {
			node.children.forEach(function(child) {
				recurse(node.name, child);
			});
		} 
		// If the node is a leaf, the is what we want in our array,
		// so add an object to the classes array that represents
		// that leaf. This object contains the name of that leaf's
		// parent, the name of that leaf, and the value of that leaf.
		else {
			classes.push({
				packageName: name,
				className: node.name,
				// It is very important that this property name
				// is "value" or else nodes.pack wouldn't be able
				// to calculate important things.
				// Try changing it to "size" and see what happens.
				value: node.size
			});
		}
	}

	recurse(null, root);
	return {children: classes};
}

// http://stackoverflow.com/questions/22448032/d3-what-is-the-self-as-in-d3-selectself-frameelement-styleheight-height
d3.select(self.frameElement).style("height", diameter + "px");
