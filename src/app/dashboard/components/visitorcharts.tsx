'use client'
import dynamic from 'next/dynamic'

export default function VisitorsChart() {

  return (

    <div className="h-100">
        <div className="card o-hidden  ">
            <div className="card-header">
                <div className="d-flex align-items-center justify-content-between">
                    <div className="card-header-title">
                        <h4>Visitors </h4>

                    </div>
                    <div className="dropdown">
                        <button className="btn dropdown-toggle" id="dropdownMenuButton"
                            type="button" data-bs-toggle="dropdown"
                            aria-expanded="false">Weekly</button>
                        <div className="dropdown-menu dropdown-menu-end"
                            aria-labelledby="dropdownMenuButton"><a className="dropdown-item"
                                href="index.html#">Weekly</a><a className="dropdown-item"
                                href="index.html#">Monthly</a><a className="dropdown-item" href="index.html#">Yearly</a>
                        </div>
                    </div>
                </div>
            </div>
            <div className="card-body ">
                <div className="pie-chart">
                    <div id="pie-chart-visitors"></div>
                </div>
            </div>
        </div>
    </div>
  )
}