import Course from "./Course";
import "./Course.css";

// 📦 Course data as an array of objects
const courses = [
  { id: 1, name: "React for Beginners",   price: 499,  available: true,  rating: 4.8 },
  { id: 2, name: "Advanced JavaScript",   price: 799,  available: true,  rating: 4.6 },
  { id: 3, name: "Node.js Masterclass",   price: 999,  available: false, rating: 4.5 },
  { id: 4, name: "Python & Data Science", price: 1299, available: true,  rating: 4.9 },
  { id: 5, name: "UI/UX Design Crash",    price: 399,  available: false, rating: 4.3 },
];

const CourseList = () => {
  const sortedCourses = [...courses].sort((a, b) => b.price - a.price);
  const availableCourses = sortedCourses.filter(course => course.available);
  return (
    <div className="course-list-wrapper">
      <h2>🎓 Our Courses</h2>
      <div className="course-grid">
        {availableCourses.map((course) => (
          <Course
            key={course.id}
            name={course.name}
            price={course.price}
            available={course.available}
            rating={course.rating}
          />
        ))}
      </div>
    </div>
  );
};

export default CourseList;
