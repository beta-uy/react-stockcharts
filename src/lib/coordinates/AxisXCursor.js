// Based on: https://github.com/rrag/react-stockcharts/blob/master/src/lib/coordinates/AxisXCursor.js

import React, { Component } from "react";
import PropTypes from "prop-types";
import GenericComponent, { getMouseCanvas } from "../GenericComponent";

import {
  hexToRGBA,
  isDefined,
  isNotDefined,
  strokeDashTypes,
  getStrokeDasharray,
} from "react-stockcharts/lib/utils";

class AxisXCursor extends Component {
  constructor(props) {
    super(props);
    this.renderSVG = this.renderSVG.bind(this);
    this.drawOnCanvas = this.drawOnCanvas.bind(this);
  }
  drawOnCanvas(ctx, moreProps) {
    const line = helper(this.props, moreProps);

    if (isDefined(line)) {
      const { margin, ratio } = this.context;
      const originX = 0.5 * ratio + margin.left;
      const originY = 0.5 * ratio + margin.top;

      ctx.save();
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(ratio, ratio);

      ctx.translate(originX, originY);

      const dashArray = getStrokeDasharray(line.strokeDasharray)
        .split(",")
        .map(d => +d);

      ctx.strokeStyle = hexToRGBA(line.stroke, line.opacity);
      ctx.setLineDash(dashArray);
      ctx.beginPath();
      ctx.moveTo(line.x1, line.y1);
      ctx.lineTo(line.x2, line.y2);
      ctx.lineWidth = line.strokeWidth;
      ctx.stroke();

      ctx.restore();
    }
  }
  renderSVG(moreProps) {
    const { className } = this.props;
    const line = helper(this.props, moreProps);

    if (isNotDefined(line)) return null;

    const { strokeDasharray, ...rest } = this.props;

    return (
      <g className={`react-stockcharts-crosshair ${className}`}>
        <line {...rest} strokeDasharray={getStrokeDasharray(strokeDasharray)} />
      </g>
    );
  }
  render() {
    return (
      <GenericComponent
        svgDraw={this.renderSVG}
        clip={false}
        canvasDraw={this.drawOnCanvas}
        canvasToDraw={getMouseCanvas}
        drawOn={["mousemove", "pan", "drag"]}
      />
    );
  }
}

AxisXCursor.propTypes = {
  className: PropTypes.string,
  strokeDasharray: PropTypes.oneOf(strokeDashTypes),
};

AxisXCursor.contextTypes = {
  margin: PropTypes.object.isRequired,
  ratio: PropTypes.number.isRequired,
  // xScale for getting update event upon pan end, this is needed to get past the PureComponent shouldComponentUpdate
  // xScale: PropTypes.func.isRequired,
};

function customX(props, moreProps) {
  const { xScale, xAccessor, currentItem, mouseXY } = moreProps;
  const { snapX } = props;
  const x = snapX ? Math.round(xScale(xAccessor(currentItem))) : mouseXY[0];
  return x;
}

AxisXCursor.defaultProps = {
  stroke: "#0f0",
  opacity: 1,
  strokeDasharray: "none",
  snapX: true,
  customX,
};

function helper(props, moreProps) {
  const { currentItem, show, height } = moreProps;

  const { customX, stroke, opacity, strokeDasharray, strokeWidth } = props;

  if (!show || isNotDefined(currentItem)) return null;

  const x = customX(props, moreProps);

  const line2 = {
    x1: x,
    x2: x,
    y1: 0,
    y2: height,
    stroke,
    strokeWidth,
    strokeDasharray,
    opacity,
  };
  return line2;
}

export default AxisXCursor;
