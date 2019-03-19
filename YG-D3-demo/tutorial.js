const data = [3, 1, 4, 1, 5, 9, 2, 6, 5];
const label = data.map((val, idx) => { return idx.toString() });

const svg = d3.select("svg");
svg.style('background-color','lightgray'); // change inline style to check svg variable
const width = +svg.attr('width') / 2; // or parseFloat()
const height = +svg.attr('height') / 2;
console.log(height, typeof height);

function render(data) {
    const xValue = data.map((val, ind) => { return ind });
    const yValue = data.map((val, ind) => { return val });
    const margin = { top: 20, right: 20, bottom: 20, left: 50 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const yScale = d3.scaleLinear() // linear mapping from domain (data space) to range (screen space)
        .domain([0, d3.max(yValue)])
        .range([innerHeight,0]);
    const xScale = d3.scaleBand()
        .domain(xValue)
        .range([0, innerWidth])
        .padding(0.1);

    const g = svg.append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);

    g.append('g').call(d3.axisLeft(yScale));
    g.append('g').call(d3.axisBottom(xScale))
        .attr('transform', `translate(0,${innerHeight})`);

    g.selectAll("rect").data(data)
        .enter().append('rect')
        .attr('x', (val, idx) => xScale(idx))
        .attr('y', (val) => yScale(val)) //height - yScale(v)
        .attr('height', v => innerHeight-yScale(v))
        .attr('width', xScale.bandwidth)
        .attr('fill','steelblue');
};

render(data);

/*
// import {select} from 'd3'; // ES6 syntax, need to fix

const circle = svg.append('circle');
circle
    .attr('r', height / 2) // attr() returns the d3 selection it is called on, method chaining
    .attr('cx', width / 2)
    .attr('cy', height / 2)
    .attr('fill', 'lightgray')
    .attr('stroke', 'black');

const g=svg.append('g').attr('transform',`translate(${width/2},${height/2})`)
const curve = g.append("path")
    .attr('d', d3.arc()({
        innerRadius: 80,
        outerRadius: 100,
        startAngle: Math.PI/2,
        endAngle: Math.PI*3/2
    }))
*/

