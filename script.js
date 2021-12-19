
//change color of website
function changeColor(color) {
    document.body.style.background = color;
};

/**
 * Class structure for line graph
 * @param {string} dataFile - The name of the datafile which the line graph will be made from
 */
class Line {
    constructor(dataFile) {
        this.margin = { top: 20, right: 20, bottom: 50, left: 70 };
        this.width = 1000 - this.margin.left - this.margin.right;
        this.height = 500 - this.margin.top - this.margin.bottom;
        this.dataFile = dataFile;
    }
    /**
     * function to actually draw the line with d3 and svg elements
     * uses the class structure for the data file and graph dimensions
     */
    createLine() {
        //to remove what is already in the section
        document.getElementById("line").innerHTML = "";

        // format for the date
        var parseTime = d3.timeParse("%d-%b-%y");

        // set the ranges
        var x = d3.scaleTime().range([0, this.width]);
        var y = d3.scaleLinear().range([this.height, 0]);

        // define the line
        var valueline = d3.line()
            .x(function (d) { return x(d.date); })
            .y(function (d) { return y(d.close); });


        // create the svg element and append g to line section
        var svg = d3.select("#line").append("svg")
            .attr("width", this.width + this.margin.left + this.margin.right)
            .attr("height", this.height + this.margin.top + this.margin.bottom)
            .append("g")
            .attr("transform",
                "translate(" + this.margin.left + "," + this.margin.top + ")");

        // get data
        d3.csv(this.dataFile).then(function (data) {

            // format 
            data.forEach(function (d) {
                d.date = parseTime(d.date);
                d.close = +d.close;
            });

            // range of data
            x.domain(d3.extent(data, function (d) { return d.date; }));
            y.domain([0, d3.max(data, function (d) { return d.close; })]);

            // add the path
            svg.append("path")
                .data([data])
                .attr("class", "line")
                .attr("d", valueline);

            // add x axis
            svg.append("g")
                .attr("transform", "translate(0," + 430 + ")")
                .call(d3.axisBottom(x));

            // add y axis
            svg.append("g")
                .call(d3.axisLeft(y));

        });

    }

};


/**
 * Function to set the image for the line chart based on the data file being used
 * @param {string} dataFile - The name of the datafile which corresponds to the country flag needed
 */
function flagImage(dataFile) {
    switch (dataFile) {
        case "ukCo2.csv":
            return "images/uk.png"
        case "russiaCo2.csv":
            return "images/russia.png"
        case "chinaCo2.csv":
            return "images/china.png"
        case "usaCo2.csv":
            return "images/usa.png"

    };
};


/**
 * Function to create a new object of the line class and call the createLine function on this new object
 * @param {string} dataFile - The name of the datafile which the line graph will be made from
 */
function lineGraph(dataFile) {
    let graph = new Line(dataFile);
    graph.createLine();
    let img = flagImage(dataFile);
    document.getElementById("flag").src = img
};

//initialize the line graph area with the uk graph
lineGraph('ukCo2.csv');


//class structure for bar chart
class Bar {
    constructor(dataFile) {
        this.margin = { top: 20, right: 20, bottom: 50, left: 70 };
        this.width = 1000 - this.margin.left - this.margin.right;
        this.height = 500 - this.margin.top - this.margin.bottom;
        this.data = dataFile
    };

    createBarChart() {
        // range of data
        var x = d3.scaleBand()
            .range([0, this.width])
            .padding(0.1);
        var y = d3.scaleLinear()
            .range([this.height, 0]);

        // define svg and append to bar chart section
        var svg2 = d3.select("#barChart").append("svg")
            .attr("width", this.width + this.margin.left + this.margin.right)
            .attr("height", this.height + this.margin.top + this.margin.bottom)
            .append("g")
            .attr("transform",
                "translate(" + this.margin.left + "," + this.margin.top + ")");



        // get the data
        d3.csv(this.data).then(function (data) {

            // format 
            data.forEach(function (d) {
                d.y2021 = +d.y2021;
            });

            // range and domain of data
            x.domain(data.map(function (d) { return d.month; }));
            y.domain([0, d3.max(data, function (d) { return d.y2021; })]);

            // append the rectangles for the bar chart
            svg2.selectAll(".bar")
                .data(data)
                .enter().append("rect")
                .attr("class", "bar")
                .attr("x", function (d) { return x(d.month); })
                .attr("width", x.bandwidth())
                .attr("y", function (d) { return y(d.y2021); })
                .attr("height", function (d) { return 430 - y(d.y2021); })
                .on("mouseover", function (d) {
                    d3.select(this).transition()
                        .duration('50')
                        .attr('opacity', '.65');
                })
                .on("mouseout", function () {
                    d3.select(this).transition()
                        .duration('50')
                        .attr('opacity', '1');
                })
                .append("title")
                .text(function (d) { return d.y2021; });

            // add the x Axis
            svg2.append("g")
                .attr("transform", "translate(0," + 430 + ")")
                .call(d3.axisBottom(x));

            // add the y Axis
            svg2.append("g")
                .call(d3.axisLeft(y));

        });
    };
};

let newBar = new Bar("avgTemp.csv");
newBar.createBarChart();



