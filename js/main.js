const FRAME_HEIGHT = 400;
const FRAME_WIDTH = 500;
const MARGINS = {left: 50, right: 50, top: 50, bottom: 50};
const VIS_HEIGHT = FRAME_HEIGHT - MARGINS.top - MARGINS.bottom;
const VIS_WIDTH = FRAME_WIDTH - MARGINS.left -MARGINS.right;

// map species to different colors
const COLOR = d3.scaleOrdinal()
        .domain(["setosa", "versicolor", "virginica" ])
        .range([ "#440154ff", "#21908dff", "#fde725ff"])

// select the different divs for each viz
const FRAME1 = d3.select("#vis1")
                    .append("svg")
                        .attr("height", FRAME_HEIGHT)
                        .attr("width", FRAME_WIDTH)
                        .attr("class", "frame");

const FRAME2 = d3.select("#vis2")
                    .append("svg")
                            .attr("height", FRAME_HEIGHT)
                            .attr("width", FRAME_WIDTH)
                            .attr("class", "frame");

const FRAME3 = d3.select("#vis3")
                        .append("svg")
                                .attr("height", FRAME_HEIGHT)
                                .attr("width", FRAME_WIDTH)
                                .attr("class", "frame");


function scatter() {
    d3.csv("data/iris.csv").then((data) => {

        const X_MAX = d3.max(data, (d) => { return parseInt(d.Sepal_Length); });
        const Y_MAX = d3.max(data, (d) => { return parseInt(d.Petal_Length); });

        const X_SCALE = d3.scaleLinear() 
                        .domain([0, (X_MAX + 1)]) 
                        .range([0, VIS_WIDTH]);

        const Y_SCALE = d3.scaleLinear() 
                        .domain([0, (Y_MAX + 1)]) 
                        .range([VIS_HEIGHT, 0]);


        points1 = FRAME1.selectAll('points')
            .data(data)
            .enter()
            .append('circle')
            .attr("cx", (d) => { return (X_SCALE(d.Sepal_Length) + MARGINS.left); }) 
            .attr("cy", (d) => { return (Y_SCALE(d.Petal_Length) + MARGINS.top); }) 
              .attr('r', 5)
              .attr('fill', function(d){return COLOR(d.Species)})
              .attr("opacity", 0.5)
              .attr('class', 'point');
        
        // make x axis
        FRAME1.append("g") 
              .attr("transform", "translate(" + MARGINS.left + "," + (VIS_HEIGHT + MARGINS.top) + ")") 
              .call(d3.axisBottom(X_SCALE).ticks(10)) 
              .attr("font-size", '10px');
        
        // make y axis
        FRAME1.append("g")
              .attr("transform", "translate(" + MARGINS.left + "," + (MARGINS.bottom) + ")")
              .call(d3.axisLeft(Y_SCALE).ticks(10))
              .attr("font-size", "10px");
              
            }); 
    
}
                        

function scatter2() {
    d3.csv("data/iris.csv").then((data) => {

        const MAX_X2 = d3.max(data, (d) => {return parseInt(d.Sepal_Width);});
        const MAX_Y2 = d3.max(data, (d) => {return parseInt(d.Petal_Width);});
    
        const X_SCALE2 = d3.scaleLinear() 
                            .domain([0, MAX_X2 + 1]) 
                            .range([0, VIS_WIDTH]);
    
        const Y_SCALE2 = d3.scaleLinear() 
                            .domain([0, MAX_Y2 +1]) 
                            .range([VIS_HEIGHT, 0]);

        // Add x axis
        FRAME2.append("g") 
                .attr("transform", "translate(" + MARGINS.left + "," + (VIS_HEIGHT + MARGINS.top) + ")") 
                .call(d3.axisBottom(X_SCALE2).ticks(10)) 
                .attr("font-size", '10px');

        // Add y axis 
        FRAME2.append("g")
                .attr("transform", "translate(" + MARGINS.left + "," + (MARGINS.bottom) + ")")
                .call(d3.axisLeft(Y_SCALE2).ticks(10))
                .attr("font-size", "10px");

        // Add points
        points2 = FRAME2.selectAll("points")  
                    .data(data) 
                    .enter()       
                    .append("circle")  
                        .attr("cx", (d) => {return (X_SCALE2(d.Sepal_Width) + MARGINS.left)}) 
                        .attr("cy", (d) => {return (Y_SCALE2(d.Petal_Width) + MARGINS.top)}) 
                        .attr("r", 5)
                        .attr("fill", function(d) {return COLOR(d.Species);})
                        .attr("opacity", 0.5)
                        .attr("class", "point");

        FRAME2.call(d3.brush()
                        .extent([[0,0], [FRAME_WIDTH, FRAME_HEIGHT]])
                        .on("start brush", updateChart))
                        .on("end", () => {
                        });

        function updateChart(event) {
            let extent = event.selection;
        
            points1.classed("selected", function(d){ return isBrushed(extent, X_SCALE2(d.Sepal_Width) + MARGINS.left, Y_SCALE2(d.Petal_Width) + MARGINS.top)  } )
            points2.classed("selected", function(d){ return isBrushed(extent, X_SCALE2(d.Sepal_Width) + MARGINS.left, Y_SCALE2(d.Petal_Width) + MARGINS.top)  } )
            bars.classed("selected", function(d){ return isBrushed(extent, X_SCALE2(d.Sepal_Width) + MARGINS.left, Y_SCALE2(d.Petal_Width) + MARGINS.top)  } )
        
        }
        
        function isBrushed(brush_coords, cx, cy) {
            var x0 = brush_coords[0][0],
                x1 = brush_coords[1][0],
                y0 = brush_coords[0][1],
                y1 = brush_coords[1][1];
            return x0 <= cx && cx <= x1 && y0 <= cy && cy <= y1;    
        }
    })

    
}

function bar() {
    d3.csv("data/iris.csv").then((data) => {
    
        const X_SCALE3 = d3.scaleBand()
                               .range([0, VIS_WIDTH])
                               .domain(data.map((d) => {return d.Species;}))
                               .padding(.25);
    
        const Y_SCALE3 = d3.scaleLinear()
                               .range([VIS_HEIGHT, 0])
                               .domain([0,60])
    
        // make x axis
        FRAME3.append("g") 
                .attr("transform", "translate(" + MARGINS.left + "," + (VIS_HEIGHT + MARGINS.top) + ")") 
                .call(d3.axisBottom(X_SCALE3))
                .attr("font-size", '10px'); 
        
        // make y axis
        FRAME3.append("g")
                .attr("transform", "translate(" + MARGINS.left + "," + (MARGINS.bottom) + ")")
                .call(d3.axisLeft(Y_SCALE3).ticks(10))
                .attr("font-size", "10px");
    

        bars =  FRAME3.selectAll(".bar")
                .data(data)
                .enter()
                .append("rect")
                    .attr("x", (d) => { return (X_SCALE3(d.Species) + MARGINS.left); })
                    .attr("y", (d) => {return Y_SCALE3(50) + MARGINS.top}) 
                    .attr("width", X_SCALE3.bandwidth())
                    .attr("height", (d) => { return VIS_HEIGHT - Y_SCALE3(50)})
                    .attr("class", "bar")
                    .attr("fill", (d) => { return COLOR(d.Species);})
    })};
    


scatter()
scatter2()
bar()
