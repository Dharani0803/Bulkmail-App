import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import bg from "./assets/banner.webp"

function Login() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate()

  const[user,setuser]=useState("")
  const[pass,setpass]=useState("")

  function handleUser(evt){
    setuser(evt.target.value)
  }

  function handlePass(evt){
    setpass(evt.target.value)
  }

  function check() {
  setError("");

  if (!user || !pass) {
    setError("Please enter username and password");
    return;
  }

  if (user.trim() === "" || pass.trim() === "") {
    setError("Please Enter a Valid Input");
    return;
  }

  setLoading(true);

  axios.post("https://bulkmail-app-h92z.onrender.com/login",{
    username: user,
    password: pass
  })
    .then((res) => {
      if (res.data.status === true) {
        setTimeout(() => {
          navigate("/home");
        }, 1000);
      } else {
        setError(res.data.msg || "Invalid username or password");
        setLoading(false);
      }
    })
    .catch(() => {
      setError("Server error");
      setLoading(false);
    });
}

  return (
    <div className="relative h-screen w-full bg-cover bg-center flex items-center justify-center" style={{ backgroundImage: `url(${bg})`}}>
    <div className="absolute inset-0 bg-black/50"></div>
    <div className="relative z-10 bg-black/40 rounded-lg py-10 px-5 w-[550px] flex flex-col items-center justify-center text-center">
      <h1 className="text-3xl font-bold text-white">Log In</h1>
      <p className="font-semibold mt-1 mb-6 text-white">Enter your info to log in</p>
      <input className="w-64 border border-gray-400 p-3 rounded mb-2" onChange={handleUser} name="username" placeholder="Enter Email or Username"/>
      <input className="w-64 border border-gray-400 p-3 rounded mb-4" onChange={handlePass} name="password" placeholder="Enter Password"/>

      <button className="w-64 bg-blue-600 hover:bg-blue-700 text-lg py-3 rounded font-semibold md:mb-3 mb-2 disabled:cursor-not-allowed disabled:opacity-60" onClick={check} disabled={loading}>
        {loading ? "Logging in..." : "Log-In"}
      </button>
      {error && (<p className="text-red-500 text-center"><i class="fa-solid fa-triangle-exclamation"></i> {error}</p>)}
        </div>
        </div>
  );
}

export default Login;
