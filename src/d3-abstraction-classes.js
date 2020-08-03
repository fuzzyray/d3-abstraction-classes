/*
 Abstraction classes for D3 to support generating charts/maps quickly without
 getting into the minutia of laying out all of the SVG elements.

 Written for the freeCodeCamp Data Visualization projects so I would quit
 writing essentially the same code repeatedly.

 tooltips are provided by d3-tip.js
 https://github.com/caged/d3-tip

 License: MIT
 */

class D3Object {
  /*
   Defaults to a width of 1000px with an aspect ratio of 16:9
   Use width and/or aspectRatio to dynamically set height
   Use height and width to just set the size of the chart
   Margins default to 10%, either pass an margins object or call setMargins to adjust with a percentage
   Call setLabels to change the labels from default or pass a full labels object
   */
  constructor(props = {}) {
    const aspectRatio = (props.hasOwnProperty('aspectRatio'))
        ? props.aspectRatio
        : 16 / 9;
    const width = (props.hasOwnProperty('width'))
        ? props.width
        : 1000;
    const height = (props.hasOwnProperty('height'))
        ? props.height
        : width / aspectRatio;
    const margins = (props.hasOwnProperty('margins'))
        ? props.margins
        : {
          top: height * 0.1,
          right: width * 0.1,
          bottom: height * 0.1,
          left: width * 0.1,
        };
    const labels = (props.hasOwnProperty('labels'))
        ? props.labels
        : {
          className: 'labels',
          header: {id: 'header', text: 'Header'},
          footer: {id: 'footer', text: 'Footer'},
          left: {id: 'left-label', text: 'Left Label'},
          right: {id: 'right-label', text: 'Right Label'},
        };
    const tooltips = (props.hasOwnProperty('tooltips'))
        ? props.tooltips
        : false;

    // Don't require the className for label objects to be passed
    if (!labels.hasOwnProperty('className')) {
      labels.className = 'labels';
    }
    this.height = height;
    this.width = width;
    this.margins = margins;
    this.labels = labels;
    this.tooltips = tooltips;
  }

  get displayHeight() {
    return this.height - (this.margins.top + this.margins.bottom);
  }

  get displayWidth() {
    return this.width - (this.margins.left + this.margins.right);
  }

  static calculateMargins(percentage, height, width) {
    const percentValue = (percentage < 1)
        ? percentage
        : percentage / 100;
    const margins = {};
    margins.top = height * percentValue;
    margins.right = width * percentValue;
    margins.bottom = height * percentValue;
    margins.left = width * percentValue;
    return margins;
  }

  setMargins(percentage = 10) {
    this.margins = D3Object.calculateMargins(percentage, this.height,
        this.width);
  }

  setLabels(labels = {}) {
    const myLabels = Object.keys(this.labels);
    Object.keys(labels).forEach(k1 => {
      if (myLabels.includes(k1)) {
        const myKeys = Object.keys(this.labels[k1]);
        Object.keys(labels[k1]).forEach(k2 => {
          if (myKeys.includes(k2)) {
            this.labels[k1][k2] = labels[k1][k2];
          }
        });
      }
    });
  }

  renderD3Object(divID, className) {
    this.svg = d3.select(divID)
        .append('svg')
        .attr('class', className)
        .attr('viewBox', `0 0 ${this.width} ${this.height}`)
        .attr('preserveAspectRatio', 'xMidYMid meet');
    this.displayArea = this.svg.append('g').attr('transform',
        `translate(${this.margins.left}, ${this.margins.top})`);
    if (this.tooltips) {
      this.tip = d3.tip().attr('class', 'd3-tip');
      this.svg.call(this.tip);
    }
  }

