import { Link, useParams } from "react-router-dom";
import heroImage from "../assets/hero.png";
import { courses } from "../data/courses";

function CourseDetails() {
    const { courseId } = useParams();

    const course = courses.find(
        (item) => item.id === Number(courseId)
    );

    if (!course) {
        return (
            <section className="details">
                <h1>Course Not Found</h1>

                <p>The requested course does not exist.</p>

                <Link className="button" to="/">
                    Back to Courses
                </Link>
            </section>
        );
    }

    return (
        <article className="details">
            <img
                className="details-image"
                src={heroImage}
                alt={course.title}
            />

            <p className="level">{course.level}</p>

            <h1>{course.title}</h1>

            <p>{course.description}</p>

            <p>
                <strong>Duration:</strong> {course.duration}
            </p>

            <Link className="button" to="/">
                Back to Courses
            </Link>
        </article>
    );
}

export default CourseDetails;