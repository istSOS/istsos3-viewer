import React from 'react';
import moment from 'moment';

// istSOS components
import {
    SensorCard,
    setting
} from 'istsos3-core';

import {
    DateRange,
    Mappa,
    Uoms,
    DropdownObsProp,
    SelectObsProp
} from 'istsos3-ui';

import Chart from '../chart/chartContainer';
import DataTable from '../table/tableContainer';

// Semantic UI components
import {
    Form,
    Accordion,
    Rating,
    Icon,
    List,
    Grid,
    Button,
    Segment,
    Header,
    Divider,
    Table,
    Tab,
    Menu,
    Label,
    Popup,
    Dropdown,
    Message
} from 'semantic-ui-react';

class ViewerComponent extends React.Component {

    fetchdata(){
        const {
            viewer,
            fetchObservations
        } = this.props;

        let offs = [], observedProperties = [];
        if(viewer.axisDomain === 0){
            observedProperties.push(
                viewer.observedProperty1.definition
            )
            if(viewer.observedProperty2 !== null){
                observedProperties.push(
                    viewer.observedProperty2.definition
                )
            }
        }else if (viewer.axisDomain === 1) {
            for (let i = 0; i < viewer.observed_properties.length; i++) {
                if(viewer.observed_properties[i].uom === viewer.uom1.name){
                    observedProperties.push(
                        viewer.observed_properties[i].definition
                    );
                }
                if(
                    viewer.uom2 !== null
                    && viewer.observed_properties[i].uom === viewer.uom2.name
                ){
                    observedProperties.push(
                        viewer.observed_properties[i].definition
                    );
                }
            }
        }
        for (var i = 0; i < viewer.sensors.length; i++) {
            offs.push(viewer.sensors[i].name);
        }

        fetchObservations({
            "offerings": offs,
            "observedProperties": observedProperties,
            "temporal": {
                "reference": "om:phenomenonTime",
                "fes": "during",
                "period": [
                    viewer.filter.from + "T00:00:00Z",
                    viewer.filter.to + "T23:59:59Z"
                ]
            },
            "responseFormat": "application/json;subtype='array2'"
        })
    }
    render() {
        const {
            viewer,
            observed_properties,
            setMode,
            setAxisDomain,
            map,
            fetchSensors,
            addSensor,
            removeSensor,
            applyObsPropFilter,
            setRange,
            observedPropertySelected1,
            observedPropertySelected2,
            swapObsProp,
            swapUoms,
            uomSelected1,
            uomSelected2,
            resetChart,
            resetObsProp2,
            resetUom2
        } = this.props;
        let ccnt = 0;
        return (
            <div style={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'row',
                    overflow: 'hidden'
                }}>
                <div style={{
                        width: '30%',
                        minWidth: '600px',
                        padding: "2px 1em",
                        display: "flex",
                        flexDirection: "column",
                        boxShadow: "0px 2px 10px 0px rgba(50, 50, 50, 0.75)"
                    }}>
                    <Tab
                        activeIndex={viewer.mode}
                        menu={{ secondary: true, pointing: true }}
                        panes={[
                            {
                                menuItem: <Menu.Item key='isv-src-tbs2'>
                                    Registered sensors {" (" + viewer.search_results.length + ")"}
                                </Menu.Item>,
                                render: () =>
                                <Segment>
                                    <Form size='tiny'>
                                        <DropdownObsProp
                                            layout={"dropdown"}
                                            onSelected={applyObsPropFilter}
                                            observed_properties={
                                                observed_properties.data
                                            }/>
                                        <DateRange
                                            onRangeSelected={(range)=>{
                                                console.log(range);
                                            }}/>
                                        <Button fluid
                                            loading={
                                                viewer.isFetchingResult
                                            }
                                            onClick={(e)=>{
                                                fetchSensors(viewer.filter)
                                            }}>Search</Button>
                                    </Form>
                                </Segment>
                            },
                            {
                                menuItem: <Menu.Item key='isv-src-tbs3'>
                                    View data {" (" + viewer.sensors.length + ")"}
                                </Menu.Item>,
                                render: () => {
                                    if(viewer.sensors.length > 0){
                                        return (
                                            <Segment>
                                                <Form size='tiny'>
                                                    <Form.Field>
                                                        Y-Axis grouped by <Dropdown inline
                                                            options={[
                                                                {
                                                                    key: 'observed property',
                                                                    text: 'observed property',
                                                                    value: 0,
                                                                    content: 'Observed property',
                                                                },
                                                                {
                                                                    key: 'unit of measure',
                                                                    text: 'unit of measure',
                                                                    value: 1,
                                                                    content: 'Unit of measure',
                                                                }
                                                            ]}
                                                            defaultValue={viewer.axisDomain}
                                                            onChange={(e, data) => {
                                                                resetChart();
                                                                setAxisDomain(data.value);
                                                            }}/>
                                                    </Form.Field>
                                                    <Form.Group widths='equal'>
                                                        {
                                                            viewer.axisDomain===0?
                                                            [
                                                                <SelectObsProp
                                                                    key="viewer-op-1"
                                                                    value={
                                                                        viewer.observedProperty1?
                                                                        viewer.observedProperty1.definition: ''
                                                                    }
                                                                    onSelected={(o)=>{
                                                                        resetChart();
                                                                        observedPropertySelected1(o);
                                                                    }}
                                                                    observed_properties={
                                                                        viewer.observed_properties
                                                                    }/>,
                                                                <Icon key="viewer-op-3"
                                                                    style={{
                                                                        margin: '0.4rem',
                                                                        cursor: "pointer"
                                                                    }}
                                                                    disabled={
                                                                        viewer.observedProperty2 === null
                                                                    }
                                                                    name='retweet'
                                                                    onClick={e=>swapObsProp()}
                                                                    circular
                                                                    rotated='clockwise'/>,
                                                                <SelectObsProp
                                                                    key="viewer-op-2"
                                                                    value={
                                                                        viewer.observedProperty2?
                                                                        viewer.observedProperty2.definition: null
                                                                    }
                                                                    onSelected={(o)=>{
                                                                        resetChart();
                                                                        observedPropertySelected2(o);
                                                                    }}
                                                                    observed_properties={
                                                                        viewer.observed_properties
                                                                    }/>,
                                                                <Icon key="viewer-op-4"
                                                                    style={{
                                                                        margin: '0.4rem',
                                                                        cursor: "pointer"
                                                                    }}
                                                                    disabled={
                                                                        viewer.observedProperty2 === null
                                                                    }
                                                                    name='cancel'
                                                                    onClick={e=>resetObsProp2()}
                                                                    circular/>
                                                            ]:[
                                                                <Uoms
                                                                    key="viewer-uom-1"
                                                                    onSelected={(o)=>{
                                                                        resetChart();
                                                                        uomSelected1(o);
                                                                    }}
                                                                    value={
                                                                        viewer.uom1?
                                                                        viewer.uom1.name: null
                                                                    }
                                                                    filter={{
                                                                        name: viewer.uoms
                                                                    }}/>,
                                                                <Icon key="viewer-uom-3"
                                                                    style={{
                                                                        margin: '0.4rem',
                                                                        cursor: "pointer"
                                                                    }}
                                                                    disabled={
                                                                        viewer.uom2 === null
                                                                    }
                                                                    name='retweet'
                                                                    onClick={e=>swapUoms()}
                                                                    circular
                                                                    rotated='clockwise'/>,
                                                                <Uoms
                                                                    key="viewer-uom-2"
                                                                    onSelected={(o)=>{
                                                                        resetChart();
                                                                        uomSelected2(o);
                                                                    }}
                                                                    value={
                                                                        viewer.uom2?
                                                                        viewer.uom2.name: null
                                                                    }
                                                                    filter={{
                                                                        name: viewer.uoms
                                                                    }}/>,
                                                                <Icon key="viewer-uom-4"
                                                                    style={{
                                                                        margin: '0.4rem',
                                                                        cursor: "pointer"
                                                                    }}
                                                                    disabled={
                                                                        viewer.uom2 === null
                                                                    }
                                                                    name='cancel'
                                                                    onClick={e=>resetUom2()}
                                                                    circular/>
                                                            ]
                                                        }
                                                    </Form.Group>
                                                    <Form.Field>
                                                        Phenomenon date range <Dropdown
                                                            disabled={
                                                                viewer.fromMin === null
                                                                && viewer.toMax === null
                                                            }
                                                            inline
                                                            options={[
                                                                {
                                                                    text: 'today',
                                                                    disabled: viewer.toMax.isBefore(
                                                                            moment().startOf('day')
                                                                        ) || viewer.fromMin.isAfter(
                                                                            moment().add(1, 'days').startOf('day')
                                                                        ),
                                                                    description: viewer.toMax.isBefore(
                                                                            moment().startOf('day')
                                                                        ) || viewer.fromMin.isAfter(
                                                                            moment().add(1, 'days').startOf('day')
                                                                        )? "(No data)": null,
                                                                    value: 0,
                                                                    content: 'Today',
                                                                },
                                                                {
                                                                    text: 'yesterday',
                                                                    disabled: viewer.toMax.isBefore(
                                                                            moment().subtract(1, 'days').startOf('day')
                                                                        ) || viewer.fromMin.isAfter(
                                                                            moment().startOf('day')
                                                                        ),
                                                                    description: viewer.toMax.isBefore(
                                                                            moment().subtract(1, 'days').startOf('day')
                                                                        ) || viewer.fromMin.isAfter(
                                                                            moment().startOf('day')
                                                                        )? "(No data)": null,
                                                                    value: 1,
                                                                    content: 'Yesterday',
                                                                },
                                                                {
                                                                    text: 'last 7 days',
                                                                    value: 2,
                                                                    content: 'Last 7 days',
                                                                },
                                                                {
                                                                    text: 'last 28 days',
                                                                    value: 3,
                                                                    content: 'Last 28 days',
                                                                },
                                                                // {
                                                                //     key: 'custom',
                                                                //     text: 'custom',
                                                                //     value: 4,
                                                                //     content: 'Custom...',
                                                                // }
                                                            ]}
                                                            defaultValue={2}
                                                            onChange={(e, data) => {
                                                                console.log(data.value);
                                                                if(data.value === 0){
                                                                    setRange({
                                                                        from: moment().format('YYYY-MM-DD'),
                                                                        to: (
                                                                            moment().add(
                                                                                moment.duration(1, 'days')
                                                                            )
                                                                        ).format('YYYY-MM-DD')
                                                                    })
                                                                }
                                                                else if(data.value === 1){
                                                                    setRange({
                                                                        from: (
                                                                            moment().add(
                                                                                moment.duration(-1, 'days')
                                                                            )
                                                                        ).format('YYYY-MM-DD'),
                                                                        to: moment().format('YYYY-MM-DD')
                                                                    })
                                                                }
                                                                else if(data.value === 2){
                                                                    setRange({
                                                                        from: (
                                                                            moment().add(
                                                                                moment.duration(-7, 'days')
                                                                            )
                                                                        ).format('YYYY-MM-DD'),
                                                                        to: moment().format('YYYY-MM-DD')
                                                                    })
                                                                }
                                                                else if(data.value === 3){
                                                                    setRange({
                                                                        from: (
                                                                            moment().add(
                                                                                moment.duration(-28, 'days')
                                                                            )
                                                                        ).format('YYYY-MM-DD'),
                                                                        to: moment().format('YYYY-MM-DD')
                                                                    })
                                                                }
                                                            }}/>
                                                    </Form.Field>
                                                    <DateRange
                                                        from={viewer.filter.from}
                                                        to={viewer.filter.to}
                                                        fromMonth={viewer.fromMin}
                                                        toMonth={viewer.toMax}
                                                        disabledDays={[
                                                            new Date(2018, 2, 3),
                                                            {
                                                                after: viewer.toMax.toDate(),
                                                                before: viewer.fromMin.toDate()
                                                            }
                                                        ]}
                                                        numberOfMonths={2}
                                                        onRangeSelected={(range)=>{
                                                            setRange(range);
                                                        }}/>
                                                    <Button
                                                        primary
                                                        fluid
                                                        loading={
                                                            viewer.isFetching
                                                        }
                                                        disabled={viewer.sensors.length === 0}
                                                        onClick={(e)=>{
                                                            this.fetchdata()
                                                        }}>
                                                        Go!
                                                    </Button>
                                                </Form>
                                            </Segment>
                                        )
                                    }
                                    return null;
                                }
                            }
                        ]}
                        onTabChange={(e, d) => {
                            setMode(d.activeIndex);
                        }}/>
                    <div style={{
                        height: "100%",
                        overflowY: "auto",
                        margin: "0.6rem",
                        padding: "0.6rem"
                    }}>
                    {
                        viewer.mode === 0?
                        <Table
                            singleLine
                            basic='very'
                            size='small'>
                            <Table.Header>
                                <Table.Row>
                                    <Table.HeaderCell
                                        collapsing
                                        textAlign='left'>
                                        Name
                                    </Table.HeaderCell>
                                    <Table.HeaderCell
                                        collapsing
                                        textAlign='left'>
                                        Observed properties
                                    </Table.HeaderCell>
                                    <Table.HeaderCell
                                        collapsing
                                        textAlign='right'>
                                        Begin
                                    </Table.HeaderCell>
                                    <Table.HeaderCell
                                        collapsing
                                        textAlign='right'>
                                        End
                                    </Table.HeaderCell>
                                    <Table.HeaderCell
                                        collapsing
                                        textAlign='right'>
                                        <Icon name='remove' />
                                    </Table.HeaderCell>
                                </Table.Row>
                            </Table.Header>
                            <Table.Body>
                            {
                                viewer.search_results.filter(
                                    sensor => (
                                        // Filter by map's bbox
                                        // and procedures w/o data
                                        map.fiex.indexOf(sensor.id)>=0
                                        && sensor.phenomenon_time !== null
                                    )
                                ).map((sensor, idx) => (
                                <Table.Row
                                    key={"vcrsr-"+idx}>
                                    <Table.Cell
                                        verticalAlign='top'>
                                        <div style={{fontWeight: 'bold'}}>
                                            {sensor.name}
                                        </div>
                                    </Table.Cell>
                                    <Table.Cell
                                        key={'vcrsr-cl1-'+idx}
                                        textAlign='left'>
                                        <List>
                                        {sensor.observable_properties.map((op, idx) => (
                                            op.type !== setting._COMPLEX_OBSERVATION?
                                            <List.Item key={"isc-srl-"+idx}>
                                                <List.Header>{op.name} ({op.uom})</List.Header>
                                                <span style={{color: '#787878'}}>
                                                    {op.type.replace(setting._typedef, '')}
                                                </span>
                                            </List.Item>: null
                                        ))}
                                        </List>
                                    </Table.Cell>
                                    {
                                    sensor.phenomenon_time === null?
                                    [
                                        <Table.Cell
                                            key={'vcrsr-cl1-'+idx}
                                            textAlign='right'
                                            verticalAlign='top'>
                                            -
                                        </Table.Cell>,
                                        <Table.Cell
                                            key={'vcrsr-cl2-'+idx}
                                            textAlign='right'
                                            verticalAlign='top'>
                                            -
                                        </Table.Cell>
                                    ]: [
                                        <Table.Cell
                                            key={'vcrsr-cl1-'+idx}
                                            verticalAlign='top'
                                            textAlign='right'>
                                            <List>
                                                <List.Item>
                                                    <List.Header>
                                                        {
                                                            moment(
                                                                sensor.phenomenon_time.timePeriod.begin
                                                            ).format('DD.MM.YYYY H:m')
                                                        }
                                                    </List.Header>
                                                    <span style={{color: '#787878'}}>
                                                    {moment(
                                                        sensor.phenomenon_time.timePeriod.begin
                                                    ).fromNow()}
                                                    </span>
                                                </List.Item>
                                            </List>
                                        </Table.Cell>,
                                        <Table.Cell
                                            key={'vcrsr-cl2-'+idx}
                                            verticalAlign='top'
                                            textAlign='right'>
                                            <List>
                                                <List.Item>
                                                    <List.Header>
                                                        {
                                                            moment(
                                                                sensor.phenomenon_time.timePeriod.end
                                                            ).format('DD.MM.YYYY H:m')
                                                        }
                                                    </List.Header>
                                                    <span style={{color: '#787878'}}>
                                                    {moment(
                                                        sensor.phenomenon_time.timePeriod.end
                                                    ).fromNow()}
                                                    </span>
                                                </List.Item>
                                            </List>
                                        </Table.Cell>
                                    ]}
                                    <Table.Cell
                                        verticalAlign='top'
                                        textAlign='right'>
                                        {
                                            sensor.phenomenon_time === null?
                                            <Icon
                                                circular
                                                name='lock'/>:
                                            <Icon
                                                circular
                                                name={
                                                    viewer.ids.indexOf(sensor.id)>-1?
                                                    'minus': 'add'
                                                }
                                                style={{cursor: "pointer"}}
                                                inverted={
                                                    viewer.ids.indexOf(sensor.id)===-1
                                                }
                                                /*color={
                                                    viewer.ids.indexOf(sensor.id)>-1? 'green': null
                                                }
                                                disabled={
                                                    viewer.ids.indexOf(sensor.id)>-1
                                                }*/
                                                onClick={(e) => {
                                                    if(viewer.ids.indexOf(sensor.id)>-1){
                                                        removeSensor(sensor);
                                                        if(viewer.sensors.length===0){
                                                            resetChart();
                                                        }
                                                    }else{
                                                        addSensor(sensor)
                                                    }
                                                }}>
                                            </Icon>
                                        }
                                    </Table.Cell>
                                </Table.Row>
                            ))}
                            </Table.Body>
                        </Table>: null
                    }
                    {
                        viewer.mode === 1 && viewer.sensors.length > 0?
                        <Table
                            singleLine
                            basic='very'
                            size='small'>
                            <Table.Header>
                                <Table.Row>
                                    <Table.HeaderCell
                                        collapsing
                                        textAlign='left'>
                                        Name
                                    </Table.HeaderCell>
                                    <Table.HeaderCell
                                        collapsing
                                        textAlign='left'>
                                        Observed properties
                                    </Table.HeaderCell>
                                    <Table.HeaderCell
                                        collapsing
                                        textAlign='right'>
                                        Begin
                                    </Table.HeaderCell>
                                    <Table.HeaderCell
                                        collapsing
                                        textAlign='right'>
                                        End
                                    </Table.HeaderCell>
                                    <Table.HeaderCell
                                        collapsing
                                        textAlign='right'>
                                        <Icon name='remove' />
                                    </Table.HeaderCell>
                                </Table.Row>
                            </Table.Header>
                            <Table.Body>
                            {viewer.sensors.map((sensor, idx) => (
                                <Table.Row
                                    key={"vcrl-"+idx}>
                                    <Table.Cell
                                        verticalAlign='top'>
                                        <div style={{fontWeight: 'bold'}}>
                                            {sensor.name}
                                        </div>
                                    </Table.Cell>
                                    <Table.Cell
                                        textAlign='left'>
                                        <List>
                                        {sensor.observable_properties.map((op, idx) => (
                                            op.type !== setting._COMPLEX_OBSERVATION?
                                            <List.Item key={"isc-sel-"+idx}>
                                                <List.Header>
                                                    {op.name} ({op.uom})
                                                </List.Header>
                                                <span style={{color: '#787878'}}>
                                                    {op.type.replace(setting._typedef, '')}
                                                </span>
                                            </List.Item>: null
                                        ))}
                                        </List>
                                    </Table.Cell>
                                    <Table.Cell
                                        verticalAlign='top'
                                        textAlign='right'>
                                        <List>
                                            <List.Item>
                                                <List.Header>
                                                    {
                                                        moment(
                                                            sensor.phenomenon_time.timePeriod.begin
                                                        ).format('DD.MM.YYYY H:m')
                                                    }
                                                </List.Header>
                                                <span style={{color: '#787878'}}>
                                                {moment(
                                                    sensor.phenomenon_time.timePeriod.begin
                                                ).fromNow()}
                                                </span>
                                            </List.Item>
                                        </List>
                                    </Table.Cell>
                                    <Table.Cell
                                        verticalAlign='top'
                                        textAlign='right'>
                                        <List>
                                            <List.Item>
                                                <List.Header>
                                                    {
                                                        moment(
                                                            sensor.phenomenon_time.timePeriod.end
                                                        ).format('DD.MM.YYYY H:m')
                                                    }
                                                </List.Header>
                                                <span style={{color: '#787878'}}>
                                                {moment(
                                                    sensor.phenomenon_time.timePeriod.end
                                                ).fromNow()}
                                                </span>
                                            </List.Item>
                                        </List>
                                    </Table.Cell>
                                    <Table.Cell
                                        verticalAlign='top'
                                        textAlign='right'>
                                        <Icon
                                            circular
                                            name='remove'
                                            //floated='right'
                                            style={{cursor: "pointer"}}
                                            onClick={(e) => {
                                                removeSensor(sensor);
                                                if(viewer.sensors.length===0){
                                                    resetChart();
                                                }
                                            }}>
                                        </Icon>
                                        <Icon
                                            circular
                                            name='ellipsis vertical'/>
                                    </Table.Cell>
                                </Table.Row>
                            ))}
                            </Table.Body>
                        </Table>: viewer.mode === 1 && viewer.sensors.length === 0 ?
                            <Message>
                                <Message.Header>
                                    Nothing to show
                                </Message.Header>
                                <p>
                                    To enable the viewer, you have to add here
                                    some of the registered sensors.
                                </p>
                            </Message>: null
                    }
                    </div>
                </div>
                {
                    viewer.mode === 0 ?
                    <div key='vc-sns-map' style={{
                            flex: 1,
                            flexGrow: 1,
                            padding: '0px'
                        }}>
                        <Mappa
                            highlighted={viewer.ids}
                            fois={{
                                isFetching: viewer.isFetchingResult,
                                fcnt: viewer.fcnt,
                                data: viewer.search_results
                            }}/>
                    </div>: <Chart/>
                }
            </div>
        )
    }
};

export default ViewerComponent;
