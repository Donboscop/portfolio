import React from 'react'

function Stories() {
  const stories = [
    { id: 1, username: 'john_doe', img: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80' },
    { id: 2, username: 'sarah_lee', img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80' },
    { id: 3, username: 'alex_adv', img: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=150&q=80' },
    { id: 4, username: 'emily_r', img: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&q=80' },
    { id: 5, username: 'david_k', img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80' }
  ]

  return (
    <div className="d-flex gap-3 p-3 overflow-auto border-bottom bg-light rounded my-2 align-items-center">
      <div className="fw-bold me-2">Stories</div>
      {stories.map((story) => (
        <div key={story.id} className="d-flex flex-column align-items-center" style={{ minWidth: '64px' }}>
          <div className="rounded-circle p-1" style={{ background: 'linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)' }}>
            <img
              src={story.img}
              alt={story.username}
              className="rounded-circle border border-2 border-white"
              style={{ width: '56px', height: '56px', objectFit: 'cover' }}
            />
          </div>
          <small className="text-truncate mt-1" style={{ maxWidth: '60px', fontSize: '11px' }}>{story.username}</small>
        </div>
      ))}
    </div>
  )
}

export default Stories
