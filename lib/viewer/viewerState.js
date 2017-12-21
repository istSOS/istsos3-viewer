
const initialState = {
    isFetching: false,
    filter: {},
    data: [],
    ids: []
};

const viewer_basket = (state = initialState, action) => {
    let copy;
    switch (action.type) {
        case 'VIEWER_ADD_SENSOR':
            copy = {
                ...state
            }
            copy.data.push(action.sensor);
            copy.ids.push(action.sensor.id);
            return copy;

        case 'VIEWER_REMOVE_SENSOR':
            copy = {
                ...state
            }
            copy.data.splice(action.index, 1);
            copy.ids.splice(action.index, 1);
            return copy;

        case 'VIEWER_APPLY_OBSP_PROP_FILTER':
            return {
                ...state,
                filter: {
                    ...state.filter,
                    observedProperties: action.observedProperties
                }
            };

        default:
            return state;

    }
};

export default viewer_basket;
