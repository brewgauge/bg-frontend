'use strict'

import React from 'react'
import {connect} from 'react-redux'
import {Link} from 'react-router'
import {Panel, PageHeader, InfoCell}  from '../components/index'
import ChartistGraph from 'react-chartist'
import {subscribe, unsubscribe} from '../actions/sensor'
import _ from 'lodash'

export const Overview = React.createClass({
  componentDidMount () {
    this.props.dispatch(subscribe())
  },

  componentWillUnmount () {
    this.props.dispatch(unsubscribe())
  },

  render () {
    var sections = []
    var data = this.props.sensor

    _.each(data, (board) => {
      var proc_sections = []
      var tag = board.board
      var key = board.board

      _.each(board.channels, (channel) => {
        proc_sections.push(makeChannelSections(channel))
      })

      sections.push(
        <div key={board.board} className="process-group panel">
          <div className="panel-heading cf">
            <h3 className="m0 fl-left"><strong>Board: {tag}</strong></h3>
            <a href="" className="fl-right icon icon-collapse"></a>
          </div>

          <div className="panel-body">
            {proc_sections}
          </div>
        </div>
      )
    })



    return (
      <div className="page page-processes">
        <div className="container-fluid">
          <PageHeader title={'Sensors'} />
        </div>

        <div className="container-fluid">
          {sections}
        </div>
      </div>
   )
  }
})

export default connect((state) => {
  var sensor = state.sensor.data

  return {
    sensor: sensor
  }
})(Overview)

function makeChannelSections (channel) {
  console.log(channel)

  return (
    <div key={channel.channel} className="process-card">
      <div className="process-heading has-icon">
        <span className="status status-healthy status-small" title="Status: healthy"></span>
        {`Channel: ${channel.channel}`}
      </div>

      <div className="row middle-xs process-stats-row no-gutter">
        <InfoCell title={'Type'} value={'Temp'} />
      </div>

      <div className="row middle-xs no-gutter">
        <div className="col-xs-12 mt">
          <ChartistGraph
            type={'Line'}
            data={{labels: channel.time, series: [channel.temp]}}
            options={{
              fullWidth: true,
              showArea: true,
              showLine: true,
              showPoint: true,
              chartPadding: {right: 30},
              axisX: {labelOffset: {x: -15}, labelInterpolationFnc: (val) => {
                var foo = new Date(val)

                console.log(foo)

                return '' + foo.getHours() + ':' + foo.getMinutes() + ':' + foo.getSeconds()
              }},
            }}/>
        </div>
      </div>
    </div>
  )
}
