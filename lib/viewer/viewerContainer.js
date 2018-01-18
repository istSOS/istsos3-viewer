import React, { Component } from 'react';
import { connect } from 'react-redux';

import {
    addSensor,
    removeSensor,
    applyObsPropFilter,
    setMode
} from './viewerAction';

import {
    setRange,
    resetChart
} from '../chart/chartAction';

import config from '../config';
import ViewerComponent from './viewerComponent';

// istSOS core components
import {
    fetchSensors,
    fetchObservations
} from 'istsos3-core';

class Viewer extends Component {
    render() {
        return(
            <ViewerComponent
                {...this.props}/>
        );
    }
};

const mapStateToProps = (state, ownProps) => {
    return {
        sensors: state.viewer_search_result,
        chart: state.viewer_chart,
        basket: state.viewer_basket
    };
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        dispatch: dispatch,
        fetchSensors: (filters = undefined) => {
            dispatch(fetchSensors({
                filters: filters,
                name: config.name
            }));
        },
        fetchObservations: (data = {}) => {
            dispatch(fetchObservations({
                data: data,
                name: config.name
            }));
        },
        setRange: (range) => {
            dispatch(setRange(range));
        },
        setMode: (mode) => {
            dispatch(setMode(mode));
        },
        addSensor: (sensor) => {
            dispatch(addSensor(sensor));
        },
        removeSensor: (idx, sensors) => {
            dispatch(removeSensor(idx));
            if(idx === 0 && sensors.length===0){
                dispatch(resetChart());
            }
        },
        applyObsPropFilter: (filters) => {
            dispatch(applyObsPropFilter(filters));
        }
    }
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Viewer);
