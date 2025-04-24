'use client'
import { FiTrendingUp, FiTrendingDown, FiDatabase, FiShoppingBag, FiMessageCircle, FiUserPlus } from 'react-icons/fi'

export default function StatsCards() {


  return (
    <>
    <div className="col-sm-6 col-xxl-3 col-lg-6">
                            <div className="b-b-primary border-5 border-0 card o-hidden">
                                <div className="custome-1-bg b-r-4 card-body">
                                    <div className="media align-items-center static-top-widget">

                                        <div className="media-body p-0">
                                            <span className="m-0">Total Earnings</span>
                                            <h4 className="mb-0 counter">6659
                                                <span className="badge badge-light-primary grow  "><FiTrendingUp>
                                                    </FiTrendingUp>8.5%</span>
                                            </h4>

                                        </div>
                                        <div className="align-self-center text-center"><i data-feather="database"></i></div>



                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-sm-6 col-xxl-3 col-lg-6">
                            <div className="b-b-danger border-5  border-0 card o-hidden">
                                <div className=" custome-2-bg  b-r-4 card-body">
                                    <div className="media static-top-widget">

                                        <div className="media-body p-0"><span className="m-0">Total Booking</span>
                                            <h4 className="mb-0 counter">9856
                                                <span className="badge badge-light-danger grow  "><i
                                                        data-feather="trending-down">
                                                    </i>8.5%</span>
                                            </h4>

                                        </div>
                                        <div className="align-self-center text-center"><i data-feather="shopping-bag"></i>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-sm-6 col-xxl-3 col-lg-6">
                            <div className="b-b-secondary border-5 border-0  card o-hidden">
                                <div className=" custome-3-bg b-r-4 card-body">
                                    <div className="media static-top-widget">

                                        <div className="media-body p-0"><span className="m-0">Reviews</span>
                                            <h4 className="mb-0 counter">893
                                                <span className="badge badge-light-secondary grow  "><i
                                                        data-feather="trending-up">
                                                    </i>8.5%</span>
                                            </h4>

                                        </div>
                                        <div className="align-self-center text-center"><i data-feather="message-circle"></i>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-sm-6 col-xxl-3 col-lg-6">
                            <div className="b-b-success border-5 border-0 card o-hidden">
                                <div className=" custome-4-bg b-r-4 card-body">
                                    <div className="media static-top-widget">

                                        <div className="media-body p-0"><span className="m-0">Total User</span>
                                            <h4 className="mb-0 counter">45631
                                                <span className="badge badge-light-success grow"><i
                                                        data-feather="trending-down">
                                                    </i>8.5%</span>
                                            </h4>

                                        </div>
                                        <div className="align-self-center text-center"><i data-feather="user-plus"></i>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        </>
  )
}