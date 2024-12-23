import "./LoginPage.css";
import { useState} from "react";
import {useNavigate} from "react-router-dom";
function LoginPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    identifier: "",
    password: "",
  });
  const [message, setMessage] = useState("");
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value, // Dynamically update the value for the input field
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const queryParams = new URLSearchParams({
      username: formData.identifier.includes("@") ? null : formData.identifier,
      email: formData.identifier.includes("@") ? formData.identifier : null,
      password: formData.password,
    }).toString();
    try {
      console.log(formData);

      const response = await fetch(
        `http://localhost:3000/api/v1/login?${queryParams}`,
        {
          method: "GET",
        }
      );
      const result = await response.json();
      if (result.ok) {
        navigate("/message")
        setMessage(result.message);
      } else {
        setMessage(result.error);
      }
    } catch (error) {
      console.log("Error is : ", error);
      setMessage("Something went wrong. Please try again later.");
    }
  };
  return (
    <div className="login bg-teal-600">
      <form action="login" className="bg-teal-300 " onSubmit={handleSubmit}>
        <h1 className="pl-28 font-bold text-3xl">Login here</h1>
        <label htmlFor="identifier">Username/Email</label>
        <input
          type="text"
          className="border-2 border-black"
          name="identifier"
          value={formData.identifier}
          onChange={handleChange}
          required
        />
        <label htmlFor="password">Password</label>
        <input
          type="password"
          className="border-2 border-black"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <button type="submit" className="">
          Login
        </button>
      </form>
    </div>
  );
}

export default LoginPage;
