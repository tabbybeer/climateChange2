//setup
var margin4 = { top: 10, bottom: 30, right: 10, left: 30 };
var height4 = 400 - margin4.top - margin4.bottom;
var width4 = 600 - margin4.right - margin4.left;

//copied
var svg4 = d3.select("body")
    .append('svg')
    .attr("height", height4 + margin4.top + margin4.bottom)
    .attr("width", width4 + margin4.right + margin4.left)
    .append("g")
    .attr("transform", "translate(" + margin4.left + "," + margin4.top + ")");

//owm made
var svg = d3.select("body")
    .append('svg')
    .attr("height", 400)
    .attr("width", 800)
    .append("g")
    .attr("transform", "translate(" + 30 + "," + 10 + ")");





//get the data and make line


d3.csv("ukCo2.csv", function (data) {

    //x-axis with the date
    var x4 = d3.scaleTime()
        .domain(d3.extent(data, function (d) { return d.date; }))
        .range([0, width4]);
    svg4.append("g")
        .attr("transform", "translate(0," + height4 + ")")
        .call(d3.axisBottom(x4));

    // y axis with prices
    var y4 = d3.scaleLinear()
        .domain([0, d3.max(data, function (d) { return d.value; })])
        .range([height4, 0]);
    svg4.append("g")
        .call(d3.axisLeft(y4));

    console.log(data);


    //line 
    var line = d3.line()
        .x(function (d) { return x4(d.date) })
        .y(function (d) { return y4(d.value) });

    // Add the line
    svg4.append("path")
        .data(data)
        .attr("fill", "none")
        .attr("stroke", "grey")
        .attr("stroke-width", 1.5)
        .attr('d', line);
}
)