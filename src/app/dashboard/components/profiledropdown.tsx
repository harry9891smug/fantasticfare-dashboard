'use client'
import { useState, useCallback } from 'react'
import { FiUser, FiMail, FiFileText, FiSettings, FiLogOut } from 'react-icons/fi'
import Image from 'next/image'
import { useAuth } from "../../context/AuthContext"
import { useRouter } from "next/navigation"
import Link from 'next/link'

export default function ProfileDropdown() {
  const [isOpen, setIsOpen] = useState(false)
  const { isAuthenticated, logout, user } = useAuth()
  const router = useRouter()

  const handleLogout = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    logout()
  }, [logout])

  const toggleDropdown = useCallback(() => {
    setIsOpen(prev => !prev)
  }, [])

  const menuItems = [
    { icon: <FiUser />, text: "Account", href: "/dashboard/account" },
    { icon: <FiMail />, text: "Inbox", href: "/dashboard/inbox" },
    { icon: <FiFileText />, text: "Taskboard", href: "/dashboard/tasks" },
    { icon: <FiSettings />, text: "Settings", href: "/dashboard/settings" }
  ]

  return (
    <li className="profile-nav onhover-dropdown pe-0 me-0">
      <div 
        className="media profile-media" 
        onClick={toggleDropdown}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && toggleDropdown()}
      >
        <Image 
          src={(user as any)?.profilePicture || "/assets/images/users/4.jpg"}
          alt={`${user?.name || 'User'} profile`}
          width={40}
          height={40}
          className="rounded-circle"
          priority
        />
        <div className="user-name-hide media-body">
          <span>{user?.name || 'User'}</span>
          <p className="mb-0 font-roboto">
            {user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : 'Role'}
            <i className="middle fa fa-angle-down"></i>
          </p>
        </div>
      </div>
      
      {isOpen && (
        <ul className="profile-dropdown onhover-show-div">
          {menuItems.map((item, index) => (
            <li key={index}>
              <Link href={item.href} legacyBehavior>
                <a onClick={() => setIsOpen(false)}>
                  {item.icon}
                  <span>{item.text}</span>
                </a>
              </Link>
            </li>
          ))}
          <li>
            <Link href="#" legacyBehavior>
              <a onClick={handleLogout}>
                <FiLogOut />
                <span>Log out</span>
              </a>
            </Link>
          </li>
        </ul>
      )}
    </li>
  )
}