//line chart
//sourced from https://blocks.lsecities.net/d3noob/15e4f2a49d0d25468e76ab6717cd95e7
function lineGraph(dataFile) {
    //to remove what is already in the section
    document.getElementById("line").innerHTML = "";

    var margin = { top: 20, right: 20, bottom: 50, left: 70 },
        width = 1000 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

    // parse the date / time
    var parseTime = d3.timeParse("%d-%b-%y");

    // set the ranges
    var x = d3.scaleTime().range([0, width]);
    var y = d3.scaleLinear().range([height, 0]);

    // define the line
    var valueline = d3.line()
        .x(function (d) { return x(d.date); })
        .y(function (d) { return y(d.close); });

    // append the svg obgect to the body of the page
    // appends a 'group' element to 'svg'
    // moves the 'group' element to the top left margin
    var svg = d3.select("#line").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

    // Get the data
    d3.csv(dataFile).then(function (data) {

        // format the data
        data.forEach(function (d) {
            d.date = parseTime(d.date);
            d.close = +d.close;
        });

        // Scale the range of the data
        x.domain(d3.extent(data, function (d) { return d.date; }));
        y.domain([0, d3.max(data, function (d) { return d.close; })]);

        // Add the valueline path.
        svg.append("path")
            .data([data])
            .attr("class", "line")
            .attr("d", valueline);

        // Add the x Axis
        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x));

        // Add the y Axis
        svg.append("g")
            .call(d3.axisLeft(y));

    });

}



//bar chart
// set the dimensions and margins of the graph
var margin = { top: 20, right: 20, bottom: 50, left: 70 },
    width = 1000 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

// set the ranges
var x = d3.scaleBand()
    .range([0, width])
    .padding(0.1);
var y = d3.scaleLinear()
    .range([height, 0]);



// append the svg object to the body of the page
// append a 'group' element to 'svg'
// moves the 'group' element to the top left margin
var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");

// get the data
d3.csv("avgTemp.csv").then(function (data) {

    // format the data
    data.forEach(function (d) {
        d.y2021 = +d.y2021;
    });

    // Scale the range of the data in the domains
    x.domain(data.map(function (d) { return d.month; }));
    y.domain([0, d3.max(data, function (d) { return d.y2021; })]);

    // append the rectangles for the bar chart
    svg.selectAll(".bar")
        .data(data)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("x", function (d) { return x(d.month); })
        .attr("width", x.bandwidth())
        .attr("y", function (d) { return y(d.y2021); })
        .attr("height", function (d) { return height - y(d.y2021); })
        .on("mouseover", function (d) {
            d3.select(this).transition()
                .duration('50')
                .attr('opacity', '.85');
        })
        .on("mouseout", function () {
            d3.select(this).transition()
                .duration('50')
                .attr('opacity', '1');
        })
        .append("svg:title")
        .text(function (d) { return d.y2021; });

    // add the x Axis
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

    // add the y Axis
    svg.append("g")
        .call(d3.axisLeft(y));

});

