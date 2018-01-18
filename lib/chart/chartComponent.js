import React from 'react';
import vegaEmbed from 'vega-embed';
import {vegaLite} from 'vega-tooltip';
import 'vega-tooltip/src/vega-tooltip.css';

import {
    changeset
} from 'vega';

// istSOS components
import {
    DateRange,
    ObservableProperties
} from 'istsos3-core';

// Semantic UI components
import {
    Form,
    Button,
    Dimmer,
    Segment,
    Icon,
    Header
} from 'semantic-ui-react';

class ChartComponent extends React.Component {

    init_vega(){
        const {
            chart,
            offerings
        } = this.props;

        if(offerings.length>0 && vegaEmbed){
            //console.log(this.cEl.clientHeight, this.cEl.clientWidth);
            let self = this;
            let vgSpec = {
                "$schema": "https://vega.github.io/schema/vega-lite/v2.json",
                "description": "Google's stock price over time.",
                "height": this.cEl.clientHeight - 100,
                "width": this.cEl.clientWidth - 200,
                "config": {
                    "background": "#F0F0F0"
                },
                "data": {
                    "name": "a"//chart.data,
                },
                "vconcat": [
                    {
                        "mark": "line",
                        "height": this.cEl.clientHeight - 160,
                        "width": this.cEl.clientWidth - 200,
                        "encoding": {
                            "x": {
                                "field": "e",
                                "scale": {
                                    "domain": {
                                        "selection": "brush"
                                    }
                                },
                                "type": "temporal",
                                "axis": {
                                    "format": "%m.%d %H:%M"
                                }
                            },
                            "y": {
                                "field": "a",
                                "type": "quantitative"
                            },
                            "color": {
                                "field": "o",
                                "type": "nominal"
                            }
                        }
                    },
                    {
                        "mark": "area",
                        "height": 60,
                        "width": this.cEl.clientWidth - 200,
                        "selection": {
                            "brush": {
                                "type": "interval",
                                "encodings": ["x"]
                            }
                        },
                        "encoding": {
                            "x": {
                                "field": "e",
                                "type": "temporal"
                            },
                            "y": {
                                "field": "a",
                                "type": "quantitative",
                                "axis": {
                                    "tickCount": 10,
                                    "grid": false
                                }
                            },
                            "color": {
                                "field": "o",
                                "type": "nominal"
                            }
                        }
                    }
                ]
            };
            vegaEmbed("#vis", vgSpec).then(function(res) {
                self.view = res.view;
                debugger;
                vegaLite(res.view, vgSpec, {
                    showAllFields: false,
                    fields: [
                        {
                            field: "a",
                            title: "Field One",
                            formatType: "number"
                        }
                    ],
                    delay: 250,
                    colorTheme: "dark"
                });
                if(chart.cnt > 0){
                    self.view.insert(
                        'a',
                        chart.data
                    ).run();
                }
            }, function() {
                //console.log(arguments);
            });
        }
    }

    componentDidMount(){
        this.init_vega();
    }

    componentWillReceiveProps(nextProps) {
        const nextChart = nextProps.chart;
        const {
            chart,
            resetChart
        } = this.props;

        if(chart.observedProperty1 && nextChart.observedProperty1
            && (
                chart.observedProperty1.definition !== nextChart.observedProperty1.definition
            )){
            resetChart();
        }

        if(nextChart.cnt !== chart.cnt){
            //this.view.insert("a", nextChart.data).run();
            if(chart.cnt==0){
                this.view.insert(
                    'a',
                    nextChart.data
                ).run();
            }else{
                this.view.change(
                    'a',
                    changeset().insert(nextChart.data).remove(chart.data)
                ).run();
            }
        }
    }

    render() {
        const {
            chart,
            offerings,
            observed_properties,
            setRange,
            observedPropertySelected1,
            fetchObservations
        } = this.props;
        let op1 = undefined;
        console.log(chart.observedProperty1);
        if(chart.observedProperty1){
            op1 = chart.observedProperty1.definition;
        }else if(observed_properties.length>0){
            op1 = observed_properties[0].definition;
        }
        console.log(op1);
        return (
            <div style={{
                    display: 'flex',
                    flex: 1,
                    flexDirection: 'column',
                    height: '100%'
                }}>
                <Dimmer.Dimmable dimmed={offerings.length===0}
                    style={{
                        width: '100%',
                        height: '100%'
                    }}>
                    <Dimmer active={offerings.length===0}>
                        <Header as='h2' icon inverted>
                            Add some sensors to start analyzing your data
                        </Header>
                    </Dimmer>
                    <div style={{
                            padding: '0 1.5rem'
                        }}>
                        <Form>
                            <Form.Group widths='equal'>
                                <DateRange
                                    asArray={true}
                                    from={chart.filter.from}
                                    to={chart.filter.to}
                                    onRangeSelected={(range)=>{
                                        setRange(range);
                                    }}/>
                                <ObservableProperties
                                    hideButton={true}
                                    value={op1}
                                    onSelected={observedPropertySelected1}
                                    observed_properties={{
                                        data: observed_properties
                                    }}/>
                                <Button
                                    primary
                                    disabled={offerings.length===0}
                                    onClick={(e)=>{
                                        let offs = [];
                                        for (var i = 0; i < offerings.length; i++) {
                                            offs.push(offerings[i].name);
                                        }
                                        //this.view.remove("a", chart.data).run();
                                        fetchObservations({
                                            "offerings": offs,
                                            "observedProperties": [
                                                "urn:ogc:def:parameter:x-istsos:1.0:meteo:air:temperature"
                                            ],
                                            "temporal": {
                                                "reference": "om:phenomenonTime",
                                                "fes": "during",
                                                "period": [
                                                    chart.filter.from + "T00:00:00Z",
                                                    chart.filter.to + "T23:59:59Z"
                                                ]
                                            },
                                            "responseFormat": "application/json;subtype='vega'"
                                        })
                                    }}>
                                    Plotta
                                </Button>
                            </Form.Group>
                        </Form>
                    </div>
                    <div
                        ref={(el) => this.cEl = el}
                        style={{
                            width: '100%',
                            height: '100%'
                        }} id="vis">
                    </div>
                </Dimmer.Dimmable>
            </div>
        )
    }

};

export default ChartComponent;
