import classNames from 'classnames'
import React, { Component } from 'react'


export default class DateRangePicker extends Component {

  constructor(props) {
    super(props)
    this.now = new Date()
    this.now.setHours(0, 0, 0, 0)

    this.state = {
      startDate: null,
      endDate: null,
      currentMonth: this.now.getMonth(),
      currentYear: this.now.getFullYear()
    }

    this.goToNextMonth = this.goToNextMonth.bind(this)
    this.goToPrevMonth = this.goToPrevMonth.bind(this)

    this.allowPastRange = (this.props.allowPastRange || false)
    this.excludedDates = (this.props.excludedDates || [])
  }

  goToNextMonth() {
    if (this.state.currentMonth === 11) {
      this.setState({currentMonth: 0, currentYear: this.state.currentYear + 1})
    } else {
      this.setState({currentMonth: this.state.currentMonth + 1})
    }
  }

  goToPrevMonth() {
    if (
      this.allowPastRange === false &&
      this.state.currentMonth <= this.now.getMonth() &&
      this.state.currentYear <= this.now.getFullYear()
    ) {
      return
    }
    if (this.state.currentMonth === 0) {
      this.setState({currentMonth: 11, currentYear: this.state.currentYear - 1})
    } else {
      this.setState({currentMonth: this.state.currentMonth - 1})
    }
  }

  getDateRange(startDate, endDate) {
    if (startDate === null) {
      return []
    } else if (endDate === null) {
      return [new Date(startDate.getTime())]
    }

    let dates = []
    let current = new Date(startDate.getTime())
    while (current <= endDate) {
      if (this.excludedDates.indexOf(current.toDateString()) === -1) {
        dates.push(new Date(current.getTime()))
      }
      current.setDate(current.getDate() + 1)
    }
    return dates
  }

  selectDate(date) {
    if (
      this.excludedDates.indexOf(date.toDateString()) !== -1 ||
      (this.allowPastRange === false && date < this.now)
    ) {
      return
    }
    let newState = {
      startDate: this.state.startDate,
      endDate: this.state.endDate
    }
    if (newState.startDate === null) {
      newState.startDate = date
    } else if (newState.endDate === null && newState.startDate <= date) {
      newState.endDate = date
    } else {
      newState = {startDate: date, endDate: null}
    }
    this.setState(newState)
    if (this.props.onDateRangeChange !== undefined) {
      const dates = this.getDateRange(newState.startDate, newState.endDate)
      this.props.onDateRangeChange(dates)
    }
  }

  getDayName(day) {
    const names = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam']
    return names[day]
  }

  getMonthName(month) {
    const names = [
      'Janvier',
      'Février',
      'Mars',
      'Avril',
      'Mai',
      'Juin',
      'Juillet',
      'Août',
      'Septembre',
      'Octobre',
      'Novembre',
      'Décembre'
    ]
    return names[month]
  }

  dateToString(date) {
    return (
      this.getDayName(date.getDay()) + " " +
      date.getDate() + " " +
      this.getMonthName(date.getMonth()).substring(0, 3)
    )
  }

  getDateNodes() {
    let firstDate = new Date(
      this.state.currentYear,
      this.state.currentMonth,
      1
    )
    firstDate.setDate(
      firstDate.getDate() -
      (firstDate.getDay() === 0 ? 6 : firstDate.getDay() - 1)
    )

    let lastDate = new Date(
      this.state.currentYear,
      this.state.currentMonth + 1,
      0
    )
    if (lastDate.getDay() !== 0) {
      lastDate.setDate(lastDate.getDate() + (7 - lastDate.getDay()))
    }

    let dateNodes = []
    let current = new Date(firstDate.getTime())
    while (current <= lastDate) {
      const currentTime = current.getTime()
      const dateClassName = classNames('drp-date', {
        'is-excluded': this.excludedDates.indexOf(current.toDateString()) !== -1,
        'is-disabled': current < this.now && this.allowPastRange === false,
        'is-in-other-month': current.getMonth() !== this.state.currentMonth,
        'is-in-past': current < this.now,
        'is-now': current.toDateString() === this.now.toDateString(),
        'is-start': (
          this.state.startDate !== null &&
          currentTime === this.state.startDate.getTime()
        ),
        'is-end': (
          this.state.endDate !== null &&
          currentTime === this.state.endDate.getTime()
        ),
        'is-in-range': (
          current <= this.state.endDate &&
          current >= this.state.startDate
        ),
        'is-before-start': (
          this.state.startDate !== null &&
          current < this.state.startDate
        )
      })
      dateNodes.push(
        <div
          className={dateClassName}
          key={currentTime}
          onClick={this.selectDate.bind(this, new Date(current.getTime()))}
        >
          <div className='drp-date-content'>
            <div className="drp-date-number">{current.getDate()}</div>
            <div className="drp-date-day">
              {this.getDayName(current.getDay())}
            </div>
          </div>
        </div>
      )
      current.setDate(current.getDate() + 1)
    }
    return dateNodes
  }

  render() {
    const prevButtonClassName = classNames('drp-nav-prev', {
      'is-disabled': (
        this.allowPastRange === false &&
        this.state.currentMonth <= this.now.getMonth() &&
        this.state.currentYear <= this.now.getFullYear()
      )
    })
    return (
      <div className="drp">
        <div className="drp-nav">
          <div className={prevButtonClassName} onClick={this.goToPrevMonth}>
            <i className="fa fa-chevron-left" aria-hidden="true"></i>
          </div>
          <div className="drp-nav-month-name">
            {this.getMonthName(this.state.currentMonth)} {this.state.currentYear}
          </div>
          <div className="drp-nav-next" onClick={this.goToNextMonth}>
            <i className="fa fa-chevron-right" aria-hidden="true"></i>
          </div>
        </div>
        <div className="drp-range">
          <div className="drp-range-start">
            {this.state.startDate !== null ? this.dateToString(this.state.startDate) : "Début"}
          </div>
          <div className="drp-range-end">
            {this.state.endDate !== null ? this.dateToString(this.state.endDate) : "Fin"}
          </div>
        </div>
        <div className="drp-month">
          {this.getDateNodes()}
        </div>
      </div>
    )
  }
}
