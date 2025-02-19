const datasetUrl = "https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/video-game-sales-data.json";

const width = 960;
const height = 600;

const svg = d3.select("#treemap")
  .attr("width", width)
  .attr("height", height);

const tooltip = d3.select("#tooltip");

d3.json(datasetUrl).then(data => {
  const hierarchy = d3.hierarchy(data)
    .sum(d => d.value)
    .sort((a, b) => b.value - a.value);

  const treemap = d3.treemap()
    .size([width, height])
    .padding(1);

  const root = treemap(hierarchy);

  const categories = Array.from(new Set(root.leaves().map(d => d.data.category)));
  const colorScale = d3.scaleOrdinal()
    .domain(categories)
    .range(d3.schemeSet3);

  // Tiles
  svg.selectAll("g")
    .data(root.leaves())
    .enter()
    .append("g")
    .attr("transform", d => `translate(${d.x0},${d.y0})`)
    .append("rect")
    .attr("class", "tile")
    .attr("fill", d => colorScale(d.data.category))
    .attr("data-name", d => d.data.name)
    .attr("data-category", d => d.data.category)
    .attr("data-value", d => d.data.value)
    .attr("width", d => d.x1 - d.x0)
    .attr("height", d => d.y1 - d.y0)
    .on("mouseover", (event, d) => {
      tooltip
        .style("visibility", "visible")
        .style("left", `${event.pageX + 10}px`)
        .style("top", `${event.pageY - 30}px`)
        .attr("data-value", d.data.value)
        .html(
          `Name: ${d.data.name}<br>
           Category: ${d.data.category}<br>
           Value: ${d.data.value}`
        );
    })
    .on("mouseout", () => {
      tooltip.style("visibility", "hidden");
    });

  // Text inside tiles
  svg.selectAll("g")
    .append("text")
    .attr("class", "tile-text")
    .attr("x", 5)
    .attr("y", 15)
    .text(d => d.data.name)
    .style("font-size", "10px")
    .style("pointer-events", "none");

  // Create legend
  const legendWidth = 300;
  const legendHeight = 20;

  const legend = svg
    .append("g")
    .attr("id", "legend")
    .attr("transform", `translate(50, ${height + 20})`); // Position the legend below the chart

  // Add legend rectangles
  legend
    .selectAll(".legend-item")
    .data(categories)
    .enter()
    .append("rect")
    .attr("class", "legend-item")
    .attr("x", (d, i) => i * (legendWidth / categories.length)) // Space each rectangle evenly
    .attr("y", 0)
    .attr("width", legendWidth / categories.length - 5) // Adjust width of each rectangle
    .attr("height", legendHeight)
    .attr("fill", d => colorScale(d));

  // Add legend labels
  legend
    .selectAll("text")
    .data(categories)
    .enter()
    .append("text")
    .attr("x", (d, i) => i * (legendWidth / categories.length) + 5)
    .attr("y", legendHeight + 15) // Position labels below the rectangles
    .text(d => d)
    .style("font-size", "10px");
});
