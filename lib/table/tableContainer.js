import React, { Component } from 'react';
import { connect } from 'react-redux';

import TableComponent from './tableComponent';

import {
    pageChange
} from '../actions';

class DataTable extends Component {
    render() {
        return(
            <TableComponent
                {...this.props}/>
        );
    }
};

const mapStateToProps = (state, ownProps) => {
    return {
        //chart: state.viewer_chart,
        viewer: state.viewer
    };
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        dispatch: dispatch,
        pageChange: (page) => {
            dispatch(pageChange(page));
        }
    }
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(DataTable);