  // TODO: Lot's of duplicated code, needs to be abstracted even higher
  renderHeader({text = '', id = ''}) {
    if (text === '') {
      return;
    }
    const headerHeight = this.margins.top;
    const headerWidth = this.displayWidth;
    const headerMargins = D3Object.calculateMargins(5, headerHeight,
        headerWidth);
    const headerAreaX = this.margins.right + headerMargins.right;
    const headerAreaY = headerMargins.top;
    const headerAreaHeight = headerHeight -
        (headerMargins.top + headerMargins.bottom);
    const headerAreaWidth = headerWidth -
        (headerMargins.right + headerMargins.left);

    this.svg.append('text')
        .attr('id', id)
        .attr('class', this.labels.className)
        .attr('font-size', headerAreaHeight / 2)
        .attr('x', headerAreaX + (headerAreaWidth / 2))
        .attr('y', headerAreaY + (headerAreaHeight / 4))
        .attr('text-anchor', 'middle')
        .attr('dominant-baseline', 'middle')
        .text(text);
  }

  renderSubHeader({text = '', id = ''}) {
    if (text === '') {
      return;
    }
    const headerHeight = this.margins.top;
    const headerWidth = this.displayWidth;
    const headerMargins = D3Object.calculateMargins(5, headerHeight,
        headerWidth);
    const headerAreaX = this.margins.right + headerMargins.right;
    const headerAreaY = headerMargins.top;
    const headerAreaHeight = headerHeight -
        (headerMargins.top + headerMargins.bottom);
    const headerAreaWidth = headerWidth -
        (headerMargins.right + headerMargins.left);

    this.svg.append('text')
        .attr('id', id)
        .attr('class', this.labels.className)
        .attr('font-size', headerAreaHeight / 4)
        .attr('x', headerAreaX + (headerAreaWidth / 2))
        .attr('y', headerAreaY + (headerAreaHeight * 3 / 4))
        .attr('text-anchor', 'middle')
        .attr('dominant-baseline', 'middle')
        .text(text);

  }

  renderRightLabel({text = '', id = ''}) {
    if (text === '') {
      return;
    }
    const rightLabelHeight = this.displayHeight;
    const rightLabelWidth = this.margins.right;
    const rightLabelMargins = D3Object.calculateMargins(5, rightLabelHeight,
        rightLabelWidth);
    const rightAreaX = this.width - (rightLabelWidth + rightLabelMargins.left);
    const rightAreaY = this.margins.top + rightLabelMargins.top;
    const rightAreaHeight = rightLabelHeight -
        (rightLabelMargins.top + rightLabelMargins.bottom);
    const rightAreaWidth = (rightLabelWidth -
        (rightLabelMargins.right + rightLabelMargins.left)) / 2;
    const rightLabelX = rightAreaX + (rightAreaWidth / 2);
    const rightLabelY = rightAreaY + (rightAreaHeight / 2);

    this.svg.append('text')
        .attr('id', id)
        .attr('class', this.labels.className)
        .attr('font-size', rightAreaWidth / 2)
        .attr('x', rightLabelX)
        .attr('y', rightLabelY)
        .attr('text-anchor', 'middle')
        .attr('dominant-baseline', 'middle')
        .attr('transform', `rotate(90, ${rightLabelX}, ${rightLabelY})`)
        .text(text);
  }

  renderLeftLabel({text = '', id = ''}) {
    if (text === '') {
      return;
    }
    const leftLabelHeight = this.displayHeight;
    const leftLabelWidth = this.margins.left;
    const leftLabelMargins = D3Object.calculateMargins(5, leftLabelHeight,
        leftLabelWidth);
    const leftAreaX = leftLabelMargins.left;
    const leftAreaY = this.margins.top + leftLabelMargins.top;
    const leftAreaHeight = leftLabelHeight -
        (leftLabelMargins.top + leftLabelMargins.bottom);
    const leftAreaWidth = (leftLabelWidth -
        (leftLabelMargins.right + leftLabelMargins.left)) / 2;
    const leftLabelX = leftAreaX + (leftAreaWidth / 2);
    const leftLabelY = leftAreaY + (leftAreaHeight / 2);

    this.svg.append('text')
        .attr('id', id)
        .attr('class', this.labels.className)
        .attr('font-size', leftAreaWidth / 2)
        .attr('x', leftLabelX)
        .attr('y', leftLabelY)
        .attr('text-anchor', 'middle')
        .attr('dominant-baseline', 'middle')
        .attr('transform', `rotate(-90, ${leftLabelX}, ${leftLabelY})`)
        .text(text);
  }

