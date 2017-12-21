import React from 'react';

// istSOS components
//import ObservableProperties from 'istsos3';
import {
    DateRange,
    SensorCard,
    ObservableProperties
} from 'istsos3-core';

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
            sensors,
            basket,
            fetchSensors,
            addSensor,
            removeSensor,
            applyObsPropFilter
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
                        <Button circular secondary icon='find' />
                        <br/>
                        <br/>
                        <Button circular secondary icon='area chart' />
                        <br/>
                        <br/>
                        <Button circular secondary icon='map' />
                </div>
                <div style={{
                        padding: '1px'
                    }}>
                    <Header sub attached='top'>
                        Search
                    </Header>
                    <Segment attached>
                        <Form>
                            <ObservableProperties
                                layout={"dropdown"}
                                onSelected={applyObsPropFilter}/>
                            <DateRange/>
                            <Button fluid
                                onClick={(e)=>{
                                    fetchSensors(basket.filter)
                                }}>Search</Button>
                        </Form>
                    </Segment>
                    {basket.data.map((sensor, idx) => (
                        <SensorCard
                            key={"vcrl-"+idx}
                            sensor={sensor}
                            buttons={
                                <Button
                                    secondary
                                    floated='right'
                                    onClick={(e) => {
                                        removeSensor(idx)
                                    }}>
                                    Remove
                                </Button>
                            }/>
                    ))}
                </div>
                <div style={{
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
                </div>
                <div style={{
                        flex: 1,
                        padding: '0px'
                    }}>
                </div>
            </div>
        )
    }
};

export default ViewerComponent;
