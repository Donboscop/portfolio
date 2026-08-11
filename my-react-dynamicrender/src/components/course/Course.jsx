 const Course = ({ name, price, available, rating }) => {
  return (
    <div className="course-card">
      <h3 className="course-name">{name}</h3>
      <p className="course-price">💰 Price: ₹{price}</p>
      <p className={`course-available ${available ? "yes" : "no"}`}>
        {available ? "✅ Available" : "❌ Not Available"}
      </p>
      <p className="course-rating">⭐ Rating: {rating} / 5</p>
    </div>
  );
};

export default Course;
