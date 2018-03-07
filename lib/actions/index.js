export const addSensor = (sensor) => {
    return {
        type: 'VIEWER_ADD_SENSOR',
        sensor: sensor
    }
};

export const removeSensor = (sensor) => {
    return {
        type: 'VIEWER_REMOVE_SENSOR',
        sensor: sensor
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

export const swapObsProp = () => {
    return {
        type: 'VIEWER_SWAP_OBSP'
    }
};

export const swapUoms = () => {
    return {
        type: 'VIEWER_SWAP_UOMS'
    }
};

export const resetUom2 = () => {
    return {
        type: 'VIEWER_RESET_UOM2'
    }
};

export const resetObsProp2 = () => {
    return {
        type: 'VIEWER_RESET_OBP2'
    }
};

export const trendVisible = (visibility) => {
    return {
        type: 'VIEWER_TREND_VISIBILITY',
        visibility: visibility
    }
};

export const s1Type = (chart) => {
    return {
        type: 'VIEWER_SET_S1_TYPE',
        chart: chart
    }
};

export const s2Type = (chart) => {
    return {
        type: 'VIEWER_SET_S2_TYPE',
        chart: chart
    }
};

export const setAxisDomain = (axisDomain) => {
    return {
        type: 'VIEWER_SET_AXIS_DOMAIN',
        axisDomain: axisDomain
    }
};


export const observedPropertySelected1 = (selected) => {
    return {
        type: 'VIEWER_OBS_PROP_SELECTED_1',
        selected: selected
    }
};

export const observedPropertySelected2 = (selected) => {
    return {
        type: 'VIEWER_OBS_PROP_SELECTED_2',
        selected: selected
    }
};

export const uomSelected1 = (selected) => {
    return {
        type: 'VIEWER_UOM_SELECTED_1',
        selected: selected
    }
};

export const uomSelected2 = (selected) => {
    return {
        type: 'VIEWER_UOM_SELECTED_2',
        selected: selected
    }
};

export const setRange = (range) => {
    return {
        type: 'VIEWER_SET_DT_RANGE',
        range: range
    }
};

export const resetChart = () => {
    return {
        type: 'VIEWER_CHART_RESET'
    }
};

export const chartClick = (item) => {
    return {
        type: 'VIEWER_CHART_CLICK',
        item: item
    }
};

export const itemOver = (item) => {
    return {
        type: 'VIEWER_CHART_ITEM_OVER',
        item: item
    }
};

export const resetBrush = () => {
    return {
        type: 'VIEWER_CHART_BRUSH_RESET'
    }
};

export const setBrushStart = (start) => {
    return {
        type: 'VIEWER_CHART_BRUSH_START',
        start: start
    }
};

export const setBrushEnd = (end) => {
    return {
        type: 'VIEWER_CHART_BRUSH_END',
        end: end
    }
};

export const pageChange = (page) => {
    return {
        type: 'VIEWER_CHART_PAGE_CHANGE',
        page: page
    }
};
