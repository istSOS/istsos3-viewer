import React, { Component } from 'react';
import { connect } from 'react-redux';

import {
    addSensor,
    removeSensor,
    applyObsPropFilter
} from './viewerAction';
import config from '../config';
import ViewerComponent from './viewerComponent';

// istSOS core components
import {
    fetchSensors
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
        addSensor: (sensor) => {
            dispatch(addSensor(sensor));
        },
        removeSensor: (idx) => {
            dispatch(removeSensor(idx));
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
