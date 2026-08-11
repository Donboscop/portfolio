import React from 'react'
import image from '../assets/logotext.jpg'
function Sidebar() {
  return (
    <div className='m-3'>
    <div className='d-flex flex-column gap-3'>
        <img className='Logo-text' src={image} alt="Instagram Logo" />
        <div><i className="bi bi-house-add"></i>Home</div>
        <div><i className="bi bi-search"></i>Search</div>
        <div><i className="bi bi-compass"></i>Explore</div>
        <div><i className="bi bi-play-circle"></i>Reels</div>
        <div><i className="bi bi-envelope"></i>Message</div>
        <div><i className="bi bi-plus-circle"></i>Create</div>
        <div><i className="bi bi-heart"></i>Notifications</div>
        <div><i className="bi bi-person"></i>Profile</div>
        </div>
    <div className='position-fixed bottom-0 d-flex flex-column gap-3'>
        <div><i className="bi bi-threads"></i>Threads</div>
        <div><i className="bi bi-list"></i>More</div>

    </div>
    </div>    
  )
}

export default Sidebar