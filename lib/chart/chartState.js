import config from '../config';
import moment from 'moment';

const initialState = {
    isFetching: false,
    showChart: false,
    filter: {
        from: (moment().add(moment.duration(-7, 'days'))).format('YYYY-MM-DD'),
        to: moment().format('YYYY-MM-DD')
    },
    cnt: 0,
    observedProperty1: null,
    data: [],
    observed_properties: []
};

const viewer_chart = (state = initialState, action) => {
    let copy, opCheck;
    switch (action.type) {
        case 'VIEWER_SET_DT_RANGE':
            return {
                ...state,
                filter: {
                    ...action.range
                }
            };
        case 'VIEWER_OBS_PROP_SELECTED_1':
            return {
                ...state,
                observedProperty1: action.selected
            };
        case 'VIEWER_CHART_RESET':
            return {
                ...initialState
            };
        default:
            if (action.name !== config.name) {
                return state;
            }
            switch (action.type) {
                case 'FETCH_OBSERVATIONS':
                    return {
                        ...state,
                        isFetching: true
                    };
                case 'FETCH_OBSERVATIONS_OK':
                    return {
                        ...state,
                        cnt: (state.cnt + 1),
                        isFetching: false,
                        data: action.json.data
                    };
                default:
                    return state;
            }
    }
};

export default viewer_chart;
