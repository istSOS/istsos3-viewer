import React, { Component } from 'react';
import { connect } from 'react-redux';

import TableComponent from './tableComponent';

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
        sensors: state.viewer_search_result,
        chart: state.viewer_chart,
        basket: state.viewer_basket
    };
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        dispatch: dispatch
    }
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(DataTable);
