import React from 'react';

// istSOS components
import {
    DateRange,
    SensorCard,
    ObservableProperties,
    Mappa
} from 'istsos3-core';

import Chart from '../chart/chartContainer';
import DataTable from '../table/tableContainer';

// Semantic UI components
import {
    Form,
    Rating,
    Icon,
    //Popup,
    Grid,
    Button,
    Segment,
    Header,
    Divider,
    Table
} from 'semantic-ui-react';

class ViewerComponent extends React.Component {

    render() {
        const {
            setMode,
            sensors,
            chart,
            basket,
            fetchSensors,
            fetchObservations,
            addSensor,
            removeSensor,
            applyObsPropFilter,
            setRange
        } = this.props;
        //let sensorsCnt = Object.keys(sensors.data).length;
        return (
            <div style={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'row',
                    overflow: 'hidden',
                    padding: '1px'
                }}>
                <div style={{
                        padding: '1px 1rem'
                    }}>
                        <Button
                            circular
                            primary={basket.mode===0}
                            secondary={basket.mode!==0}
                            icon='search'
                            onClick={(e)=>{
                                setMode(0)
                            }}/>
                        <br/>
                        <br/>
                        <Button circular
                            primary={basket.mode===1}
                            secondary={basket.mode!==1}
                            icon='area chart'
                            onClick={(e)=>{
                                setMode(1)
                            }}/>
                        <br/>
                        <br/>
                        <Button circular
                            primary={basket.mode===2}
                            secondary={basket.mode!==2}
                            icon='table'
                            onClick={(e)=>{
                                setMode(2)
                            }}/>
                        <br/>
                        <br/>
                        <Button circular
                            primary={basket.mode===3}
                            secondary={basket.mode!==3}
                            icon='map'
                            onClick={(e)=>{
                                setMode(2)
                            }}/>
                </div>
                <div style={{
                        padding: '1px',
                        minWidth: '455px'
                    }}>
                    {
                        basket.mode === 0 ? <div>
                            <Header sub attached='top'>
                                Search
                            </Header>
                            <Segment attached>
                                <Form>
                                    <ObservableProperties
                                        layout={"dropdown"}
                                        onSelected={applyObsPropFilter}/>
                                    <DateRange
                                        onRangeSelected={(range)=>{
                                            console.log(range);
                                        }}/>
                                    <Button fluid
                                        onClick={(e)=>{
                                            fetchSensors(basket.filter)
                                        }}>Search</Button>
                                </Form>
                            </Segment>
                        </div>: null
                    }
                    {basket.data.map((sensor, idx) => (
                        <SensorCard
                            key={"vcrl-"+idx}
                            sensor={sensor}
                            buttons={
                                <Button
                                    secondary
                                    floated='right'
                                    onClick={(e) => {
                                        removeSensor(idx, basket.data)
                                    }}>
                                    Remove
                                </Button>
                            }/>
                    ))}
                </div>
                {
                    basket.mode === 0 ? [
                        <div key='vc-sns-lis' style={{
                                flex: 0.5,
                                padding: '1px 1rem'
                            }}>
                            {sensors.data.map((sensor, idx) => (
                                <SensorCard
                                    key={"vcrl-"+idx}
                                    sensor={sensor}
                                    buttons={
                                        <Button
                                            disabled={
                                                basket.ids.indexOf(sensor.id)>-1
                                            }
                                            secondary
                                            floated='right'
                                            onClick={(e) => {
                                                addSensor(sensor)
                                            }}>
                                            <Icon name='area chart' /> Add
                                        </Button>
                                    }/>
                            ))}
                        </div>,
                        <div key='vc-sns-map' style={{
                                flex: 1,
                                padding: '0px'
                            }}>
                            <Mappa/>
                        </div>
                    ]: null
                }
                {
                    basket.mode === 1 ?
                    <Chart/>: null
                }
                {
                    basket.mode === 2 ?
                    <DataTable/>: null
                }
            </div>
        )
    }
};

export default ViewerComponent;
