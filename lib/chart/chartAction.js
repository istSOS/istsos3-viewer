
export const observedPropertySelected1 = (selected) => {
    return {
        type: 'VIEWER_OBS_PROP_SELECTED_1',
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
