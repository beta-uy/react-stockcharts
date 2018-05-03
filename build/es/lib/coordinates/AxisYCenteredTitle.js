var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React, { Component } from "react";
import PropTypes from "prop-types";

import GenericChartComponent from "../GenericChartComponent";
import { getMouseCanvas } from "../GenericComponent";

import { isNotDefined, isDefined, functor, hexToRGBA } from "../utils";

import LabelAnnotation, { defaultProps, helper as labelHelper } from "../annotation/LabelAnnotation";

var AxisYCenteredTitle = function (_Component) {
    _inherits(AxisYCenteredTitle, _Component);

    function AxisYCenteredTitle(props) {
        _classCallCheck(this, AxisYCenteredTitle);

        var _this = _possibleConstructorReturn(this, (AxisYCenteredTitle.__proto__ || Object.getPrototypeOf(AxisYCenteredTitle)).call(this, props));

        _this.renderSVG = _this.renderSVG.bind(_this);
        _this.drawOnCanvas = _this.drawOnCanvas.bind(_this);
        return _this;
    }

    _createClass(AxisYCenteredTitle, [{
        key: "drawOnCanvas",
        value: function drawOnCanvas(ctx, moreProps) {
            if (isNotDefined(moreProps.currentItem)) {
                return null;
            }
            var props = _extends({}, this.props, {
                text: this.props.renderValue(this.props.yAccessor(moreProps.currentItem))
            });
            drawOnCanvas2(ctx, props, this.context, moreProps);
        }
    }, {
        key: "renderSVG",
        value: function renderSVG(moreProps) {
            var props = helper(this.props, moreProps);
            if (isNotDefined(props)) return null;

            var chartConfig = moreProps.chartConfig;


            return React.createElement(LabelAnnotation, _extends({
                yScale: getYScale(chartConfig)
            }, this.props, {
                text: getText(this.props)
            }));
        }
    }, {
        key: "render",
        value: function render() {
            return React.createElement(GenericChartComponent, {
                clip: false,
                svgDraw: this.renderSVG,
                canvasDraw: this.drawOnCanvas,
                canvasToDraw: getMouseCanvas,
                drawOn: ["mousemove", "pan", "drag"]
            });
        }
    }]);

    return AxisYCenteredTitle;
}(Component);

AxisYCenteredTitle.propTypes = {
    displayFormat: PropTypes.func.isRequired,
    yAxisPad: PropTypes.number,
    rectWidth: PropTypes.number,
    rectHeight: PropTypes.number,
    orient: PropTypes.oneOf(["bottom", "top", "left", "right"]),
    at: PropTypes.oneOf(["bottom", "top", "left", "right"]),
    fill: PropTypes.string,
    opacity: PropTypes.number,
    fontFamily: PropTypes.string,
    fontSize: PropTypes.number,
    textFill: PropTypes.string,
    snapX: PropTypes.bool,
    className: PropTypes.string,
    selectCanvas: PropTypes.func,
    text: PropTypes.oneOfType([PropTypes.string, PropTypes.func]).isRequired,
    textAnchor: PropTypes.string,
    rotate: PropTypes.number,
    onClick: PropTypes.func,
    xAccessor: PropTypes.func,
    yAccessor: PropTypes.func,
    xScale: PropTypes.func,
    yScale: PropTypes.func,
    renderValue: PropTypes.func.isRequired,
    datum: PropTypes.object,
    x: PropTypes.oneOfType([PropTypes.number, PropTypes.func]),
    y: PropTypes.oneOfType([PropTypes.number, PropTypes.func])
};

function customX(props, moreProps) {
    var xScale = moreProps.xScale,
        xAccessor = moreProps.xAccessor,
        currentItem = moreProps.currentItem,
        mouseXY = moreProps.mouseXY;
    var snapX = props.snapX;

    var x = snapX ? xScale(xAccessor(currentItem)) : mouseXY[0];

    var displayXAccessor = moreProps.displayXAccessor;
    var displayFormat = props.displayFormat;

    var coordinate = snapX ? displayFormat(displayXAccessor(currentItem)) : displayFormat(xScale.invert(x));
    return { x: x, coordinate: coordinate };
}

