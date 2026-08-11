import React from 'react'
import Stories from './Stories'
import Posts from './feed-bar /Posts.jsx'

function Feed() {
  return (
    <div className="feed-container px-3 overflow-auto h-100">
      <Stories />
      <Posts />
    </div>
  )
}

export default Feed
