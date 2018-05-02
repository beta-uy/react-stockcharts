import React, { Component } from "react";
import PropTypes from "prop-types";

import GenericChartComponent from "../GenericChartComponent";
import { getMouseCanvas } from "../GenericComponent";

import { isNotDefined, isDefined, functor, hexToRGBA } from "../utils";

import LabelAnnotation, {
    defaultProps,
    helper as labelHelper,
} from "../annotation/LabelAnnotation";

class AxisYCenteredTitle extends Component {
    constructor(props) {
        super(props);
        this.renderSVG = this.renderSVG.bind(this);
        this.drawOnCanvas = this.drawOnCanvas.bind(this);
    }
    drawOnCanvas(ctx, moreProps) {
        if (isNotDefined(moreProps.currentItem)) {
            return null;
        }
        const props = {
            ...this.props,
            text: this.props.renderValue(this.props.yAccessor(moreProps.currentItem)),
        };
        drawOnCanvas2(ctx, props, this.context, moreProps);
    }
    renderSVG(moreProps) {
        const props = helper(this.props, moreProps);
        if (isNotDefined(props)) return null;

        const { chartConfig } = moreProps;

        return (
            <LabelAnnotation
                yScale={getYScale(chartConfig)}
                {...this.props}
                text={getText(this.props)}
            />
        );
    }

    render() {
        return (
            <GenericChartComponent
                clip={false}
                svgDraw={this.renderSVG}
                canvasDraw={this.drawOnCanvas}
                canvasToDraw={getMouseCanvas}
                drawOn={["mousemove", "pan", "drag"]}
            />
        );
    }
}

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
    y: PropTypes.oneOfType([PropTypes.number, PropTypes.func]),
};

function customX(props, moreProps) {
    const { xScale, xAccessor, currentItem, mouseXY } = moreProps;
    const { snapX } = props;
    const x = snapX ? xScale(xAccessor(currentItem)) : mouseXY[0];

    const { displayXAccessor } = moreProps;
    const { displayFormat } = props;
    const coordinate = snapX
        ? displayFormat(displayXAccessor(currentItem))
        : displayFormat(xScale.invert(x));
    return { x, coordinate };
}

AxisYCenteredTitle.defaultProps = {
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
    customX: customX,

    ...defaultProps,
    selectCanvas: canvases => canvases.bg,
};

AxisYCenteredTitle.contextTypes = {
    canvasOriginX: PropTypes.number,
    canvasOriginY: PropTypes.number,

    margin: PropTypes.object.isRequired,
    ratio: PropTypes.number.isRequired,
};

function getText(props) {
    return functor(props.text)(props);
}

function getYScale(chartConfig) {
    return Array.isArray(chartConfig) ? undefined : chartConfig.yScale;
}

function helper(props, moreProps) {
    const { show, currentItem } = moreProps;
    const {
        chartConfig: { height },
    } = moreProps;

    if (isNotDefined(currentItem)) return null;

    const { customX } = props;

    const { orient, at } = props;
    const { stroke, strokeOpacity, strokeWidth } = props;
    const { rectRadius, rectWidth, rectHeight } = props;
    const { fill, opacity, fontFamily, fontSize, fontWeight, textFill } = props;

    const edgeAt = at === "bottom" ? height : 0;

    const { x, coordinate } = customX(props, moreProps);

    const type = "vertical";
    const y1 = 0,
        y2 = height;
    const hideLine = true;

    const coordinateProps = {
        coordinate,
        show,
        type,
        orient,
        edgeAt,
        hideLine,
        fill,
        opacity,
        fontFamily,
        fontSize,
        fontWeight,
        textFill,
        stroke,
        strokeOpacity,
        strokeWidth,
        rectWidth,
        rectHeight,
        rectRadius,
        arrowWidth: 0,
        x1: x,
        x2: x,
        y1,
        y2,
    };
    return coordinateProps;
}

function drawOnCanvas2(ctx, props, context, moreProps) {
    ctx.save();

    const { canvasOriginX, canvasOriginY, margin, ratio } = context;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(ratio, ratio);

    if (isDefined(canvasOriginX)) ctx.translate(canvasOriginX, canvasOriginY);
    else ctx.translate(margin.left + 0.5 * ratio, margin.top + 0.5 * ratio);

    drawOnCanvas(ctx, props, moreProps);

    ctx.restore();
}

function drawOnCanvas(ctx, props, moreProps) {
    const { textAnchor, fontFamily, fontSize, opacity, rotate } = props;
    const { xScale, chartConfig, xAccessor } = moreProps;

    const { xPos, yPos, fill, text } = labelHelper(
        props,
        xAccessor,
        xScale,
        getYScale(chartConfig),
    );

    const radians = rotate / 180 * Math.PI;
    ctx.save();
    ctx.translate(xPos, yPos);
    ctx.rotate(radians);

    ctx.font = `${fontSize}px ${fontFamily}`;
    ctx.fillStyle = hexToRGBA(fill, opacity);
    ctx.textAlign = textAnchor === "middle" ? "center" : textAnchor;

    ctx.beginPath();
    ctx.fillText(text, 0, 0);
    ctx.restore();
}

export default AxisYCenteredTitle;
