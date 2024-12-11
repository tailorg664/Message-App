import './LandingPage.css';
function LandingPage() {
  return (
    <div>
      <button>SignUp</button>
      <div>or</div>
      <button onClick={() => console.log("button clicked")}>Login</button>
    </div>
  );
}

export default LandingPage;