  renderFooter({text = '', id = ''}) {
    if (text === '') {
      return;
    }
    const footerHeight = this.margins.bottom / 1.5;
    const footerWidth = this.displayWidth;
    const footerMargins = D3Object.calculateMargins(5, footerHeight,
        footerWidth);
    const footerAreaX = this.margins.right + footerMargins.right;
    const footerAreaY = (this.height - footerHeight) + footerMargins.top;
    const footerAreaHeight = footerHeight -
        (footerMargins.top + footerMargins.bottom);
    const footerAreaWidth = footerWidth -
        (footerMargins.right + footerMargins.left);

    this.svg.append('text')
        .attr('id', id)
        .attr('class', this.labels.className)
        .attr('font-size', footerAreaHeight / 2)
        .attr('x', footerAreaX + (footerAreaWidth / 2))
        .attr('y', footerAreaY + (footerAreaHeight / 2))
        .attr('text-anchor', 'middle')
        .attr('dominant-baseline', 'middle')
        .text(text);
  }

  renderLabels(labels) {
    this.renderHeader(labels.header);
    this.renderFooter(labels.footer);
    this.renderLeftLabel(labels.left);
    this.renderRightLabel(labels.right);
    if (labels.hasOwnProperty('subheader')) {
      this.renderSubHeader(labels.subheader);
    }
  }

  render(props = {}) {
    const divID = (props.hasOwnProperty('divID')) ? props.divID : '#root';
    const svgClass = (props.hasOwnProperty('svgClass'))
        ? props.svgClass
        : 'D3Object';
    this.renderD3Object(divID, svgClass);
    this.renderLabels(this.labels);
  }
}

class D3Chart extends D3Object {
  constructor(props = {}) {
    super(props);
    this.xAxis = {
      scale: undefined,
      axis: undefined,
      x: undefined,
      y: undefined,
    };
    this.yAxis = {
      scale: undefined,
      axis: undefined,
      x: undefined,
      y: undefined,
    };
  }

  setScale(axis, scale, range, padding) {
    this[axis].scale = scale().range(range);
    if (padding !== undefined) {
      this[axis].scale.padding(padding);
    }
  }

  setDomain(axis, arr) {
    this[axis].scale.domain(arr);
  }

  setAxis(axis, axisFunc) {
    this[axis].axis = axisFunc(this[axis].scale);
  }

  setXYValues() {
    this.xAxis.x = this.margins.right;
    this.xAxis.y = this.height - this.margins.bottom;
    this.yAxis.x = this.margins.right;
    this.yAxis.y = this.margins.top;
  }

  addElementProperties(data, props, element) {
    Object.keys(props).forEach(property => {
      this.displayArea.selectAll(element)
          .data(data)
          .join(element)
          .attr(property, props[property]);
    });
  }

  addToolTips(data, displayFunc, props, tipDirection, element) {
    const tipDisplay = (displayFunc !== undefined)
        ? displayFunc
        : d => d;
    const tipProps = (props !== undefined)
        ? props
        : {};
    const direction = (tipDirection !== undefined)
        ? tipDirection
        : 'n';
    if (!this.tooltips) {
      return;
    }
    this.displayArea.selectAll(element)
        .data(data)
        .join(element)
        .on('mouseover', (d, i, n) => {
          Object.keys(tipProps).forEach(property => {
            if (typeof tipProps[property] === 'function') {
              this.tip.attr(property, tipProps[property](d));
            } else {
              this.tip.attr(property, tipProps[property]);
            }
          });
          this.tip.direction(direction);
          this.tip.html(tipDisplay(d));
          this.tip.show(d, n[i]);
          d3.select(n[i]).style('opacity', '0.5');
        })
        .on('mouseout', (d, i, n) => {
          this.tip.hide(d, n[i]);
          d3.select(n[i]).style('opacity', '1');
        });
  }

