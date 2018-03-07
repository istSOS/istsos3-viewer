import {
    setting
} from 'istsos3-core';
import config from '../config';
import moment from 'moment';

export function viewerReducer(reducerName = config.name){
    const initialState = {
        // VIEWER CONFIGURATION
        // search sensors = 0 / show data = 1
        mode: 0,
        // show data grouped by:
        //   > observed property = 0 / uoms = 1
        axisDomain: 0,

        // CHART CONFIGS
        // data row on over
        item: null,
        // grafics color
        colors: [
            '#c23531', '#2f4554',
            '#61a0a8', '#d48265',
            '#91c7ae', '#749f83',
            '#ca8622', '#bda29a',
            '#6e7074', '#546570',
            '#c4ccd3'
        ],
        settings: {
            trend: false,
            s1: {
                type: 'line', // 'bar', 'scatter', 'points'
            },
            s2: {
                type: 'line', // 'bar', 'scatter', 'points'
            }
        },
        // Brush configuration
        brush: [null, null],
        brushIdx: [0, 8],
        brushCnt: 0,

        activePage: 1,
        totalPages: 0,

        maxTableRange: 8,


        // event time observation filter
        filter: {
            from: (moment().add(moment.duration(-7, 'days'))).format('YYYY-MM-DD'),
            to: moment().format('YYYY-MM-DD')
        },
        fromMin: null,
        toMax: null,

        // BASKET DATA
        // selected sensors
        sensors: [],
        // seleced sensors ids
        ids: [],
        // extracted obs prop of seleced sensors
        observed_properties: [],
        // extracted uoms of seleced sensors
        uoms: [],
        // Series 1 selected observed property
        observedProperty1: null,
        // Optional series 2 selected observed property
        observedProperty2: null,
        // Series 1 selected unit of measure
        uom1: null,
        // Optional series 2 selected unit of measure
        uom2: null,

        // OBSERVATIONS E MEASUREMENTS
        isFetching: false,
        rtime: 0,
        data: [],
        cnt: 0,
        dataCnt: 0,

        // SEARCH RESULTS
        isFetchingResult: false,
        fcnt: 0,
        search_results: []
    };
    return function viewer(state = initialState, action) {
        switch (action.type) {
            case 'VIEWER_CHART_PAGE_CHANGE':
                return {
                    ...state,
                    ...calculate_position(
                        state,
                        parseInt(
                            (action.page * state.maxTableRange)
                            - state.maxTableRange + 3, 10
                        )
                    ),
                    activePage: action.page
                }
            case 'VIEWER_SET_DT_RANGE':
                return {
                    ...state,
                    filter: {
                        ...action.range
                    }
                };
            case 'VIEWER_SET_MODE': {
                // Switch between search sensors and chart
                return {
                    ...state,
                    mode: action.mode
                };
            }
            case 'VIEWER_TREND_VISIBILITY': {
                // Switch between search sensors and chart
                return {
                    ...state,
                    settings: {
                        ...state.settings,
                        trend: action.visibility
                    }
                };
            }
            case 'VIEWER_SET_S1_TYPE': {
                // Switch between search sensors and chart
                return {
                    ...state,
                    cnt: state.cnt + 1,
                    settings: {
                        ...state.settings,
                        s1: {
                            ...state.settings.s1,
                            type: action.chart
                        }
                    }
                };
            }
            case 'VIEWER_SET_S2_TYPE': {
                // Switch between search sensors and chart
                return {
                    ...state,
                    cnt: state.cnt + 1,
                    settings: {
                        ...state.settings,
                        s2: {
                            ...state.settings.s2,
                            type: action.chart
                        }
                    }
                };
            }
            case 'VIEWER_SET_AXIS_DOMAIN':{
                return {
                    ...state,
                    axisDomain: action.axisDomain
                };
            }
            case 'VIEWER_CHART_RESET':
                return {
                    ...state,
                    observedProperty1: {
                        ...state.observedProperty1
                    },
                    observedProperty2: {
                        ...state.observedProperty2
                    },
                    item: null,
                    filter: {
                        ...state.filter
                    },
                    brush: [null, null],
                    data: null,
                    dataCnt: 0,
                    cnt: (state.cnt + 1)
                };
            case 'VIEWER_CHART_ITEM_OVER': {
                if(!action.item.hasOwnProperty('e')){
                    return {
                        ...state,
                        item: null
                    };
                }
                /*
                    item: {
                        "e": "2018-02-01T00:00:00Z",
                        "_43": 12.43,
                        "_44": 7.0043
                    }
                */
                let item = {
                    et: action.item.e,
                    id: action.item.i,
                    obs: {}
                }, keys = Object.keys(action.item);
                for (let i = 0; i < state.sensors.length; i++) {
                    const sensor = state.sensors[i];
                    for (let ii = 0; ii < sensor.observable_properties.length; ii++) {
                        const op = sensor.observable_properties[ii];
                        if(action.item[op.column] !== null
                                && keys.indexOf(op.column)>=0){
                            if(!item.obs.hasOwnProperty(op.definition)){
                                item.obs[op.definition] = {
                                    "name": op.name,
                                    "def": op.definition,
                                    "values": []
                                };
                            }
                            item.obs[op.definition].values.push({
                                "sensor": sensor.name,
                                "uom": op.uom,
                                "val": action.item[op.column]
                            });
                        }
                    }
                }
                item.obs = Object.values(item.obs);
                return {
                    ...state,
                    ...calculate_position(state, action.item.i),
                    item: item
                };
            }
            case 'VIEWER_ADD_SENSOR': {
                let copy = {
                    ...initialState,
                    sensors: [
                        ...state.sensors,
                        ...[action.sensor]
                    ],
                    ids: [
                        ...state.ids,
                        ...[action.sensor.id]
                    ],
                    fcnt: state.fcnt,
                    search_results: state.search_results
                };
                return reconfigure(copy);
            }
            case 'VIEWER_REMOVE_SENSOR': {
                let copy = {
                    ...initialState,
                    mode: state.mode,
                    sensors: state.sensors.filter(
                        sensor => (
                            sensor.id !== action.sensor.id
                        )
                    ),
                    ids: state.ids.filter(
                        id => id !== action.sensor.id
                    ),
                    fcnt: state.fcnt,
                    search_results: state.search_results
                };
                console.log("VIEWER_REMOVE_SENSOR: " + copy.sensors.length + " mode: " + copy.mode);
                if (copy.sensors.length===0){
                    console.log("Setting mode zero: " + copy.sensors.length);
                    copy.mode = 0;
                }
                return reconfigure(copy);
            }
            case 'VIEWER_SWAP_OBSP':{
                return {
                    ...state,
                    cnt: state.cnt + 1,
                    observedProperty1: state.observedProperty2,
                    observedProperty2: state.observedProperty1
                };
            }
            case 'VIEWER_RESET_OBP2':{
                return {
                    ...state,
                    cnt: state.cnt + 1,
                    observedProperty2: null
                };
            }
            case 'VIEWER_SWAP_UOMS':{
                return {
                    ...state,
                    cnt: state.cnt + 1,
                    uom1: state.uom2,
                    uom2: state.uom1
                };
            }
            case 'VIEWER_RESET_UOM2':{
                return {
                    ...state,
                    cnt: state.cnt + 1,
                    uom2: null
                };
            }
            case 'VIEWER_OBS_PROP_SELECTED_1':{
                return {
                    ...state,
                    observedProperty1: action.selected
                };
            }
            case 'VIEWER_OBS_PROP_SELECTED_2':{
                return {
                    ...state,
                    observedProperty2: action.selected
                };
            }
            case 'VIEWER_UOM_SELECTED_1': {
                return {
                    ...state,
                    uom1: action.selected
                };
            }
            case 'VIEWER_UOM_SELECTED_2': {
                return {
                    ...state,
                    uom2: action.selected
                };
            }
            case 'VIEWER_APPLY_OBSP_PROP_FILTER':
                return {
                    ...state,
                    filter: {
                        ...state.filter,
                        observedProperties: action.observedProperties
                    }
                };
            case 'VIEWER_CHART_BRUSH_RESET':
                return {
                    ...state,
                    brush: [null, null],
                    brushCnt: state.brushCnt + 1
                };

            case 'VIEWER_CHART_BRUSH_START':
                return {
                    ...state,
                    brush: [
                        action.start,
                        action.start
                    ],
                    brushCnt: state.brushCnt + 1
                };

            case 'VIEWER_CHART_BRUSH_END':
                if(state.brush !== null && state.brush[0]){
                    return {
                        ...state,
                        brush: [
                            state.brush[0],
                            action.end
                        ],
                        brushCnt: state.brushCnt + 1
                    };
                }else{
                    return {
                        ...state,
                        brush: [
                            action.end,
                            action.end
                        ],
                        brushCnt: state.brushCnt + 1
                    };
                }
            default: {
                const {name} = action;
                if(name !== reducerName){
                    return state;
                };
                switch (action.type) {
                    case 'FETCH_OBSERVATIONS':
                        return {
                            ...state,
                            isFetching: true,
                            rtime: (
                                new Date()
                            ).getTime(),
                            item: null,
                            filter: {
                                ...state.filter
                            },
                            brush: [null, null],
                            data: null,
                            dataCnt: 0
                        };
                    case 'FETCH_OBSERVATIONS_OK':{
                        let len = action.json.data.e.length;
                        return {
                            ...state,
                            cnt: (state.cnt + 1),
                            isFetching: false,
                            rtime: (
                                new Date()
                            ).getTime() - state.rtime,
                            //stats: stats,
                            totalPages: parseInt(
                                len / state.maxTableRange, 10
                            ),
                            data: action.json.data,
                            dataCnt: len
                        };
                    }
                    case 'FETCH_SENSORS':
                        return {
                            ...state,
                            isFetchingResult: true,
                            search_results: []
                        };
                    case 'FETCH_SENSORS_OK':
                        return {
                            ...state,
                            isFetchingResult: false,
                            fcnt: (state.fcnt+1),
                            search_results: action.json.data
                        };
                    default:
                        return state;
                }
            }
        }
    }
};

