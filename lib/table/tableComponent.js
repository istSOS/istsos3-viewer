import React from 'react';
import moment from 'moment';

// Semantic UI components
import {
    Table,
    Label,
    Pagination,
    Icon
} from 'semantic-ui-react';

const colW = 2;

class TableComponent extends React.Component {

    get_headers_1(){
        const {
            viewer
        } = this.props;
        let ret = [], obs = [];
        if(viewer.axisDomain === 0){
            if(viewer.observedProperty1===null){
                return null;
            }
            obs.push(viewer.observedProperty1);
        }else if (viewer.axisDomain === 1) {
            if(viewer.uom1 === null){
                return null;
            }
            for (let i = 0; i < viewer.observed_properties.length; i++) {
                if(viewer.observed_properties[i].uom === viewer.uom1.name){
                    obs.push(viewer.observed_properties[i]);
                }
            }
        }
        let defs1 = obs.map(ob => ob.definition);
        let ccnt = 0;
        for (let i = 0; i < viewer.sensors.length; i++) {
            const sensor = viewer.sensors[i];
            for (let ii = 0; ii < sensor.observable_properties.length; ii++) {
                const op = sensor.observable_properties[ii];
                if(defs1.indexOf(op.definition)>-1){
                    ret.push(
                        <Table.HeaderCell
                            key={"vtc-r-"+i+"-"+ii}
                            width={''+colW}
                            collapsing
                            textAlign='right'>
                            <Label
                                style={{
                                    backgroundColor: viewer.colors[ccnt++]
                                }}
                                circular
                                empty/> {sensor.name} {op.uom}<br/>
                            <span style={{
                                color: '#787878',
                                fontSize: '0.8em'
                            }}>{op.name}</span>
                        </Table.HeaderCell>
                    );
                }
            }
        }

        // Y2 axis
        obs = [];
        if(viewer.axisDomain === 0){
            if(viewer.observedProperty2!==null){
                obs.push(viewer.observedProperty2);
            }
        }else if (viewer.axisDomain === 1) {
            if(viewer.uom2 !== null){
                for (let i = 0; i < viewer.observed_properties.length; i++) {
                    if(viewer.observed_properties[i].uom === viewer.uom2.name){
                        obs.push(viewer.observed_properties[i]);
                    }
                }
            }
        }
        if(obs.length>0){
            let defs = obs.map(ob => ob.definition);
            for (let i = 0; i < viewer.sensors.length; i++) {
                const sensor = viewer.sensors[i];
                for (let ii = 0; ii < sensor.observable_properties.length; ii++) {
                    const op = sensor.observable_properties[ii];
                    if(defs.indexOf(op.definition)>-1){
                        ret.push(
                            <Table.HeaderCell
                                key={"vtc-r-"+i+"-"+ii}
                                width={''+colW}
                                collapsing
                                textAlign='right'>
                                <Label
                                    style={{
                                        backgroundColor: viewer.colors[ccnt++]
                                    }}
                                    circular
                                    empty/> {sensor.name} {op.uom}<br/>
                                <span style={{
                                    color: '#787878',
                                    fontSize: '0.8em'
                                }}>{op.name}</span>
                            </Table.HeaderCell>
                        );
                    }
                }
            }
        }
        return ret;
    }

