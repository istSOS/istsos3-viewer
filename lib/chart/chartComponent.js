import React from 'react';

import echarts from 'echarts';
import moment from 'moment';

// istSOS Viewer components
import DataTable from '../table/tableContainer';

// Semantic UI components
import {
    Form,
    Button,
    Dimmer,
    Segment,
    Icon,
    Header,
    Label,
    Table,
    Menu,
    Dropdown
} from 'semantic-ui-react';

class ChartComponent extends React.Component {

    constructor(props) {
        super(props);
        window.__DEV__ = true;
        this.myChart = null;
    }

    get_options(viewer){
        const {
            itemOver
        } = this.props;

        let options = {
            color: viewer.colors,
            tooltip: {
                trigger: 'axis',
                formatter: function (params) {
                    var data = params.data || [0, 0];
                    let item = null;
                    let popup = '';
                    if(params.length>0){
                        item = {
                            "e": params[0].axisValue,
                            "i": params[0].dataIndex
                        };
                        popup = params[0].axisValue + "\n";
                        params.forEach(function(rec) {
                            item[rec.seriesName] = rec.value;
                            popup = popup + " > ";
                        });
                    }
                    itemOver(item);
                    //return false; //data[0].toFixed(2) + ', ' + data[1].toFixed(2);
                }
            },
            grid: {
                top: 50,
                left: 80,
                right: 80,
                bottom: 60
            },
            toolbox: {
                show: false
                /*feature: {
                    dataZoom: {
                        yAxisIndex: 'none'
                    },
                    dataView: {readOnly: false},
                    restore: {},
                    saveAsImage: {}
                }*/
            },
            brush: {
                xAxisIndex: 'all',
                brushLink: 'all',
                transformable: false,
                brushStyle: {
                    borderWidth: 1,
                    color: 'rgba(120, 120, 120, 0.1)',
                    borderColor: 'rgba(120, 120, 120, 0.5)'
                },
                outOfBrush: {
                    colorAlpha: 0.8
                }
                /*outOfBrush: {
                    colorAlpha: 0.1
                }*/
            },
            animation: false,
            xAxis: {
                type: 'category',
                data: []
            },
            yAxis: {
                type: 'value',
                name: "",
                scale: true
            },
            series: []
        };
        // Plot grouping by uom or observed property
        let ob1 = [], ob2 = [], uom1 = null, uom2 = null;
        if(viewer.axisDomain === 0){
            ob1.push(viewer.observedProperty1);
            uom1 = viewer.observedProperty1.uom;
            if(viewer.observedProperty2 !== null){
                ob2.push(viewer.observedProperty2);
                uom2 = viewer.observedProperty2.uom;
            }
        }else if (viewer.axisDomain === 1) {
            uom1 = viewer.uom1.name;
            if(viewer.uom2 !== null){
                uom2 = viewer.uom2.name;
            }
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
        if(ob2.length > 0){
            options.yAxis = [
                {
                    type: 'value',
                    name: uom1,
                    scale: true
                },{
                    type: 'value',
                    name: uom2,
                    scale: true
                }
            ]
        }else if (ob1.length > 0) {
            options.yAxis = {
                type: 'value',
                name: uom1,
                scale: true
            }
        }

        if (viewer.data !== null){
            options['dataZoom'] = [
                {
                    type: 'inside'
                },{
                    id: 'dataZoomX',
                    type: 'slider',
                    xAxisIndex: [0],
                    filterMode: 'filter'
                }
            ];
            options.xAxis.data = viewer.data.e;
            let defs1 = ob1.map(ob => ob.definition);
            let defs2 = ob2.map(ob => ob.definition);
            for (let i = 0; i < viewer.sensors.length; i++) {
                const sensor = viewer.sensors[i];
                for (let ii = 0; ii < sensor.observable_properties.length; ii++) {
                    const op = sensor.observable_properties[ii];
                    if(defs1.indexOf(op.definition)>-1){
                        let s1 = {
                            name: op.column, //op.name + "@" + sensor.name,
                            //type: "line",
                            data: viewer.data[op.column],
                            //smooth: true
                        }
                        if(viewer.settings.s1.type === 'line'){
                            s1['type'] = 'line';
                            /*s1['lineStyle'] = {
                                color: '#ff8cfd'
                            }*/
                        }else if (viewer.settings.s1.type === 'area') {
                            s1['type'] = 'line';
                            s1['areaStyle'] = {};
                        }else if (viewer.settings.s1.type === 'scatter') {
                            s1['type'] = 'scatter';
                            s1['symbolSize'] = 10;
                        }else if (viewer.settings.s1.type === 'bar') {
                            s1['type'] = 'bar';
                        }else if (viewer.settings.s1.type === 'point') {
                            s1['type'] = 'line';
                            s1['lineStyle'] = {
                                type: 'dotted'
                            }
                        }else{
                            s1['type'] = 'line';
                        }
                        options.series.push(s1)
                    }else if (defs2.indexOf(op.definition)>-1) {
                        let s2 = {
                            name: op.column, //op.name + "@" + sensor.name,
                            yAxisIndex: 1,
                            data: viewer.data[op.column],
                            //smooth: true
                        };

                        if(viewer.settings.s2.type === 'line'){
                            s2['type'] = 'line';
                        }else if (viewer.settings.s2.type === 'area') {
                            s2['type'] = 'line';
                            s2['areaStyle'] = {};
                        }else if (viewer.settings.s2.type === 'scatter') {
                            s2['type'] = 'scatter';
                            s2['symbolSize'] = 10;
                        }else if (viewer.settings.s2.type === 'bar') {
                            s2['type'] = 'bar';
                        }else if (viewer.settings.s2.type === 'point') {
                            s2['type'] = 'line';
                            s2['lineStyle'] = {
                                type: 'dotted'
                            }
                        }else{
                            s2['type'] = 'line';
                        }
                        options.series.push(s2);
                    }
                }
            }
        }
        return options;
    }

    componentDidMount(){
        const {
            viewer
        } = this.props;

        // Prepare series
        this.myChart = echarts.init(
            document.getElementById('vis')
        );

        //if(viewer.sensors.length>0){
        if(viewer.dataCnt>0){
            this.myChart.setOption(this.get_options(viewer));
        }
        /*this.myChart.on('brushSelected', function (params) {
            console.log(params.batch[0].areas[0].coordRange);
        });*/

        /*this.myChart.on('click', function(event){
            console.log(event);
        }, this);
        this.myChart.on('mousemove', function(event){
            console.log(event);
        }, this);*/
    }

    componentWillReceiveProps(nextProps) {
        const nextViewer = nextProps.viewer;
        const {
            viewer
        } = this.props;

        if(nextViewer.cnt !== viewer.cnt){
            console.log("Updating chart..");
            if(nextViewer.dataCnt===0){
                this.myChart.clear();
            }else {
                this.myChart.clear();
                this.myChart.setOption(
                    this.get_options(nextViewer)
                );
            }
            /*if(nextChart.data !== null && nextChart.data.hasOwnProperty('e') && nextChart.data.e.length>=100){
                this.myChart.dispatchAction({
                    type: 'brush',
                    areas: [
                        {
                            brushType: 'lineX',
                            coordRange: [
                                nextChart.data.e[0],
                                nextChart.data.e[100]
                            ],
                            xAxisIndex: 0
                        }
                    ]
                });
            }*/
        }

        if(viewer.brushCnt !== nextViewer.brushCnt){
            this.myChart.dispatchAction({
                type: 'brush',
                areas: [
                    {
                        brushType: 'lineX',
                        coordRange: nextViewer.brush,
                        xAxisIndex: 0
                    }
                ]
            });
        }
    }

    onChartClick(event){
        const {
            viewer,
            // setBrushStart,
            // setBrushEnd,
            // resetBrush,
            chartClick
        } = this.props;

        if(viewer.item !== null){
            chartClick(viewer.item);
        }
        /*if(event.ctrlKey){
            resetBrush();
        }else if(event.shiftKey){
            setBrushEnd(viewer.item.et);
        }else{
            setBrushStart(viewer.item.et);
        }*/
    }

    render() {
        const {
            viewer,
            setRange,
            observedPropertySelected1,
            observedPropertySelected2,
            resetChart,
            fetchObservations,
            trendVisible,
            s1Type,
            s2Type
        } = this.props;

        return (
            <Dimmer.Dimmable dimmed={viewer.sensors.length===0}
                style={{
                    display: 'flex',
                    flex: 1,
                    flexDirection: 'column',
                    //width: '100%',
                    //height: '100%'
                }}>
                <Dimmer active={viewer.sensors.length===0}>
                    <Header as='h2' icon inverted>
                        Add some sensors to start analyzing your data
                    </Header>
                </Dimmer>

                    {
                        viewer.data === null || viewer.data.length===0?
                        null: <Menu style={{margin: '1rem 1rem 0px 1rem'}} secondary>
                            <Dropdown text='File' className='link item'>
                                <Dropdown.Menu>
                                    <Dropdown.Item>New</Dropdown.Item>
                                    <Dropdown.Divider />
                                    <Dropdown.Item>Open</Dropdown.Item>
                                    <Dropdown.Item>
                                        <Dropdown text='Recents'>
                                            <Dropdown.Menu>
                                                <Dropdown.Item>rainfull at Lugano</Dropdown.Item>
                                                <Dropdown.Item>temperature at Bellinzona</Dropdown.Item>
                                            </Dropdown.Menu>
                                        </Dropdown>
                                    </Dropdown.Item>
                                    <Dropdown.Divider />
                                    <Dropdown.Item>Save</Dropdown.Item>
                                    <Dropdown.Item>Save chart as...</Dropdown.Item>
                                    <Dropdown.Divider />
                                    <Dropdown.Item
                                        onClick={e=>{
                                            var link = document.createElement('a');
                                            document.body.appendChild(link);
                                            link.href = this.myChart.getDataURL().replace("image/png", "image/octet-stream");
                                            link.download = "istsos-chart.png";
                                            link.click();
                                        }}>Download chart...</Dropdown.Item>
                                    <Dropdown.Item>Download data...</Dropdown.Item>
                                    <Dropdown.Divider />
                                    <Dropdown.Item>Preferences</Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                            <Dropdown text='Y-Axis 1' className='link item'>
                                <Dropdown.Menu>
                                    <Dropdown.Header>Type</Dropdown.Header>
                                    <Dropdown.Item
                                        onClick={e=>{
                                            s1Type('line')
                                        }}>
                                        <Icon
                                            name={
                                                viewer.settings.s1.type === 'line'?
                                                'dot circle outline': 'circle outline'
                                            }
                                            color={
                                                viewer.settings.s1.type === 'line'?
                                                'blue': 'grey'
                                            }/> Line
                                    </Dropdown.Item>
                                    <Dropdown.Item
                                        onClick={e=>{
                                            s1Type('point')
                                        }}>
                                        <Icon
                                            name={
                                                viewer.settings.s1.type === 'point'?
                                                'dot circle outline': 'circle outline'
                                            }
                                            color={
                                                viewer.settings.s1.type === 'point'?
                                                'blue': 'grey'
                                            }/> Point
                                    </Dropdown.Item>
                                    <Dropdown.Item
                                        onClick={e=>{
                                            s1Type('area')
                                        }}>
                                        <Icon
                                            name={
                                                viewer.settings.s1.type === 'area'?
                                                'dot circle outline': 'circle outline'
                                            }
                                            color={
                                                viewer.settings.s1.type === 'area'?
                                                'blue': 'grey'
                                            }/> Area
                                    </Dropdown.Item>
                                    <Dropdown.Item
                                        onClick={e=>{
                                            s1Type('bar')
                                        }}>
                                        <Icon
                                            name={
                                                viewer.settings.s1.type === 'bar'?
                                                'dot circle outline': 'circle outline'
                                            }
                                            color={
                                                viewer.settings.s1.type === 'bar'?
                                                'blue': 'grey'
                                            }/> Bar
                                    </Dropdown.Item>
                                    <Dropdown.Item
                                        onClick={e=>{
                                            s1Type('scatter')
                                        }}>
                                        <Icon
                                            name={
                                                viewer.settings.s1.type === 'scatter'?
                                                'dot circle outline': 'circle outline'
                                            }
                                            color={
                                                viewer.settings.s1.type === 'scatter'?
                                                'blue': 'grey'
                                            }/> Scatter
                                    </Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                            {
                                (
                                    viewer.axisDomain === 0 && viewer.observedProperty2 === null
                                ) || (
                                    viewer.axisDomain === 1 && viewer.uom2 === null
                                )? null:
                                <Dropdown text='Y-Axis 2' className='link item'>
                                    <Dropdown.Menu>
                                        <Dropdown.Header>Type</Dropdown.Header>
                                        <Dropdown.Item
                                            onClick={e=>{
                                                s2Type('line')
                                            }}>
                                            <Icon
                                                name={
                                                    viewer.settings.s2.type === 'line'?
                                                    'dot circle outline': 'circle outline'
                                                }
                                                color={
                                                    viewer.settings.s2.type === 'line'?
                                                    'blue': 'grey'
                                                }/> Line
                                        </Dropdown.Item>
                                        <Dropdown.Item
                                            onClick={e=>{
                                                s2Type('point')
                                            }}>
                                            <Icon
                                                name={
                                                    viewer.settings.s2.type === 'point'?
                                                    'dot circle outline': 'circle outline'
                                                }
                                                color={
                                                    viewer.settings.s2.type === 'point'?
                                                    'blue': 'grey'
                                                }/> Point
                                        </Dropdown.Item>
                                        <Dropdown.Item
                                            onClick={e=>{
                                                s2Type('area')
                                            }}>
                                            <Icon
                                                name={
                                                    viewer.settings.s2.type === 'area'?
                                                    'dot circle outline': 'circle outline'
                                                }
                                                color={
                                                    viewer.settings.s2.type === 'area'?
                                                    'blue': 'grey'
                                                }/> Area
                                        </Dropdown.Item>
                                        <Dropdown.Item
                                            onClick={e=>{
                                                s2Type('bar')
                                            }}>
                                            <Icon
                                                name={
                                                    viewer.settings.s2.type === 'bar'?
                                                    'dot circle outline': 'circle outline'
                                                }
                                                color={
                                                    viewer.settings.s2.type === 'bar'?
                                                    'blue': 'grey'
                                                }/> Bar
                                        </Dropdown.Item>
                                        <Dropdown.Item
                                            onClick={e=>{
                                                s2Type('scatter')
                                            }}>
                                            <Icon
                                                name={
                                                    viewer.settings.s2.type === 'scatter'?
                                                    'dot circle outline': 'circle outline'
                                                }
                                                color={
                                                    viewer.settings.s2.type === 'scatter'?
                                                    'blue': 'grey'
                                                }/> Scatter
                                        </Dropdown.Item>
                                    </Dropdown.Menu>
                                </Dropdown>
                            }
                            <Dropdown text='Table data' className='link item'>
                                <Dropdown.Menu>
                                    <Dropdown.Item
                                        onClick={e=>{
                                            trendVisible(
                                                !viewer.settings.trend
                                            )
                                        }}>
                                        <Icon
                                            name='check'
                                            color={
                                                viewer.settings.trend?
                                                'blue': 'grey'
                                            }/> trend
                                    </Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                        </Menu>
                    }
                    <div ref={(el) => this.cEl = el}
                        style={{
                            width: '100%',
                            //height: '50%'
                            flex: '1 0 0%'
                        }}
                        id="vis"
                        onClick={(e)=>{
                            this.onChartClick(e)
                        }}>
                    </div>
                    <div
                        style={{
                            width: '100%',
                            //height: '50%'
                            flex: '1 0 0%',
                            display: 'flex',
                            flexDirection: 'column'
                            //padding: '1rem 82px'
                        }}>
                        <DataTable/>
                    </div>
            </Dimmer.Dimmable>
        )
    }

};

export default ChartComponent;