const reconfigure = (state) => {
    /*
    - Fill the dropdown menu for observed properties
    - Fill the dropdown menu for uoms
    - Selected the first available observed property
    - Calculating fromMin and toMax phenomenon time
    */
    state.observed_properties = [];
    state.uoms = [];
    state.observedProperty1 = null;
    state.observedProperty2 = null;

    let opCheck = [];
    let uomCheck = [];
    let pt = null;
    for (let i = 0; i < state.sensors.length; i++) {
        const sensor = state.sensors[i];

        // calculating fromMin anviewerax
        let from = moment(sensor.phenomenon_time.timePeriod.begin);
        let to = moment(sensor.phenomenon_time.timePeriod.end);
        if(state.fromMin === null || state.toMax === null){
            state.fromMin = from;
            state.toMax = to;
        }else{
            if(state.fromMin.isAfter(from)){
                state.fromMin = from;
            }
            if(state.toMax.isBefore(to)){
                state.toMax = to;
            }
        }

        for (let ii = 0; ii < sensor.observable_properties.length; ii++) {
            const op = sensor.observable_properties[ii];
            if(op.type !== setting._COMPLEX_OBSERVATION){
                if(opCheck.indexOf(op.definition)===-1){
                    opCheck.push(op.definition);
                    state.observed_properties.push(op);
                }
                if(uomCheck.indexOf(op.uom)===-1){
                    uomCheck.push(op.uom);
                    state.uoms.push(op.uom);
                }
                if(state.observedProperty1 === null){
                    state.observedProperty1 = op;
                }
            }
        }
    }
    if(state.sensors.length>0){
        // Auto set filter
        let lastWeek = (
            state.toMax.clone()
        ).subtract(moment.duration(7, 'days'));
        if (lastWeek.isBefore(state.fromMin)){
            state.filter.from = state.fromMin.format('YYYY-MM-DD');
        }else{
            state.filter.from = lastWeek.format('YYYY-MM-DD');
        }
        state.filter.to = state.toMax.format('YYYY-MM-DD');
    }

    return state;
}

const calculate_position = (state, id) => {
    let selected = 3
    let half = state.maxTableRange - selected;
    if(id < selected){
        return {
            brush: [
                state.data.e[0],
                state.data.e[state.maxTableRange]
            ],
            brushIdx: [0, state.maxTableRange],
            brushCnt: state.brushCnt + 1,
            activePage: 1
        };
    }else if(id > ((state.dataCnt-1) - half)){
        return {
            brush: [
                state.data.e[(state.dataCnt-1) - state.maxTableRange],
                state.data.e[(state.dataCnt-1)]
            ],
            brushIdx: [
                (state.dataCnt-1) - state.maxTableRange,
                state.dataCnt-1
            ],
            brushCnt: state.brushCnt + 1,
            activePage: state.totalPages
        };
    }
    let ai = parseInt(id / state.maxTableRange, 10);
    return {
        brush: [
            state.data.e[id - selected],
            state.data.e[id + half]
        ],
        brushIdx: [
            id - selected,
            id + half
        ],
        brushCnt: state.brushCnt + 1,
        activePage: ai === 0? 1: ai
    };
}
