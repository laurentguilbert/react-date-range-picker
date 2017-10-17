import { render } from 'react-dom'
import React, { Component } from 'react'

import DateRangePicker from '../src/index'


class App extends Component {

  render() {
    const now = new Date()
    const year = now.getFullYear()
    const month = now.getMonth()
    const date = now.getDate()
    const excludedDates = [
        new Date(year, month, date + 5).toDateString(),
        new Date(year, month, date + 10).toDateString(),
        new Date(year, month + 1, 8).toDateString(),
    ]
    return (
      <DateRangePicker
        onDateRangeChange={(start, end) => console.log(start, end)}
        allowPastRange={false}
        excludedDates={excludedDates}
      />
    )
  }
}

render(
  <App />,
  document.getElementById('root')
)
