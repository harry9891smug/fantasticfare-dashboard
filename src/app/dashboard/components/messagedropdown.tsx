// components/dashboard/MessagesDropdown.tsx
'use client'
import { useState } from 'react'
import { FiMessageSquare } from 'react-icons/fi'
import Image from 'next/image'

export default function MessagesDropdown() {
  const [isOpen, setIsOpen] = useState(false)
  
  const messages = [
    { 
      id: 1, 
      avatar: "/assets/images/user/1.jpg", 
      name: "Erica Hughes", 
      text: "Lorem Ipsum is simply dummy...", 
      time: "58 mins ago",
      status: "online"
    },
    // Add more messages...
  ]

  return (
    <li className="onhover-dropdown">
      <FiMessageSquare onClick={() => setIsOpen(!isOpen)} />
      
      {isOpen && (
        <ul className="chat-dropdown onhover-show-div">
          <li>
            <FiMessageSquare />
            <h6 className="f-18 mb-0">Message Box</h6>
          </li>
          
          {messages.map(message => (
            <li key={message.id}>
              <div className="media">
                <Image 
                  src={message.avatar} 
                  alt={message.name}
                  width={40}
                  height={40}
                  className="rounded-circle me-3"
                />
                <div className={`status-circle ${message.status}`}></div>
                <div className="media-body">
                  <span>{message.name}</span>
                  <p>{message.text}</p>
                </div>
                <p className="f-12 font-success">{message.time}</p>
              </div>
            </li>
          ))}
          
          <li className="text-center">
            <a className="btn btn-primary" href="#">View All</a>
          </li>
        </ul>
      )}
    </li>
  )
}