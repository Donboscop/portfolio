import { Link, Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import CourseDetails from "./components/CourseDetails";
import CourseList from "./components/CourseList";
import NewCourseList from "./components/course/CourseList";

function App() {
  return (
    <main className="app">
      <header className="site-header">
        <Link className="brand" to="/">
          Course Explorer
        </Link>

        <p>Choose a course and view its complete details.</p>
      </header>

      <Routes>
        <Route path="/" element={<CourseList />} />
        <Route path="/courses/:courseId" element={<CourseDetails />} />
        <Route path="/new-courses" element={<NewCourseList />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </main>
  );
}

export default App;