var deptUrl = 'http://api.penncoursereview.com/v1/depts?token=public';

var svg = d3.select("body").append("svg")
	.attr("width", diameter)
	.attr("height", diameter);

d3.json(deptUrl, function(error, json) {
	if (error) return console.warn(error);
	document.write(json);
});