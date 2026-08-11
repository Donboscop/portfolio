import React, { useState, useEffect } from 'react'
import dbData from '../db.json'

function Posts() {
  const [posts, setPosts] = useState(dbData.posts || [])

  useEffect(() => {
    fetch('http://localhost:3000/posts')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch')
        return res.json()
      })
      .then((data) => setPosts(data))
      .catch(() => {
        // Fallback to local db.json import if json-server is not running
        if (dbData && dbData.posts) {
          setPosts(dbData.posts)
        }
      })
  }, [])

  return (
    <div className="posts-container d-flex flex-column align-items-center py-3">
      {posts.map((post) => (
        <div key={post.id} className="card post-card mb-4 border-0" style={{ maxWidth: '470px', width: '100%' }}>
          {/* Header */}
          <div className="d-flex align-items-center p-2">
            <img
              src={post.userImage}
              alt={post.username}
              className="rounded-circle me-2"
              style={{ width: '36px', height: '36px', objectFit: 'cover' }}
            />
            <span className="fw-bold fs-6">{post.username}</span>
          </div>

          {/* Post Image */}
          <div className="post-image-container">
            <img
              src={post.postImage}
              alt="Post"
              className="w-100 rounded"
              style={{ maxHeight: '580px', objectFit: 'cover' }}
            />
          </div>

          {/* Actions */}
          <div className="d-flex justify-content-between align-items-center pt-2 px-1">
            <div className="d-flex gap-3 fs-5">
              <i className="bi bi-heart cursor-pointer"></i>
              <i className="bi bi-chat cursor-pointer"></i>
              <i className="bi bi-send cursor-pointer"></i>
            </div>
            <div className="fs-5">
              <i className="bi bi-bookmark cursor-pointer"></i>
            </div>
          </div>

          {/* Likes & Caption */}
          <div className="px-1 pt-2">
            <div className="fw-bold">{post.likes} Likes</div>
            <div className="mt-1">
              <span className="fw-bold me-2">{post.username}</span>
              <span>{post.caption}</span>
            </div>
            {post.comments && (
              <div className="text-muted small mt-1 cursor-pointer">
                View all {post.comments} comments
              </div>
            )}
            <div className="text-muted text-uppercase mt-1" style={{ fontSize: '10px' }}>
              {post.timestamp || 'RECENT'}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default Posts
