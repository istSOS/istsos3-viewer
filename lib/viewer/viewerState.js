
const initialState = {
    isFetching: false,
    mode: 0,
    filter: {},
    data: [],
    ids: [],
    observed_properties: []
};

const viewer_basket = (state = initialState, action) => {
    let copy, opCheck, sensor, i, ii, op;
    switch (action.type) {
        case 'VIEWER_ADD_SENSOR':
            copy = {
                ...state
            }
            copy.data.push(action.sensor);
            copy.ids.push(action.sensor.id);
            copy.observed_properties = [];
            opCheck = [];
            for (i = 0; i < copy.data.length; i++) {
                sensor = copy.data[i];
                for (ii = 0; ii < sensor.observable_properties.length; ii++) {
                    op = sensor.observable_properties[ii];
                    if(opCheck.indexOf(op.definition)===-1){
                        opCheck.push(op.definition);
                        copy.observed_properties.push(op);
                    }
                }
            }
            return copy;

        case 'VIEWER_REMOVE_SENSOR':
            copy = {
                ...state
            }
            copy.data.splice(action.index, 1);
            copy.ids.splice(action.index, 1);
            copy.observed_properties = [];
            opCheck = [];
            for (i = 0; i < copy.data.length; i++) {
                sensor = copy.data[i];
                for (ii = 0; ii < sensor.observable_properties.length; ii++) {
                    op = sensor.observable_properties[ii];
                    if(opCheck.indexOf(op.definition)===-1){
                        opCheck.push(op.definition);
                        copy.observed_properties.push(op);
                    }
                }
            }
            return copy;

        case 'VIEWER_APPLY_OBSP_PROP_FILTER':
            return {
                ...state,
                filter: {
                    ...state.filter,
                    observedProperties: action.observedProperties
                }
            };

        case 'VIEWER_SET_MODE':
            return {
                ...state,
                mode: action.mode
            };

        default:
            return state;

    }
};

export default viewer_basket;
