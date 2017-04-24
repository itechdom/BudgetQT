"use strict"

var React = require('react');
var ReactDOM = require('react-dom');

export default class Stats extends React.Component{
  // load your general data
  constructor(props){
    super(props);
    this.chartData = [
      {
        name: "Lavon Hilll I",
        BMI: 20.57,
        age: 12,
        birthday: "1994-10-26T00:00:00.000Z",
        city: "Annatown",
        married: true,
        index: 1
      },
      {
        name: "Clovis Pagac",
        BMI: 24.28,
        age: 26,
        birthday: "1995-11-10T00:00:00.000Z",
        city: "South Eldredtown",
        married: false,
        index: 3
      },
      {
        name: "Gaylord Paucek",
        BMI: 24.41,
        age: 30,
        birthday: "1975-06-12T00:00:00.000Z",
        city: "Koeppchester",
        married: true,
        index: 5
      },
      {
        name: "Ashlynn Kuhn MD",
        BMI: 23.77,
        age: 32,
        birthday: "1985-08-09T00:00:00.000Z",
        city: "West Josiemouth",
        married: false,
        index: 6
      }
    ]
    this.width = 700;
    this.height = 300;
    this.margins = {left: 100, right: 100, top: 50, bottom: 50};
    this.title = "User sample";
    // chart series,
    // field: is what field your data want to be selected
    // name: the name of the field that display in legend
    // color: what color is the line
    this.chartSeries = [
      {
        field: 'BMI',
        name: 'BMI',
        color: '#ff7f0e'
      }
    ];
    // your x accessor
    this.x = function(d) {
      return d.index;
    }

  }

  render(){
    return <div>Stats</div>
  }

}
