'use strict'

import React from 'react'

export default React.createClass({
  render () {
    return (
      <footer className="footer txt-small txt-dimmed mb mt txt-center has-icon" role="contentinfo">
        <div className="container-fluid">
          <a href="https://github.com/brewgauge/bg-dashboard/issues" className="icon icon-bug icon-dimmed"></a>
          <p className="m0">{'MIT. Copyright (c) 2016. Brewgauge'}</p>
        </div>
      </footer>
    )
  }
})
