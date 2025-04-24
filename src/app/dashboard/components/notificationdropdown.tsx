// components/dashboard/NotificationDropdown.tsx
'use client'
import { useState } from 'react'
import { FiBell, FiCircle } from 'react-icons/fi'

export default function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false)
  
  const notifications = [
    { id: 1, icon: <FiCircle className="me-3 font-primary" />, text: "Delivery processing", time: "10 min" },
    { id: 2, icon: <FiCircle className="me-3 font-success" />, text: "Order Complete", time: "1 hr" },
    { id: 3, icon: <FiCircle className="me-3 font-info" />, text: "Tickets Generated", time: "3 hr" },
    { id: 4, icon: <FiCircle className="me-3 font-danger" />, text: "Delivery Complete", time: "6 hr" }
  ]

  return (
    <li className="onhover-dropdown">
      <div className="notification-box" onClick={() => setIsOpen(!isOpen)}>
        <FiBell />
        <span className="badge rounded-pill badge-theme">4</span>
      </div>
      
      {isOpen && (
        <ul className="notification-dropdown onhover-show-div">
          <li>
            <FiBell />
            <h6 className="f-18 mb-0">Notifications</h6>
          </li>
          
          {notifications.map(notification => (
            <li key={notification.id}>
              <p>
                {notification.icon}
                {notification.text}
                <span className="pull-right">{notification.time}</span>
              </p>
            </li>
          ))}
          
          <li>
            <a className="btn btn-primary" href="#">Check all notifications</a>
          </li>
        </ul>
      )}
    </li>
  )
}