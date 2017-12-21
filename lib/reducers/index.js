// *** REDUCERS ***
import config from '../config';
import viewer_basket from '../viewer/viewerState';
import {
    sensorReducer
} from 'istsos3-core';

const reducers = {
    viewer_basket,
    viewer_search_result: sensorReducer(config.name)
};

export default reducers;
