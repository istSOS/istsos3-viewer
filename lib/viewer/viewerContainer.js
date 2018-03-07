import React, { Component } from 'react';
import { connect } from 'react-redux';

import {
    addSensor,
    removeSensor,
    applyObsPropFilter,
    setMode,
    setAxisDomain,
    setRange,
    resetChart,
    observedPropertySelected1,
    observedPropertySelected2,
    uomSelected1,
    uomSelected2,
    swapObsProp,
    resetObsProp2,
    resetUom2,
    swapUoms
} from '../actions';

import config from '../config';
import ViewerComponent from './viewerComponent';

// istSOS core components
import {
    fetchSensors,
    fetchObservableProperties,
    fetchObservations
} from 'istsos3-core';

class Viewer extends Component {

    componentDidMount(){
        const {
            viewer,
            fetchSensors,
            fetchObservableProperties
        } = this.props;
        fetchObservableProperties();
        if(viewer.search_results.length===0){
            fetchSensors();
        }
    }

    render() {
        return(
            <ViewerComponent
                {...this.props}/>
        );
    }
};

const mapStateToProps = (state, ownProps) => {
    return {
        viewer: state.viewer,
        observed_properties: state.observed_properties,
        //sensors: state.viewer_search_result,
        //chart: state.viewer_chart,
        map: state.core_map
    };
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        dispatch: dispatch,
        fetchSensors: (filters = undefined) => {
            dispatch(fetchSensors({
                filters: filters,
                ...config
            }));
        },
        fetchObservations: (data = {}) => {
            dispatch(
                fetchObservations(
                    data, config.name
                )
            );
        },
        fetchObservableProperties: () => {
            dispatch(
                fetchObservableProperties()
            );
        },
        setRange: (range) => {
            dispatch(setRange(range));
        },
        setMode: (mode) => {
            dispatch(setMode(mode));
        },
        setAxisDomain: (axisDomain) => {
            dispatch(setAxisDomain(axisDomain));
        },
        addSensor: (sensor) => {
            dispatch(addSensor(sensor));
        },
        removeSensor: (sensor) => {
            dispatch(removeSensor(sensor));
        },
        applyObsPropFilter: (filters) => {
            dispatch(applyObsPropFilter(filters));
        },
        resetChart: () => {
            dispatch(resetChart());
        },
        observedPropertySelected1: (selected) => {
            dispatch(observedPropertySelected1(selected));
        },
        observedPropertySelected2: (selected) => {
            dispatch(observedPropertySelected2(selected));
        },
        swapObsProp: () => {
            dispatch(swapObsProp());
        },
        resetObsProp2: () => {
            dispatch(resetObsProp2());
        },
        swapUoms: () => {
            dispatch(swapUoms());
        },
        resetUom2: () => {
            dispatch(resetUom2());
        },
        uomSelected1: (selected) => {
            dispatch(uomSelected1(selected));
        },
        uomSelected2: (selected) => {
            dispatch(uomSelected2(selected));
        }
    }
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Viewer);
