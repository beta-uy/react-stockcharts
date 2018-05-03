var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// Based on: https://github.com/rrag/react-stockcharts/blob/master/src/lib/coordinates/AxisXCursor.js

import React, { Component } from "react";
import PropTypes from "prop-types";
import GenericComponent, { getMouseCanvas } from "../GenericComponent";

import { hexToRGBA, isDefined, isNotDefined, strokeDashTypes, getStrokeDasharray } from "../utils";

var AxisXCursor = function (_Component) {
  _inherits(AxisXCursor, _Component);

  function AxisXCursor(props) {
    _classCallCheck(this, AxisXCursor);

    var _this = _possibleConstructorReturn(this, (AxisXCursor.__proto__ || Object.getPrototypeOf(AxisXCursor)).call(this, props));

    _this.renderSVG = _this.renderSVG.bind(_this);
    _this.drawOnCanvas = _this.drawOnCanvas.bind(_this);
    return _this;
  }

  _createClass(AxisXCursor, [{
    key: "drawOnCanvas",
    value: function drawOnCanvas(ctx, moreProps) {
      var line = helper(this.props, moreProps);

      if (isDefined(line)) {
        var _context = this.context,
            margin = _context.margin,
            ratio = _context.ratio;

        var originX = 0.5 * ratio + margin.left;
        var originY = 0.5 * ratio + margin.top;

        ctx.save();
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.scale(ratio, ratio);

        ctx.translate(originX, originY);

        var dashArray = getStrokeDasharray(line.strokeDasharray).split(",").map(function (d) {
          return +d;
        });

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
  }, {
    key: "renderSVG",
    value: function renderSVG(moreProps) {
      var className = this.props.className;

      var line = helper(this.props, moreProps);

      if (isNotDefined(line)) return null;

      var _props = this.props,
          strokeDasharray = _props.strokeDasharray,
          rest = _objectWithoutProperties(_props, ["strokeDasharray"]);

      return React.createElement(
        "g",
        { className: "react-stockcharts-crosshair " + className },
        React.createElement("line", _extends({}, rest, { strokeDasharray: getStrokeDasharray(strokeDasharray) }))
      );
    }
  }, {
    key: "render",
    value: function render() {
      return React.createElement(GenericComponent, {
        svgDraw: this.renderSVG,
        clip: false,
        canvasDraw: this.drawOnCanvas,
        canvasToDraw: getMouseCanvas,
        drawOn: ["mousemove", "pan", "drag"]
      });
    }
  }]);

  return AxisXCursor;
}(Component);

AxisXCursor.propTypes = {
  className: PropTypes.string,
  strokeDasharray: PropTypes.oneOf(strokeDashTypes)
};

AxisXCursor.contextTypes = {
  margin: PropTypes.object.isRequired,
  ratio: PropTypes.number.isRequired
  // xScale for getting update event upon pan end, this is needed to get past the PureComponent shouldComponentUpdate
  // xScale: PropTypes.func.isRequired,
};

function customX(props, moreProps) {
  var xScale = moreProps.xScale,
      xAccessor = moreProps.xAccessor,
      currentItem = moreProps.currentItem,
      mouseXY = moreProps.mouseXY;
  var snapX = props.snapX;

  var x = snapX ? Math.round(xScale(xAccessor(currentItem))) : mouseXY[0];
  return x;
}

AxisXCursor.defaultProps = {
  stroke: "#0f0",
  opacity: 1,
  strokeDasharray: "none",
  snapX: true,
  customX: customX
};

function helper(props, moreProps) {
  var currentItem = moreProps.currentItem,
      show = moreProps.show,
      height = moreProps.height;
  var customX = props.customX,
      stroke = props.stroke,
      opacity = props.opacity,
      strokeDasharray = props.strokeDasharray,
      strokeWidth = props.strokeWidth;


  if (!show || isNotDefined(currentItem)) return null;

  var x = customX(props, moreProps);

  var line2 = {
    x1: x,
    x2: x,
    y1: 0,
    y2: height,
    stroke: stroke,
    strokeWidth: strokeWidth,
    strokeDasharray: strokeDasharray,
    opacity: opacity
  };
  return line2;
}

export default AxisXCursor;
//# sourceMappingURL=AxisXCursor.js.map