  renderAxis(axis, id) {
    if (!this[axis].axis) {
      console.error(`${axis} axis function undefined`);
      return;
    }
    this.svg.append('g')
        .call(this[axis].axis)
        .attr('transform', `translate(${this[axis].x}, ${this[axis].y})`)
        .attr('id', id);
  }

  render(props = {}) {
    const xAxisID = (props.hasOwnProperty('xAxisID')) ?
        props.xAxisID :
        'x-axis';
    const yAxisID = (props.hasOwnProperty('yAxisID')) ?
        props.yAxisID :
        'y-axis';
    super.render(props);
    this.setXYValues();
    this.renderAxis('xAxis', xAxisID);
    this.renderAxis('yAxis', yAxisID);
  }
}

class D3BarChart extends D3Chart {
  constructor(props = {}) {
    super(props);
  }

  addElementProperties(data, props) {
    super.addElementProperties(data, props, 'rect');
  }

  addToolTips(data, displayFunc, props, tipDirection) {
    super.addToolTips(data, displayFunc, props, tipDirection, 'rect');
  }

  renderBars(data, className, xValue, yValue, barWidth) {
    if (!this.xAxis.scale || !this.yAxis.scale) {
      console.error('scale not defined');
      return;
    }
    this.displayArea.selectAll('rect')
        .data(data)
        .enter()
        .append('rect')
        .attr('class', className)
        .attr('height', d => this.displayHeight - this.yAxis.scale(yValue(d)))
        .attr('width', barWidth)
        .attr('x', d => this.xAxis.scale(xValue(d)))
        .attr('y', d => this.yAxis.scale(yValue(d)));
  }

  render(props = {}) {
    const data = (props.hasOwnProperty('data'))
        ? props.data
        : [];
    const barClassName = (props.hasOwnProperty('barClassName'))
        ? props.barClassName
        : 'bar';
    const xValue = (props.hasOwnProperty('xValue'))
        ? props.xValue
        : d => d[0];
    const yValue = (props.hasOwnProperty('yValue'))
        ? props.yValue
        : d => d[1];
    const barWidth = (props.hasOwnProperty('barWidth'))
        ? props.barWidth
        : this.displayWidth / data.length;
    super.render(props);
    this.renderBars(data, barClassName, xValue, yValue, barWidth);
  }
}

class D3ScatterPlot extends D3Chart {
  constructor(props = {}) {
    super(props);
  }

  addElementProperties(data, props) {
    super.addElementProperties(data, props, 'circle');
  }

  addToolTips(data, displayFunc, props, tipDirection) {
    super.addToolTips(data, displayFunc, props, tipDirection, 'circle');
  }

  renderDots(data, className, xValue, yValue, radius) {
    if (!this.xAxis.scale || !this.yAxis.scale) {
      console.error('scale not defined');
      return;
    }
    this.displayArea.selectAll('circle')
        .data(data)
        .enter()
        .append('circle')
        .attr('class', className)
        .attr('r', radius)
        .attr('cx', d => this.xAxis.scale(xValue(d)))
        .attr('cy', d => this.yAxis.scale(yValue(d)));
  }

  render(props = {}) {
    const data = (props.hasOwnProperty('data')) ? props.data : [];
    const dotClassName = (props.hasOwnProperty('dotClassName'))
        ? props.dotClassName
        : 'dot';
    const xValue = (props.hasOwnProperty('xValue')) ? props.xValue : d => d[0];
    const yValue = (props.hasOwnProperty('yValue')) ? props.yValue : d => d[1];
    const radius = (props.hasOwnProperty('radius')) ? props.radius : 5;
    super.render(props);
    this.renderDots(data, dotClassName, xValue, yValue, radius);
  }
}