AxisYCenteredTitle.defaultProps = _extends({
    yAxisPad: 0,
    rectWidth: 80,
    rectHeight: 20,

    // rectRadius: 5,
    // stroke: "#684F1D",
    strokeOpacity: 1,
    strokeWidth: 1,

    orient: "bottom",
    at: "bottom",

    fill: "#525252",
    opacity: 1,
    fontFamily: "Helvetica Neue, Helvetica, Arial, sans-serif",
    fontSize: 13,
    textFill: "#FFFFFF",
    snapX: true,
    customX: customX

}, defaultProps, {
    selectCanvas: function selectCanvas(canvases) {
        return canvases.bg;
    }
});

AxisYCenteredTitle.contextTypes = {
    canvasOriginX: PropTypes.number,
    canvasOriginY: PropTypes.number,

    margin: PropTypes.object.isRequired,
    ratio: PropTypes.number.isRequired
};

function getText(props) {
    return functor(props.text)(props);
}

function getYScale(chartConfig) {
    return Array.isArray(chartConfig) ? undefined : chartConfig.yScale;
}

function helper(props, moreProps) {
    var show = moreProps.show,
        currentItem = moreProps.currentItem;
    var height = moreProps.chartConfig.height;


    if (isNotDefined(currentItem)) return null;

    var customX = props.customX;
    var orient = props.orient,
        at = props.at;
    var stroke = props.stroke,
        strokeOpacity = props.strokeOpacity,
        strokeWidth = props.strokeWidth;
    var rectRadius = props.rectRadius,
        rectWidth = props.rectWidth,
        rectHeight = props.rectHeight;
    var fill = props.fill,
        opacity = props.opacity,
        fontFamily = props.fontFamily,
        fontSize = props.fontSize,
        fontWeight = props.fontWeight,
        textFill = props.textFill;


    var edgeAt = at === "bottom" ? height : 0;

    var _customX = customX(props, moreProps),
        x = _customX.x,
        coordinate = _customX.coordinate;

    var type = "vertical";
    var y1 = 0,
        y2 = height;
    var hideLine = true;

    var coordinateProps = {
        coordinate: coordinate,
        show: show,
        type: type,
        orient: orient,
        edgeAt: edgeAt,
        hideLine: hideLine,
        fill: fill,
        opacity: opacity,
        fontFamily: fontFamily,
        fontSize: fontSize,
        fontWeight: fontWeight,
        textFill: textFill,
        stroke: stroke,
        strokeOpacity: strokeOpacity,
        strokeWidth: strokeWidth,
        rectWidth: rectWidth,
        rectHeight: rectHeight,
        rectRadius: rectRadius,
        arrowWidth: 0,
        x1: x,
        x2: x,
        y1: y1,
        y2: y2
    };
    return coordinateProps;
}

function drawOnCanvas2(ctx, props, context, moreProps) {
    ctx.save();

    var canvasOriginX = context.canvasOriginX,
        canvasOriginY = context.canvasOriginY,
        margin = context.margin,
        ratio = context.ratio;

    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(ratio, ratio);

    if (isDefined(canvasOriginX)) ctx.translate(canvasOriginX, canvasOriginY);else ctx.translate(margin.left + 0.5 * ratio, margin.top + 0.5 * ratio);

    drawOnCanvas(ctx, props, moreProps);

    ctx.restore();
}

function drawOnCanvas(ctx, props, moreProps) {
    var textAnchor = props.textAnchor,
        fontFamily = props.fontFamily,
        fontSize = props.fontSize,
        opacity = props.opacity,
        rotate = props.rotate;
    var xScale = moreProps.xScale,
        chartConfig = moreProps.chartConfig,
        xAccessor = moreProps.xAccessor;

    var _labelHelper = labelHelper(props, xAccessor, xScale, getYScale(chartConfig)),
        xPos = _labelHelper.xPos,
        yPos = _labelHelper.yPos,
        fill = _labelHelper.fill,
        text = _labelHelper.text;

    var radians = rotate / 180 * Math.PI;
    ctx.save();
    ctx.translate(xPos, yPos);
    ctx.rotate(radians);

    ctx.font = fontSize + "px " + fontFamily;
    ctx.fillStyle = hexToRGBA(fill, opacity);
    ctx.textAlign = textAnchor === "middle" ? "center" : textAnchor;

    ctx.beginPath();
    ctx.fillText(text, 0, 0);
    ctx.restore();
}

export default AxisYCenteredTitle;
//# sourceMappingURL=AxisYCenteredTitle.js.map