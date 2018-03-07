import React, { Component } from 'react';
import { connect } from 'react-redux';
import config from '../config';

import {
    setRange,
    resetChart,
    observedPropertySelected1,
    observedPropertySelected2,
    itemOver,
    chartClick,
    resetBrush,
    setBrushStart,
    setBrushEnd,
    trendVisible,
    s1Type,
    s2Type
} from '../actions';

// istSOS core components
import {
    fetchObservations
} from 'istsos3-core';

import ChartComponent from './chartComponent';

class Chart extends Component {
    render() {
        return(
            <ChartComponent
                {...this.props}/>
        );
    }
};

const mapStateToProps = (state, ownProps) => {
    return {
        viewer: state.viewer,
        // chart: state.viewer_chart,
        //basket: state.viewer_basket,
        //observed_properties: state.viewer_basket.observed_properties,
        ...ownProps
    };
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        dispatch: dispatch,
        resetChart: () => {
            dispatch(resetChart());
        },
        setRange: (range) => {
            dispatch(setRange(range));
        },
        resetBrush: () => {
            dispatch(resetBrush());
        },
        chartClick: (item) => {
            dispatch(chartClick(item));
        },
        setBrushStart: (start) => {
            dispatch(setBrushStart(start));
        },
        setBrushEnd: (end) => {
            dispatch(setBrushEnd(end));
        },
        itemOver: (item) => {
            dispatch(itemOver(item));
        },
        observedPropertySelected1: (selected) => {
            dispatch(observedPropertySelected1(selected));
        },
        observedPropertySelected2: (selected) => {
            dispatch(observedPropertySelected2(selected));
        },
        trendVisible: (visibility) => {
            dispatch(trendVisible(visibility));
        },
        s1Type: (chart) => {
            dispatch(s1Type(chart));
        },
        s2Type: (chart) => {
            dispatch(s2Type(chart));
        },
        fetchObservations: (data = {}) => {
            dispatch(fetchObservations({
                data: data,
                name: config.name
            }));
        }
    }
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Chart);
