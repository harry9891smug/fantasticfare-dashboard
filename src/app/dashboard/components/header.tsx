'use client'

import Image from 'next/image'
import { useState } from 'react'
import NotificationDropdown from './notificationdropdown'
import MessagesDropdown from './messagedropdown'
import ProfileDropdown from './profiledropdown'
export default function Header() {
  const [searchOpen, setSearchOpen] = useState(false)

  return (
    <div className="page-header">
      <div className="header-wrapper row m-0">
        <div className="header-logo-wrapper col-auto p-0">
          <div className="logo-wrapper">
            <a href="/dashboard">
              <Image 
                src="/assets/images/logo/logo.png" 
                alt="logo"
                width={150}
                height={50}
                style={{ width: 'auto', height: 'auto' }}
                priority
              />
            </a>
          </div>
          <div className="toggle-sidebar">
            <i className="status_toggle middle sidebar-toggle" data-feather="align-center"></i>
          </div>
        </div>

        {/* Search form */}
        <form className={`form-inline search-full col ${searchOpen ? 'open' : ''}`} action="#" method="get">
          <div className="form-group w-100">
            <div className="Typeahead Typeahead--twitterUsers">
              <div className="u-posRelative">
                <input 
                  className="demo-input Typeahead-input form-control-plaintext w-100" 
                  type="text"
                  placeholder="Search Rica..."
                  name="q"
                  autoFocus
                />
                <i className="close-search" data-feather="x" onClick={() => setSearchOpen(false)}></i>
                <div className="spinner-border Typeahead-spinner" role="status">
                  <span className="sr-only">Loading...</span>
                </div>
              </div>
              <div className="Typeahead-menu"></div>
            </div>
          </div>
        </form>

        {/* Right side navigation */}
        <div className="nav-right col-4 pull-right right-header p-0">
          <ul className="nav-menus">
            <li>
              <span className="header-search" onClick={() => setSearchOpen(true)}>
                <i data-feather="search"></i>
              </span>
            </li>
            
            {/* Notification dropdown */}
            <NotificationDropdown />
            
            {/* Dark mode toggle */}
            <li>
              <div className="mode">
                <i className="fa fa-moon-o" aria-hidden="true"></i>
              </div>
            </li>
            
            {/* Messages dropdown */}
            <MessagesDropdown />
            
            {/* Profile dropdown */}
            <ProfileDropdown />
          </ul>
        </div>
      </div>
    </div>
  )
}