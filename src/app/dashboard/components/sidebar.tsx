'use client'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { 
  FiHome, FiUsers, FiMap, FiBriefcase, FiCoffee, 
  FiNavigation, FiBookmark, FiMessageSquare, 
  FiSettings, FiLogIn, FiPlusCircle,
  FiGrid, FiArrowLeft, FiArrowRight, FiChevronLeft, FiChevronRight,
  FiEye, FiEdit, FiTrash2
} from 'react-icons/fi'
import Image from 'next/image'
import SimpleBar from 'simplebar-react'
import 'simplebar-react/dist/simplebar.min.css'
import '../css/sidebar.css' // Create this CSS file for custom styles

export default function Sidebar() {
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null)
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
    return () => setIsMounted(false)
  }, [])

  const toggleSubmenu = (menu: string) => {
    setActiveSubmenu(activeSubmenu === menu ? null : menu)
  }

  const menuItems = [
    { 
      icon: <FiHome size={18} />, 
      label: 'Dashboard', 
      href: '/dashboard',
      subItems: null
    },
    { 
      icon: <FiUsers size={18} />, 
      label: 'Roles/Permissions',
      href: '#',
      subItems: [
        { label: 'All Roles', href: '/dashboard/roles' },
        { label: 'All Permissions', href: '/dashboard/permissions' }
      ]
    },
    { 
      icon: <FiUsers size={18} />, 
      label: 'Users',
      href: '#',
      subItems: [
        { label: 'All users', href: '/dashboard/users' },
        { label: 'Add new user', href: '/dashboard/users/new' }
      ]
    },
    { 
      icon: <FiMap size={18} />, 
      label: 'Packages',
      href: '#',
      subItems: [
        { label: 'Add New Package', href: '/dashboard/packages/new' },
        { label: 'Addons', href: '/dashboard/addons' },
        { label: 'Packages', href: '/dashboard/packages' },
      ]
    },
    
    // { 
    //   icon: <FiBriefcase size={18} />, 
    //   label: 'Hotel',
    //   href: '#',
    //   subItems: [
    //     { label: 'All Hotels', href: '/dashboard/hotels' },
    //     { label: "Hotel's Detail", href: '/dashboard/hotels/detail' },
    //     { label: 'Add New Hotel', href: '/dashboard/hotels/new' }
    //   ]
    // },
    { 
      icon: <FiBookmark size={18} />, 
      label: 'Tips&Articles',
      href: '#',
      subItems: [
        { label: 'Add Articles', href: '/dashboard/blogs/new' },
        { label: 'All Articles', href: '/dashboard/blogs' },
      ]
    },
    { 
      icon: <FiSettings size={18} />, 
      label: 'Enquiries',
      href: '#',
      subItems: [
        { label: 'All Enquires', href: '/dashboard/enquiries' },
      ]
    },
    // { 
    //   icon: <FiSettings size={18} />, 
    //   label: 'CRM', 
    //   href: '/dashboard/crm',
    //   subItems: null
    // },
    { 
      icon: <FiPlusCircle size={18} />, 
      label: 'Add Image to Country', 
      href: '/dashboard/country',
      subItems: null
    },
    // { 
    //   icon: <FiSettings size={18} />, 
    //   label: 'Rules', 
    //   href: '/dashboard/rules',
    //   subItems: null
    // },
  ]

  if (!isMounted) return null

  return (
    <div 
      className={`sidebar-wrapper ${isCollapsed ? 'collapsed' : ''}`}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="sidebar-inner">
        <div className="logo-wrapper">
          {!isCollapsed && <span className="back">Back</span>}
          <div 
            className="back-btn" 
            onClick={(e) => {
              e.stopPropagation()
              setIsCollapsed(!isCollapsed)
            }}
          >
            {isCollapsed ? <FiChevronRight size={18} /> : <FiChevronLeft size={18} />}
          </div>
          <div className="toggle-sidebar">
            <FiGrid size={18} className="status_toggle middle sidebar-toggle" />
          </div>
        </div>
        
        <div className="logo-icon-wrapper">
          <Link href="/dashboard">
            {/* <Image 
              src="/assets/images/logo/logo-icon.png" 
              width={40} 
              height={40} 
              alt="Logo"
              className="img-fluid"
              priority
            /> */}
          </Link>
        </div>

        <nav className="sidebar-main">
          <div className="left-arrow" id="left-arrow">
            <FiArrowLeft size={18} />
          </div>
          
          <SimpleBar className="sidebar-scroll">
            <ul className="sidebar-links">
              <li className="back-btn">
                <Link href="/dashboard">
                  {/* <Image 
                    src="/assets/images/logo/logo-icon.png" 
                    width={30} 
                    height={30} 
                    alt="Logo"
                    className="img-fluid"
                  /> */}
                </Link>
                {!isCollapsed && (
                  <div className="mobile-back text-end">
                    <span>Back</span>
                    <FiChevronRight className="ps-2" size={16} />
                  </div>
                )}
              </li>

              {menuItems.map((item) => (
                <li 
                  key={item.label} 
                  className={`sidebar-list ${item.subItems ? 'has-submenu' : ''}`}
                >
                  {item.subItems ? (
                    <>
                      <a 
                        className="sidebar-link sidebar-title" 
                        onClick={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          toggleSubmenu(item.label)
                        }}
                      >
                        <span className="sidebar-icon">{item.icon}</span>
                        {!isCollapsed && <span className="sidebar-label">{item.label}</span>}
                        {/* {!isCollapsed && item.subItems && (
                          <span className="submenu-arrow">
                            {activeSubmenu === item.label ? '−' : '+'}
                          </span>
                        )} */}
                      </a>
                      {!isCollapsed && (
                        <ul className={`sidebar-submenu ${activeSubmenu === item.label ? 'open' : ''}`}>
                          {item.subItems.map((subItem) => (
                            <li key={subItem.label}>
                              <Link href={subItem.href} onClick={(e) => e.stopPropagation()}>
                                {subItem.label}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      )}
                    </>
                  ) : (
                    <Link 
                      className="sidebar-link sidebar-title link-nav" 
                      href={item.href}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <span className="sidebar-icon">{item.icon}</span>
                      {!isCollapsed && <span className="sidebar-label">{item.label}</span>}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </SimpleBar>

          <div className="right-arrow" id="right-arrow">
            <FiArrowRight size={18} />
          </div>
        </nav>
      </div>
    </div>
  )
}
