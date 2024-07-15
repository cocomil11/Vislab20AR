import React from 'react';
import ReactEcharts from 'echarts-for-react';

export default function LineChart(props) {
    const currentYear = props.currentYear;
    let data = {
        categories: [
            2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016,
            2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024
        ],
        series: [
            {
                name: 'Total Pub',
                type: 'line',
                data: [0, 0, 0, 2, 4, 10, 12, 15, 17, 18, 21, 26, 35, 39, 42, 54, 58, 74, 87, 95, 110]
            },
            {
                name: 'Total Ph.D.',
                type: 'line',
                data: [0, 0, 0, 0, 0, 3, 3, 4, 5, 6, 8, 8, 10, 11, 18, 26, 28, 30, 36, 41, 42]
            },
            {
                name: 'Total MPhil',
                type: 'line',
                data: [0, 0, 1, 1, 2, 6, 6, 9, 10, 10, 11, 11, 14, 14, 17, 19, 22, 24, 28, 30, 30]
            }
        ]
    };
      
    let option = {
        xAxis: {
            type: 'category',
            data: data.categories,
            axisLabel: {
                interval: 4,
                fontSize: 13, 
                color: '#333'
            },
            axisLine: {
                show: false
            },
            axisTick: {
                show: false
            },
            offset: 10,
        },
        yAxis: {
            type: 'value',
            axisLabel: {
                fontSize: 13, 
                color: '#333'
            },
            axisLine: {
                show: false
            },
            axisTick: {
                show: false
            },
            splitLine: {
                show: false
            },
            splitArea: {
                show: false
            }
        },
        series: [
            {
                name: data.series[0].name,
                type: 'line',
                data: data.series[0].data,
                lineStyle: {
                    color: '#5EA8D2',
                    width: 3
                },
                itemStyle: {
                    opacity: 0
                },
                smooth: true,
                z: 10
            },
            {
                name: data.series[1].name,
                type: 'line',
                data: data.series[1].data,
                lineStyle: {
                    color: '#38C4A2',
                    width: 3
                },
                itemStyle: {
                    opacity: 0
                },
                smooth: true,
                z: 8
            },
            {
                name: data.series[2].name,
                type: 'line',
                data: data.series[2].data,
                lineStyle: {
                    color: '#346A64',
                    width: 3
                },
                itemStyle: {
                    opacity: 0
                },
                smooth: true,
                z: 6
            }, 
            {
                name: "",
                type: 'scatter',
                data: [[currentYear.toString(), data.series[0].data[currentYear-2004]]],
                symbol: 'emptyCircle',
                symbolSize: 12,
                itemStyle: {
                    color: '#5EA8D2',
                    borderWidth: 6,
                    opacity: 1 
                },
                z: 12
            }
        ],
        legend: {
            orient: 'vertical',
            left: "12%", //98,
            top: "16%", //50,
            color: "#333",
            fontSize: 7
        }
    };

    return (
        <ReactEcharts
            option={option}
            // notMerge
            // lazyUpdate
            style={{ height: '100%', width: "100%"}} //, marginLeft: '3px'}} //, marginLeft: '-5px', paddingTop: '15px'}}
        />
    );
}
