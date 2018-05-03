"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _propTypes = require("prop-types");

var _propTypes2 = _interopRequireDefault(_propTypes);

var _GenericComponent = require("../GenericComponent");

var _GenericComponent2 = _interopRequireDefault(_GenericComponent);

var _utils = require("../utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } // Based on: https://github.com/rrag/react-stockcharts/blob/master/src/lib/coordinates/AxisXCursor.js

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

      if ((0, _utils.isDefined)(line)) {
        var _context = this.context,
            margin = _context.margin,
            ratio = _context.ratio;

        var originX = 0.5 * ratio + margin.left;
        var originY = 0.5 * ratio + margin.top;

        ctx.save();
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.scale(ratio, ratio);

        ctx.translate(originX, originY);

        var dashArray = (0, _utils.getStrokeDasharray)(line.strokeDasharray).split(",").map(function (d) {
          return +d;
        });

        ctx.strokeStyle = (0, _utils.hexToRGBA)(line.stroke, line.opacity);
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

      if ((0, _utils.isNotDefined)(line)) return null;

      var _props = this.props,
          strokeDasharray = _props.strokeDasharray,
          rest = _objectWithoutProperties(_props, ["strokeDasharray"]);

      return _react2.default.createElement(
        "g",
        { className: "react-stockcharts-crosshair " + className },
        _react2.default.createElement("line", _extends({}, rest, { strokeDasharray: (0, _utils.getStrokeDasharray)(strokeDasharray) }))
      );
    }
  }, {
    key: "render",
    value: function render() {
      return _react2.default.createElement(_GenericComponent2.default, {
        svgDraw: this.renderSVG,
        clip: false,
        canvasDraw: this.drawOnCanvas,
        canvasToDraw: _GenericComponent.getMouseCanvas,
        drawOn: ["mousemove", "pan", "drag"]
      });
    }
  }]);

  return AxisXCursor;
}(_react.Component);

AxisXCursor.propTypes = {
  className: _propTypes2.default.string,
  strokeDasharray: _propTypes2.default.oneOf(_utils.strokeDashTypes)
};

AxisXCursor.contextTypes = {
  margin: _propTypes2.default.object.isRequired,
  ratio: _propTypes2.default.number.isRequired
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


  if (!show || (0, _utils.isNotDefined)(currentItem)) return null;

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

exports.default = AxisXCursor;
//# sourceMappingURL=AxisXCursor.js.map