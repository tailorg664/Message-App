import "./LandingPage.css";
import {useNavigate} from "react-router-dom";
function LandingPage() {
  const navigate = useNavigate();
  return (
    <div>
      <button
        className="navbtn singup bg-red-300"
        onClick={() => navigate("/signup")}
      >
        SignUp
      </button>
      <s className="navbtn">or</s>
      <button
        className="navbtn login"
        onClick={() => navigate("/login")}
      >
        Login
      </button>
    </div>
  );
}

export default LandingPage;