    get_rows(){
        const {
            viewer
        } = this.props;
        let rows = [], ob1 = [], ob2 = [];
        if(viewer.dataCnt > 0){

            if(viewer.axisDomain === 0){
                ob1.push(viewer.observedProperty1);
                if(viewer.observedProperty2 !== null){
                    ob2.push(viewer.observedProperty2);
                }
            }else if (viewer.axisDomain === 1) {
                if(viewer.uom1 !== null || viewer.uom2 !== null ){
                    for (let i = 0; i < viewer.observed_properties.length; i++) {
                        if(viewer.observed_properties[i].uom === viewer.uom1.name){
                            ob1.push(viewer.observed_properties[i]);
                        }
                        if(viewer.uom2 !== null && viewer.observed_properties[i].uom === viewer.uom2.name){
                            ob2.push(viewer.observed_properties[i]);
                        }
                    }
                }
            }

            let defs1 = ob1.map(ob => ob.definition);
            let defs2 = ob2.map(ob => ob.definition);

            let start = viewer.brushIdx[0];
            let end = viewer.brushIdx[1];
            // if(viewer.item !== null && start < (viewer.item.id - 10)){
            //     start = viewer.item.id - 10;
            // }
            for (var a = start; a < end; a++) {
            //for (var a = 0; a < viewer.data.e.length; a++) {
                //const data = viewer.data[a];
                let row = [
                    <Table.Cell
                        collapsing
                        key={"vtc-bc-"+a}
                        width={'4'}>
                        {viewer.data.e[a]}
                    </Table.Cell>
                ];
                let row2 = []
                for (let i = 0; i < viewer.sensors.length; i++) {
                    const sensor = viewer.sensors[i];
                    for (let ii = 0; ii < sensor.observable_properties.length; ii++) {
                        const op = sensor.observable_properties[ii];
                        //debugger;
                        if(defs1.indexOf(op.definition)>-1){
                        // if(op.definition === viewer.observedProperty1.definition){
                            row.push(
                                <Table.Cell
                                    collapsing
                                    width={''+colW}
                                    key={"vtc-bc-"+a+"-"+i+"-"+ii}
                                    textAlign='right'>
                                    {
                                        viewer.data[op.column][a] === null?
                                        '-': viewer.data[op.column][a]
                                    }{
                                        viewer.settings.trend?
                                        <span>&nbsp;
                                        {
                                            a === 0
                                            || viewer.data[op.column][a] === null
                                            || viewer.data[op.column][a-1] === null?
                                                null: viewer.data[op.column][a] < viewer.data[op.column][a-1]?
                                                    <Icon name='arrow circle down' color="red" size='small'/>:
                                                    viewer.data[op.column][a] === viewer.data[op.column][a-1]?
                                                        <Icon name='arrow circle right' color="blue" size='small'/>:
                                                        <Icon name='arrow circle up' color="green" size='small'/>
                                        }
                                        </span>: null
                                    }
                                </Table.Cell>
                            );
                        }else if(defs2.indexOf(op.definition)>-1){
                        // }else if(viewer.observedProperty2 !== null
                        //         && op.definition === viewer.observedProperty2.definition){
                            row2.push(
                                <Table.Cell
                                    collapsing
                                    width={''+colW}
                                    key={"vtc-bc-"+a+"-"+i+"-"+ii}
                                    textAlign='right'>
                                    {
                                        viewer.data[op.column][a] === null?
                                        '-': viewer.data[op.column][a]
                                    }{
                                        viewer.settings.trend?
                                        <span>&nbsp;
                                        {
                                            a === 0
                                            || viewer.data[op.column][a] === null
                                            || viewer.data[op.column][a-1] === null?
                                                null: viewer.data[op.column][a] < viewer.data[op.column][a-1]?
                                                    <Icon name='arrow circle down' color="red" size='small'/>:
                                                    viewer.data[op.column][a] === viewer.data[op.column][a-1]?
                                                        <Icon name='arrow circle right' color="blue" size='small'/>:
                                                        <Icon name='arrow circle up' color="green" size='small'/>
                                        }
                                        </span>: null
                                    }
                                </Table.Cell>
                            );
                        }
                    }
                }
                rows.push(
                    <Table.Row
                        key={"vtc-br-"+a}
                        id={"vtc-br-"+a}
                        active={viewer.item && viewer.item.id === a}>
                        {row}
                        {row2}
                    </Table.Row>
                )
            }
        }
        return rows;
    }

    render() {
        const {
            viewer,
            pageChange
        } = this.props;
        if(viewer.data === null || viewer.data.length===0){
            return null;
        }
        return (
            <div style={{
                    height: '100%',
                    width: '100%',
                    overflowY: 'hidden',
                    flex: '1 0 0%',
                    display: "flex",
                    flexDirection: "column",
                    height: "100%"
                }} ref={(el) => this.cEl = el}>
                <div style={{
                    //height: "100%",
                    overflowY: "hidden",
                    margin: '0.5rem 80px',
                    display: "flex",
                    flexDirection: "column",
                    flex: '1 0 0%',
                    alignItems: "center",
                    justifyContent: "center"
                }}
                onWheel={(e)=>{
                    if(e.deltaY>0){
                        pageChange(viewer.activePage+1);
                    }else{
                        pageChange(viewer.activePage-1);
                    }
                }}>
                    <Table
                        structured
                        basic='very'
                        compact='very'
                        size='small'>
                        <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell
                                    width='4'>
                                    Phenomenon Time<br/>
                                    <span style={{
                                            color: "#787878",
                                            fontSize: "0.8em"
                                        }}>
                                        {viewer.dataCnt} rows in {viewer.rtime/1000}s
                                    </span>
                                </Table.HeaderCell>
                                {this.get_headers_1()}
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            {this.get_rows()}
                        </Table.Body>
                    </Table>
                </div>
                <div style={{
                        width: "100%",
                        height: '70px',
                        padding: "1rem 80px",
                        textAlign: "center"
                    }}>
                    <Pagination
                        activePage={viewer.activePage}
                        totalPages={viewer.totalPages}
                        boundaryRange={2}
                        onPageChange={(e, { activePage }) => {
                            pageChange(activePage);
                        }}
                        pointing
                        secondary
                        size='mini'
                        siblingRange={2}
                    />
                </div>
            </div>
        )
    }
};

export default TableComponent;
