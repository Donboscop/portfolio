import { useEffect, useState } from 'react'
import './App.css'

function App() {
  const [courses, setCourses] = useState(null)

  useEffect(() => {
    fetch('http://localhost:3000/courses')
      .then((response) => response.json())
      .then((data) => {
        setCourses(data)
      })
  }, [])

  if (!courses) {
    return <></>
  }

  return (
    <div className="app">
      <h1>Courses</h1>
      <div className="course-list">
        {courses.map((course) => (
          <div className="course-card" key={course.id}>
            <img src={course.image} alt={course.name} />
            <h3>{course.name}</h3>
            <p>{course.price}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default App