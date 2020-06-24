/// <reference path="../3rd/jquery-3.5.1.min.js" />
/// <reference path="../d3/d3-5.16.0/d3.js" />

$.getJSON("data/graph.json", function (data) {
    const links = data.links.map(d => Object.create(d));
    const nodes = data.nodes.map(d => Object.create(d));

    const simulation = d3.forceSimulation(nodes)
        .force("link", d3.forceLink(links).id(d => d.id))
        .force("charge", d3.forceManyBody())
        .force("x", d3.forceX())
        .force("y", d3.forceY());

    const svg = d3.create("svg")
      .attr("viewBox", [-1600 / 2, -900 / 2, 1600, 900]);

    d3.select("#main").insert(svg);
})