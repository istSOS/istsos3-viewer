import React, { Component } from 'react';
import { connect } from 'react-redux';
import config from '../config';

import {
    setRange,
    resetChart,
    observedPropertySelected1
} from './chartAction';

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
        chart: state.viewer_chart,
        offerings: state.viewer_basket.data,
        observed_properties: state.viewer_basket.observed_properties,
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
        observedPropertySelected1: (selected) => {
            dispatch(observedPropertySelected1(selected));
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
