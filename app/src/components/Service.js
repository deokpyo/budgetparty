import React, { Component } from 'react'
import { Link } from 'react-router-dom'

import Navigation from './Navigation'
import PartyLevelHeader from './PartyLevelHeader'
import levels from '../data/levels.js'

export default class Service extends Component {
  render () {
    let service = levels[this.props.match.params.id]

    const { totalSections, completeSections } = service
    const isComplete = totalSections - completeSections === 0

    return (
      <div>
        <Navigation {...this.props}
          service={service}
          isAuthed={this.props.isAuthed}
          handleLogout={this.props.handleLogout}
        />

        <div className="Service">

          <PartyLevelHeader {...this.props} service={service} />

          <div className="Service__body">
            <h1 className="Service__title">{service.title}</h1>
            <p className="Service__desc">{service.desc}</p>
          </div>

          {
            isComplete ?
              <div className="Service__review-buttons">
                <Link to={`/service/${service.index}/department/1`}
                  className="Service__edit-button">
                  Revise
                </Link>
                <Link to="/dashboard"
                  className="Service__done-button">
                  Done
                </Link>
              </div>
            :
              <Link to={`/service/${service.index}/department/1`}
                className="Service__next-button"
              >
                {(service.index + 1) < levels.length ? 'Start Budgeting' : 'Review Final Budget'}
              </Link>
          }

        </div>

      </div>
    )
  }
}