export const addSensor = (sensor) => {
    return {
        type: 'VIEWER_ADD_SENSOR',
        sensor: sensor
    }
};

export const removeSensor = (index) => {
    return {
        type: 'VIEWER_REMOVE_SENSOR',
        index: index
    }
};

export const applyObsPropFilter = (observedProperties) => {
    return {
        type: 'VIEWER_APPLY_OBSP_PROP_FILTER',
        observedProperties: observedProperties
    }
};

export const setMode = (mode) => {
    return {
        type: 'VIEWER_SET_MODE',
        mode: mode
    }
};
