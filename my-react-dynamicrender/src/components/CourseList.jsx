import { Link } from "react-router-dom";
import heroImage from "../assets/hero.png";
import { courses } from "../data/courses";

function CourseList() {
    return (
        <section>
            <h1>Available Courses</h1>

            <div className="course-container">
                {courses.map((course) => (
                    <article className="card" key={course.id}>
                        <img
                            className="course-image"
                            src={heroImage}
                            alt={course.title}
                        />

                        <div className="card-content">
                            <h2>{course.title}</h2>

                            <p>{course.summary}</p>

                            <Link
                                className="button"
                                to={`/courses/${course.id}`}
                            >
                                View Details
                            </Link>
                        </div>
                    </article>
                ))}
            </div>
        </section>
    );
}

export default CourseList;