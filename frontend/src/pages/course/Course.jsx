import React, { useState } from "react";
import { CourseData } from "../../context/CourseContext";
import { server } from "../../App";
import { UserData } from "../../context/UserContext";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

const Course = () => {
  const { courses, fetchCourses } = CourseData();

  const { user, isAuth } = UserData();
  const navigate = useNavigate();
    const [btnLoading, setBtnLoading] = useState(false);
  
  const deleteHandler = async (id) => {
    if (confirm("Are you sure you want to delete this course")) {
      setBtnLoading(true); // Start loading state
      try {
        // Await the delete request
        const { data } = await axios.delete(
          `${server}/api/admin/course/${id}`,
          {
            headers: {
              token: localStorage.getItem("token"), // Include token for authentication
            },
          }
        );

        await fetchCourses(); // Refresh the courses list after successful deletion
        toast.success(data.message); // Display success message
      } catch (error) {
        console.error("Error deleting course:", error.message); // Log the error for debugging
        toast.error(
          error?.response?.data?.message || "Failed to delete course"
        ); // Display user-friendly error
      } finally {
        setBtnLoading(false); // Stop loading state
      }
    }
  };
  return (
    <>
      <br />
      <h1 className="text-center  lg:text-6xl text-neutral lg:mt-7 avail-course" >
        Available Courses
      </h1>
      <br />
      <div className="flex flex-wrap gap-3 justify-center">
        <br />
        {courses.map((course, index) => (
          <div
            className="bg-slate-100 p-7 rounded-md shadow-md m-5 max-w-96 hover:bg-slate-200"
            key={course.id || index} // Use course.id if it exists; otherwise, fallback to index
          >
            <figure className="px-2 pt-2 mb-5">
              <img
                src={`${server}/${course.image}`}
                alt="Shoes"
                className="rounded-xl hover:scale-105 transition-all"
              />
            </figure>

            <h2 className="text-3xl text-center text-black">{course.title}</h2>
            <br />
            <p>{course.description}</p>
            <br />
            {isAuth ? (
              <>
                {user && user.role === "admin" ? (
                  <>
                    <button className="btn bg-blue-600 text-white text-lg hover:bg-blue-800">
                      <Link to={`/course/study/${course._id}`}>Study</Link>
                    </button>
                    <button onClick={()=> deleteHandler(course._id)} disabled={btnLoading} className="btn bg-red-500 text-white text-lg hover:bg-red-700 ml-3">
                      {btnLoading ? "Please wait..." :"Delete"}
                    </button>
                  </>
                ) : (
                    <>
                    {user?.subscription?.includes(course._id) ? (
                      <button
                        onClick={() => navigate(`/course/study/${course._id}`)}
                        className="btn bg-blue-600 text-white text-lg hover:bg-blue-800"
                      >
                        Study
                      </button>
                    ) : (
                      <button
                        onClick={() => navigate(`/course/${course._id}`)}
                        className="btn bg-green-400 text-black text-lg hover:bg-green-600"
                      >
                        Enroll Now
                      </button>
                    )}
                  </>
                )}
              </>
            ) : (
              <button className="btn bg-green-400 text-black text-lg hover:bg-green-600">
                <Link to={"/signin"}>Enroll Now</Link>
              </button>
            )}
          </div>
        ))}
      </div>
      <br />
      <br />
    </>
  );
};

export default Course;
