'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';

// Define all necessary types
type InclusionItem = {
  type: 'inclusion' | 'exclusion';
  description: string;
  _id: string;
};

type InclusionGroup = {
  _id: string;
  package_id: string;
  types: InclusionItem[];
  createdAt: string;
  updatedAt: string;
  __v: number;
};

type ItineraryDay = {
  day_name: string;
  day_description: string;
  day_images: string[];
  itenary_type: string;
  _id: string;
};

type Itinerary = {
  _id: string;
  package_id: string;
  days: ItineraryDay[];
  createdAt: string;
  updatedAt: string;
  __v: number;
};

type ActivityDay = {
  day_name: string;
  day_activities: string;
  activity_images: string[];
  activity_type: string;
  _id: string;
};

type Activity = {
  _id: string;
  package_id: string;
  days: ActivityDay[];
  createdAt: string;
  updatedAt: string;
  __v: number;
};

type StayDay = {
  hotel_name: string;
  hotel_description: string;
  hotel_images: string[];
  stay_type: string;
  _id: string;
};

type Stay = {
  _id: string;
  package_id: string;
  days: StayDay[];
  createdAt: string;
  updatedAt: string;
  __v: number;
};

type FAQItem = {
  question: string;
  answer: string;
  _id: string;
};

type FAQGroup = {
  _id: string;
  package_id: string;
  questions: FAQItem[];
  createdAt: string;
  updatedAt: string;
  __v: number;
};
type COUNTRY = {
  _id: string;
  name: string;
};

type REGION = {
  _id: string;
  name: string;
};

type CONTINENT = {
  _id: string;
  name: string;
};
type PackageData = {
  _id: string;
  package_name: string;
  package_url: string;
  from_country: string;
  to_country: string;
  package_heading: string;
  package_image: string;
  total_price: string;
  discounted_price?: string;
  addon_ids: string[];
  meta_name: string;
  meta_description: string;
  status: number;
  created_by: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  itineraries: Itinerary[];
  activities: Activity[];
  stays: Stay[];
  inclusion: InclusionGroup[];
  faq: FAQGroup[];
  continent_name: CONTINENT;
  region_name: REGION;
  country_name: COUNTRY;
};

