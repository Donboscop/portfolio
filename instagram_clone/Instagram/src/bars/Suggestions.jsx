import React from 'react'

function Suggestions() {
  const suggestions = [
    { id: 1, username: 'tech_insider', subtitle: 'Suggested for you', img: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80' },
    { id: 2, username: 'travel_gram', subtitle: 'Followed by sarah_lee', img: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80' },
    { id: 3, username: 'foodie_hub', subtitle: 'Suggested for you', img: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=150&q=80' }
  ]

  return (
    <div className="p-3 my-2" style={{ maxWidth: '320px' }}>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <span className="fw-bold text-muted small">Suggestions for you</span>
        <button className="btn btn-link btn-sm text-dark text-decoration-none fw-bold p-0">See All</button>
      </div>

      {suggestions.map((item) => (
        <div key={item.id} className="d-flex justify-content-between align-items-center mb-3">
          <div className="d-flex align-items-center gap-2">
            <img
              src={item.img}
              alt={item.username}
              className="rounded-circle"
              style={{ width: '40px', height: '40px', objectFit: 'cover' }}
            />
            <div>
              <div className="fw-bold small">{item.username}</div>
              <div className="text-muted" style={{ fontSize: '11px' }}>{item.subtitle}</div>
            </div>
          </div>
          <button className="btn btn-link btn-sm text-primary text-decoration-none fw-bold p-0">Follow</button>
        </div>
      ))}
    </div>
  )
}

export default Suggestions
