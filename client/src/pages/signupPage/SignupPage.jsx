import "./SignupPage.css";
import { useState } from "react";
function SignupPage() {
  //handling the form data
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    password: "",
  });
  //to handle feedback message
  const [message, setMessage] = useState("");
  //handle change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault(); //to prevent the default behaviour of the form
    const queryParams = new URLSearchParams({
      fullname: formData.fullname,
      email: formData.email,
      password: formData.password,
    }).toString();
    try {
      console.log(formData);
      //fetching the data
      const response = await fetch(
        `http://localhost:3000/api/v1/signup?${queryParams}`,
        {
          method: "GET",
        }
      );
      const result = await response.json();
      if (response.ok) {
        setMessage(result.message); // e.g., "User registered successfully!"
      } else {
        setMessage(result.error); // e.g., "Email already exists."
      }
    } catch (error) {
      console.error("Error:", error);
      setMessage("Something went wrong. Please try again later.");
    }
  };
  return (
    <div className="signup bg-teal-600">
      <form className="bg-teal-300" action="" onSubmit={handleSubmit}>
        <h1 className="pl-28 font-bold text-3xl">Signup Page</h1>
        <label htmlFor="fullname">Full Name</label>
        <input
          className="border-2 border-black"
          type="fullname"
          id="fullname"
          name="fullname"
          value={formData.fullname}
          onChange={handleChange}
          required
        />
        <label htmlFor="email">Email</label>
        <input
          className="border-2 border-black"
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <label htmlFor="password">Password</label>
        <input
          className="border-2 border-black"
          type="password"
          id="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <button type="submit">SignUp</button>
      </form>
    </div>
  );
}

export default SignupPage;