export default function PackageDetailsClient() {
  const params = useParams();
  const id = params.id as string;
  const [packageData, setPackageData] = useState<PackageData | null>(null);
  const [activeTab, setActiveTab] = useState('highlight');

  useEffect(() => {
    if (id) {
      fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/package_view/${id}`)
        .then(res => res.json())
        .then(data => {
          if (data.status) {
            setPackageData(data.data);
          }
        })
        .catch(err => console.error('Error fetching package:', err));
    }
  }, [id]);

  if (!packageData) {
    return <div className="container py-5 text-center">Loading package details...</div>;
  }

  // Separate inclusions and exclusions with proper typing
  const inclusions = packageData.inclusion
  ?.flatMap((group: InclusionGroup) =>
    Array.isArray(group.types)
      ? group.types
          .filter((item: InclusionItem) => item.type === 'inclusion')
          .flatMap(item => item.description)
      : []
  ) || [];
  const exclusions = packageData.inclusion
  ?.flatMap((group: InclusionGroup) =>
    Array.isArray(group.types)
      ? group.types
          .filter((item: InclusionItem) => item.type === 'exclusion')
          .flatMap(item => item.description)
      : []
  ) || [];
  const package_images = Array.isArray(packageData.package_image)
  ? packageData.package_image  
  : (packageData.package_image || "").split(","); 

  return (
    <>
      <Head>
        <title>{packageData.package_name} | Package Details</title>
        <meta name="description" content={packageData.meta_description} />
      </Head>

      <div className="container-fluid">
        <div className="row">
          <div className="col-sm-12">
            <div className="card">
              <div className="card-header card-header--2 package-card">
                <div>
                  <h5>{packageData.package_name} - Details</h5>
                  <p className="mb-0">{packageData.package_heading}</p>
                </div>
                <form className="d-inline-flex">
                  <Link href={`/dashboard/packages/edit/${packageData._id}`} className="btn align-items-center btn-theme me-3">
                    <i className="fa fa-pencil-square-o me-2"></i>Edit
                  </Link>
                  {/* <button className="btn align-items-center d-flex btn-outline">
                    <i className="fa fa-trash-o me-2"></i>Delete
                  </button> */}
                </form>
              </div>

              <div className="card-body">
                <section className="single-section small-section bg-inner">
                  <div className="row">
                    <div className="col-12">
                      <div className="description-section tab-section">
                        <div className="detail-img">
                          {package_images?.map((item, index) => (
                            <Image
                              key={index} // ✅ Fix added here
                              src={item}
                              className="img-fluid blur-up lazyload ms-2"
                              alt={packageData.package_name}
                              height={50}
                              width={200}
                            />
                          ))}
                        </div>
                        <div className="menu-top menu-up">
                          <ul className="nav nav-tabs" id="top-tab" role="tablist">
                            <li className="nav-item">
                              <button
                                className={`nav-link ${activeTab === 'highlight' ? 'active' : ''}`}
                                onClick={() => setActiveTab('highlight')}
                              >
                                Highlight
                              </button>
                            </li>
                            <li className="nav-item">
                              <button
                                className={`nav-link ${activeTab === 'itinerary' ? 'active' : ''}`}
                                onClick={() => setActiveTab('itinerary')}
                              >
                                Itinerary
                              </button>
                            </li>
                            <li className="nav-item">
                              <button
                                className={`nav-link ${activeTab === 'activities' ? 'active' : ''}`}
                                onClick={() => setActiveTab('activities')}
                              >
                                Activities
                              </button>
                            </li>
                            <li className="nav-item">
                              <button
                                className={`nav-link ${activeTab === 'accommodations' ? 'active' : ''}`}
                                onClick={() => setActiveTab('accommodations')}
                              >
                                Accommodations
                              </button>
                            </li>
                            <li className="nav-item">
                              <button
                                className={`nav-link ${activeTab === 'faq' ? 'active' : ''}`}
                                onClick={() => setActiveTab('faq')}
                              >
                                FAQ
                              </button>
                            </li>
                            <li className="nav-item">
                              <button
                                className={`nav-link ${activeTab === 'policy' ? 'active' : ''}`}
                                onClick={() => setActiveTab('policy')}
                              >
                                Policies
                              </button>
                            </li>
                          </ul>
                        </div>

                        <div className="description-details tab-content" id="top-tabContent">
                          {/* Highlight Tab */}
                          <div className={`menu-part about tab-pane fade ${activeTab === 'highlight' ? 'show active' : ''}`} id="highlight">
                            <div className="about-sec">
                              <p className="top-space">{packageData.package_heading}</p>
                            </div>
                            <div className="row g-2">
                              <div className="col-md-6">
                                <div className="about-sec">
                                  <h4>Inclusion</h4>
                                  <ul>
                                    {inclusions.map((item, index) => (
                                      <li key={index}>{item}</li>
                                    ))}
                                  </ul>
                                </div>
                              </div>
                              <div className="col-md-6 margin-up">
                                <div className="about-sec">
                                  <h4>Exclusion</h4>
                                  <ul>
                                    {exclusions.map((item, index) => (
                                      <li key={index}>{item}</li>
                                    ))}
                                  </ul>
                                </div>
                              </div>
                            </div>

                            <div className="about-sec">
                              <h6>Package Details</h6>
                              <p>
                                <strong>Continent:</strong> {packageData?.continent_name?.name}<br />
                                <strong>Region:</strong> {packageData?.region_name?.name}<br />
                                <strong>Country:</strong> {packageData?.country_name?.name}<br />
                                <strong>Total Price:</strong> ${packageData.total_price}<br />
                                {packageData.discounted_price && (
                                  <>
                                    <strong>Discounted Price:</strong> ${packageData.discounted_price}
                                  </>
                                )}
                              </p>
                            </div>
                          </div>

                          {/* Itinerary Tab */}
                          <div className={`menu-part accordion tab-pane fade ${activeTab === 'itinerary' ? 'show active' : ''}`} id="itinerary">
                            {packageData.itineraries.length > 0 ? (
                              <div id="accordion" className="accordion-plan">
                                {packageData.itineraries.map((itinerary, i) => (
                                  <div key={i}>
                                    {itinerary.days.map((day, j) => (
                                      <div className="card" key={j}>
                                        <div className="card-header dark-body" id={`headingItinerary${i}${j}`}>
                                          <h5 className="mb-0">
                                            <button
                                              className="btn btn-link"
                                              data-bs-toggle="collapse"
                                              data-bs-target={`#collapseItinerary${i}${j}`}
                                              aria-expanded={i === 0 && j === 0 ? "true" : "false"}
                                              aria-controls={`collapseItinerary${i}${j}`}
                                            >
                                              {day.day_name}
                                            </button>
                                          </h5>
                                        </div>
                                        <div
                                          id={`collapseItinerary${i}${j}`}
                                          className={`collapse ${i === 0 && j === 0 ? 'show' : ''}`}
                                          aria-labelledby={`headingItinerary${i}${j}`}
                                          data-bs-parent="#accordion"
                                        >
                                          <div className="card-body card-body--modifay">
                                            <p>{day.day_description}</p>
                                            {day.day_images && day.day_images.length > 0 && (
                                              <div className="row mt-3">
                                                {day.day_images.map((img, k) => (
                                                  <div className="col-md-3 mb-3" key={k}>
                                                    <Image width={500} height={300}
                                                      src={img}
                                                      className="img-fluid"
                                                      alt={`Day ${j + 1} Image ${k + 1}`}
                                                    />
                                                  </div>
                                                ))}
                                              </div>
                                            )}
                                            <div className="highlight">
                                              <ul>
                                                <li>
                                                  <Image width={500} height={300}
                                                    src="/assets/images/icon/tour/fork.png"
                                                    className="img-fluid blur-up lazyload"
                                                    alt=""
                                                  /> Dinner
                                                </li>
                                                <li>
                                                  <Image width={500} height={300}
                                                    src="/assets/images/icon/tour/bed.png"
                                                    className="img-fluid blur-up lazyload"
                                                    alt=""
                                                  /> Night stay
                                                </li>
                                              </ul>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <p>No itinerary available for this package.</p>
                            )}
                          </div>

                          {/* Activities Tab */}
                          <div className={`menu-part tab-pane fade ${activeTab === 'activities' ? 'show active' : ''}`} id="activities">
                            {packageData.activities.length > 0 ? (
                              <div id="accordionActivities" className="accordion-plan">
                                {packageData.activities.map((activity, i) => (
                                  <div key={i}>
                                    {activity.days.map((day, j) => (
                                      <div className="card" key={j}>
                                        <div className="card-header dark-body" id={`headingActivity${i}${j}`}>
                                          <h5 className="mb-0">
                                            <button
                                              className="btn btn-link"
                                              data-bs-toggle="collapse"
                                              data-bs-target={`#collapseActivity${i}${j}`}
                                              aria-expanded={i === 0 && j === 0 ? "true" : "false"}
                                              aria-controls={`collapseActivity${i}${j}`}
                                            >
                                              {day.day_name} ({day.activity_type})
                                            </button>
                                          </h5>
                                        </div>
                                        <div
                                          id={`collapseActivity${i}${j}`}
                                          className={`collapse ${i === 0 && j === 0 ? 'show' : ''}`}
                                          aria-labelledby={`headingActivity${i}${j}`}
                                          data-bs-parent="#accordionActivities"
                                        >
                                          <div className="card-body card-body--modifay">
                                            <p>{day.day_activities}</p>
                                            {day.activity_images && day.activity_images.length > 0 && (
                                              <div className="row mt-3">
                                                {day.activity_images.map((img, k) => (
                                                  <div className="col-md-3 mb-3" key={k}>
                                                    <Image width={500} height={300}
                                                      src={img}
                                                      className="img-fluid"
                                                      alt={`Activity ${j + 1} Image ${k + 1}`}
                                                    />
                                                  </div>
                                                ))}
                                              </div>
                                            )}
                                          </div>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <p>No activities available for this package.</p>
                            )}
                          </div>

                          {/* Accommodations Tab */}
                          <div className={`menu-part tab-pane fade ${activeTab === 'accommodations' ? 'show active' : ''}`} id="accommodations">
                            {packageData.stays.length > 0 ? (
                              <div className="list-view">
                                {packageData.stays.map((stay, i) => (
                                  <div key={i}>
                                    {stay.days.map((day, j) => (
                                      <div className="list-box mb-4" key={j}>
                                        {day.hotel_images && day.hotel_images.length > 0 && (
                                          <div className="list-img">
                                            <Image width={500} height={300}
                                              src={day.hotel_images[0]}
                                              className="img-fluid blur-up lazyload"
                                              alt={day.hotel_name}
                                              style={{ width: '100%', height: '200px', objectFit: 'cover' }}
                                            />
                                          </div>
                                        )}
                                        <div className="list-content">
                                          <div>
                                            <h5>{day.hotel_name} ({day.stay_type})</h5>
                                            <p>{day.hotel_description}</p>
                                            <div className="facility-icon">
                                              <div className="facility-box">
                                                <Image width={500} height={300}
                                                  src="/assets/images/icon/hotel/wifi.png"
                                                  className="img-fluid blur-up lazyload"
                                                  alt=""
                                                />
                                                <span>WiFi</span>
                                              </div>
                                              <div className="facility-box">
                                                <Image width={500} height={300}
                                                  src="/assets/images/icon/hotel/pool.png"
                                                  className="img-fluid blur-up lazyload"
                                                  alt=""
                                                />
                                                <span>Pool</span>
                                              </div>
                                            </div>
                                            {day.hotel_images && day.hotel_images.length > 1 && (
                                              <div className="row mt-3">
                                                {day.hotel_images.slice(1).map((img, k) => (
                                                  <div className="col-md-3 mb-3" key={k}>
                                                    <Image width={500} height={300}
                                                      src={img}
                                                      className="img-fluid"
                                                      alt={`${day.hotel_name} Image ${k + 2}`}
                                                    />
                                                  </div>
                                                ))}
                                              </div>
                                            )}
                                          </div>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <p>No accommodation information available for this package.</p>
                            )}
                          </div>

                          {/* FAQ Tab */}
                          <div className={`menu-part tab-pane fade ${activeTab === 'faq' ? 'show active' : ''}`} id="faq">
                            {packageData.faq.length > 0 ? (
                              <div id="accordionFaq" className="accordion-plan">
                                {packageData.faq.map((faqGroup, i) => (
                                  <div key={i}>
                                    {faqGroup.questions.map((faq, j) => (
                                      <div className="card" key={j}>
                                        <div className="card-header dark-body" id={`headingFaq${i}${j}`}>
                                          <h5 className="mb-0">
                                            <button
                                              className="btn btn-link"
                                              data-bs-toggle="collapse"
                                              data-bs-target={`#collapseFaq${i}${j}`}
                                              aria-expanded={i === 0 && j === 0 ? "true" : "false"}
                                              aria-controls={`collapseFaq${i}${j}`}
                                            >
                                              {faq.question}
                                            </button>
                                          </h5>
                                        </div>
                                        <div
                                          id={`collapseFaq${i}${j}`}
                                          className={`collapse ${i === 0 && j === 0 ? 'show' : ''}`}
                                          aria-labelledby={`headingFaq${i}${j}`}
                                          data-bs-parent="#accordionFaq"
                                        >
                                          <div className="card-body">
                                            <p>{faq.answer}</p>
                                          </div>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <p>No FAQs available for this package.</p>
                            )}
                          </div>

                          {/* Policy Tab */}
                          <div className={`about menu-part tab-pane fade ${activeTab === 'policy' ? 'show active' : ''}`} id="policy">
                            <div className="about-sec">
                              <h6 className="resturant-6">Payment Policy</h6>
                              <ul className="policiy-6">
                                <li>Initial deposit &ndash; INR. 1,00,000 per person at the time of booking.</li>
                                <li>1st part payment 50% of the tour cost at least 60 days prior departure.</li>
                                <li>Balance payment 30 days prior departure.</li>
                              </ul>
                            </div>
                            <div className="about-sec">
                              <h6 className="resturant-6">Cancellation Policy</h6>
                              <ul className="policiy-6">
                                <li>Deposit of INR 1,00,000 per person is non-refundable in any case once booking is confirmed.</li>
                                <li>45 Days to 60 days prior to departure &ndash; 50% of the total tour cost.</li>
                                <li>30 to 44 Days prior to departure 75% of the tour cost.</li>
                                <li>Within 30 days of departure 100% of the tour cost.</li>
                              </ul>
                            </div>
                            <div className="about-sec">
                              <h6 className="resturant-6">Important Terms and Conditions</h6>
                              <ul className="policiy-6">
                                <li>All travelers have to carry their own passports, tickets, forex &amp; any other important documents.</li>
                                <li>Passengers having excess baggage over 20 kgs per person in check in baggage &amp; 07 kgs in hand luggage are liable to pay excess baggage charge directly at airport.</li>
                                <li>Any sightseeing not mentioned in the itinerary will have to be paid directly.</li>
                                <li>For the convenience of passengers the itinerary may be amended.</li>
                                <li>Flight cost and availability are subject to change at time of actual booking.</li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}