'use strict'

import React from 'react'
import {connect} from 'react-redux'
import {Link} from 'react-router'
import {Panel, PageHeader, HealthList} from '../components/index'
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

    const temp = this.props.temperature

    console.log(this.props.temperature)

    var groups = _.groupBy(temp, 'board_id')
    _.each(groups, (group) => {
      if (group) {
        var proc_sections = []
        var data = _.orderBy(group, ['pid'], ['desc'])
        var count = data.length
        var tag = ''

        _.each(data, (process) => {
          if (process) {
            tag = process.tag
            var event_loop = _.find(this.props.event_loop_stats, ['pid', process.pid])
            proc_sections.push(make_process_sections(process, event_loop))
          }
        })

        sections.push(
          <div key={tag} className="process-group panel">
            <div className="panel-heading cf">
              <h3 className="m0 fl-left">Processes tagged with <strong>{tag}</strong></h3>
              <a href="" className="fl-right icon icon-collapse"></a>
            </div>

            <div className="panel-body">
              <HealthList count={count}/>
              {proc_sections}
            </div>
          </div>
        )
      }
    })



    return (
      <div className="page page-processes">
        <div className="container-fluid">
          <PageHeader title={'Overview'} />
        </div>

        <div className="container-fluid">
          {sections}
        </div>
      </div>
   )
  }
})

export default connect((state) => {
  return {
    temperature: state.sensor.data
  }
})(Overview)

function make_search () {
  return (
    <div className="row middle-xs search-wrapper">
      <div className="col-xs-12 col-sm-8 col-md-8 search-input-wrapper">
        <input type="search" className="input-large" placeholder="Find a process"/>
      </div>
      <div className="col-xs-12 col-sm-4 col-md-4 txt-left search-btn-wrapper">
        <button className="btn btn-large btn-search">Search</button>
      </div>
    </div>
  )
}

function make_process_sections (data, event_loop) {
  var section = []
  var now = data.latest

  var delay  = (Math.round(event_loop.latest.delay * 100) / 100)
  var link = `/process/${now.pid}`

  return (
    <div key={now.pid} className="process-card">
      <div className="process-heading has-icon">
        <span className="status status-healthy status-small" title="Status: healthy"></span>
        <Link to={link}>{now.pid}</Link>
      </div>

      <div className="process-stats-row cf row no-gutter">
        <div className="col-xs-12 col-sm-6 col-md-3 col-lg-3 process-stats-container process-stats-floated">
          <ul className="list-unstyled list-inline cf">
            <li><h4 className="m0">Process uptime:</h4></li>
            <li>{now.proc_uptime}</li>
          </ul>
        </div>

        <div className="col-xs-12 col-sm-6 col-md-3 col-lg-3 process-stats-container process-stats-floated">
          <ul className="list-unstyled list-inline cf">
            <li><h4 className="m0">System uptime:</h4></li>
            <li>{now.sys_uptime}</li>
          </ul>
        </div>

        <div className="col-xs-12 col-sm-6 col-md-3 col-lg-3 process-stats-container process-stats-floated">
          <ul className="list-unstyled list-inline cf">
            <li><h4 className="m0">Heap usage:</h4></li>
            <li>{`${now.heap_used} out of ${now.heap_total} (${now.heap_rss} RSS)`}</li>
          </ul>
        </div>

        <div className="col-xs-12 col-sm-6 col-md-3 col-lg-3 process-stats-container process-stats-floated">
          <ul className="list-unstyled list-inline cf">
            <li><h4 className="m0">Event loop:</h4></li>
            <li>{`${delay}s delay (${event_loop.latest.limit}s limit)`}</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
