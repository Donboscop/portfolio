import React from 'react'
import Sidebar from './bars/Sidebar.jsx'
import Feed from './Feed.jsx'
import Suggestions from './Suggestions.jsx'
import './index.css'

function App() {
  return (
    <div className='d-flex vh-100 overflow-hidden'>
       <div className='w-20 border-end'><Sidebar /></div>
       <div className='w-50'><Feed /></div>
       <div className='w-30 border-start d-none d-md-block'><Suggestions /></div>
    </div>
  )
}

export default App