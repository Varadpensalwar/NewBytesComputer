import axios from "axios";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
function Buy() {
  const { courseId } = useParams();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));
  const token = user?.token; //using optional chaining to avoid crashing incase token is not there!!!
  const handlePurchase =async () => {
    if (!token) {
      toast.error("please login to purchase the courses");
      return;
    }
    try {
      setLoading(true);
      const response =await axios.post(
        `${BACKEND_URL}/course/buy/${courseId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );
      toast.success(response.data.message || "Course Purchased Successfully!");
      navigate("/purchases"); //after purchase navigate to courses page!
      setLoading(false);
    } catch (error) {
      setLoading(false);
      if (error.response?.status === 400) {
        toast.error("you are already purchsed this course");
        navigate("/purchases");
      } else {
        toast.error(error?.response?.data?.errors);
      }
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <button
        className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-800 duration-300 "
        onClick={handlePurchase}
        disabled={loading}
      >
        {loading ? "Processing..." : "Buy Now"}
      </button>
    </div>
  );
}
export default Buy;
