import axios from 'axios'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { serverUrl } from '../main'
import { useDispatch } from 'react-redux'
import { setUserData } from '../redux/userSlice'

function SignUp() {
  let navigate = useNavigate()
  let [show, setShow] = useState(false)
  let [userName, setUserName] = useState("")
  let [email, setEmail] = useState("")
  let [password, setPassword] = useState("")
  let [loading, setLoading] = useState(false)
  let [err, setErr] = useState("")
  let dispatch = useDispatch()

  const handleSignUp = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      let result = await axios.post(`${serverUrl}/api/auth/signup`, {
        userName, email, password
      }, { withCredentials: true })
      dispatch(setUserData(result.data))
      navigate("/profile")
      setEmail("")
      setPassword("")
      setLoading(false)
      setErr("")
    } catch (error) {
      console.log(error)
      setLoading(false)
      setErr(error?.response?.data?.message)
    }
  }

  return (
    <div className="relative w-full h-screen flex items-center justify-center bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 overflow-hidden animate-bg-move">

      {/* Big sparkling bubbles */}
      <div className="big-bubbles" aria-hidden="true">
        {[...Array(7)].map((_, i) => (
          <span key={i} className={`big-bubble big-bubble-${i + 1}`}></span>
        ))}
      </div>

      <div className="w-full max-w-md p-8 bg-white/10 backdrop-blur-lg rounded-3xl shadow-lg border border-white/30 flex flex-col gap-8 animate-fade-in z-10">
        <div className="text-center text-white">
          <h1 className="text-4xl font-extrabold mb-2 drop-shadow-lg">Welcome to <span className="text-pink-300">BlinkChat</span></h1>
          <p className="text-sm text-white/70">Create your account below</p>
        </div>

        <form className="flex flex-col gap-6" onSubmit={handleSignUp}>
          <input
            type="text"
            placeholder="Username"
            className="glass-input"
            onChange={(e) => setUserName(e.target.value)}
            value={userName}
          />
          <input
            type="email"
            placeholder="Email"
            className="glass-input"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
          />
          <div className="relative">
            <input
              type={show ? "text" : "password"}
              placeholder="Password"
              className="glass-input pr-20"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
            />
            <span
              className="absolute right-5 top-1/2 -translate-y-1/2 text-pink-300 font-semibold cursor-pointer select-none hover:text-pink-400 transition"
              onClick={() => setShow(prev => !prev)}
            >
              {show ? "Hide" : "Show"}
            </span>
          </div>
          {err && <p className="text-red-400 text-sm italic">{`* ${err}`}</p>}

          <button
            type="submit"
            disabled={loading}
            className="bg-pink-400 hover:bg-pink-500 transition rounded-2xl py-3 text-white font-bold shadow-lg shadow-pink-300/50 disabled:opacity-50"
          >
            {loading ? "Loading..." : "Sign Up"}
          </button>
        </form>

        <p className="text-white text-center cursor-pointer select-none">
          Already have an account?{" "}
          <span
            className="text-pink-300 font-semibold hover:underline"
            onClick={() => navigate("/login")}
          >
            Login
          </span>
        </p>
      </div>

      <style>{`
        .glass-input {
          width: 100%;
          padding: 14px 20px;
          background: rgba(255 255 255 / 0.15);
          border-radius: 12px;
          border: 1.5px solid rgba(255 255 255 / 0.3);
          color: white;
          font-size: 1.1rem;
          outline: none;
          backdrop-filter: blur(8px);
          box-shadow: 0 4px 30px rgba(255 255 255 / 0.1);
          transition: border-color 0.3s ease;
        }
        .glass-input::placeholder {
          color: rgba(255 255 255 / 0.7);
        }
        .glass-input:focus {
          border-color: #f472b6;
          box-shadow: 0 0 8px #f472b6;
          background: rgba(255 255 255 / 0.25);
        }
        @keyframes bg-move {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
        .animate-bg-move {
          animation: bg-move 10s ease infinite;
          background-size: 200% 200%;
        }
        @keyframes fade-in {
          from {opacity: 0; transform: translateY(10px);}
          to {opacity: 1; transform: translateY(0);}
        }
        .animate-fade-in {
          animation: fade-in 0.7s ease forwards;
        }

        /* Big sparkling bubbles container */
        .big-bubbles {
          position: absolute;
          inset: 0;
          overflow: visible;
          z-index: 0;
          pointer-events: none;
        }

        .big-bubble {
          position: absolute;
          border-radius: 50%;
          border: 3px solid rgba(255 255 255 / 0.5);
          background: radial-gradient(circle at center, rgba(255 255 255 / 0.15), rgba(255 255 255 / 0));
          box-shadow:
            0 0 10px 3px rgba(255 255 255 / 0.3),
            inset 0 0 10px 2px rgba(255 255 255 / 0.4);
          opacity: 0.7;
          animation: bubbleFloat 15s ease-in-out infinite, bubbleSparkle 3s linear infinite;
          filter: drop-shadow(0 0 6px rgba(255 255 255, 0.6));
          backdrop-filter: blur(4px);
        }

        /* Sizes and positions */
        .big-bubble-1 { width: 140px; height: 140px; top: 10%; left: 15%; animation-delay: 0s; }
        .big-bubble-2 { width: 120px; height: 120px; top: 40%; left: 70%; animation-delay: 2s; }
        .big-bubble-3 { width: 180px; height: 180px; top: 65%; left: 25%; animation-delay: 4s; }
        .big-bubble-4 { width: 130px; height: 130px; top: 30%; left: 40%; animation-delay: 1s; }
        .big-bubble-5 { width: 160px; height: 160px; top: 50%; left: 55%; animation-delay: 3s; }
        .big-bubble-6 { width: 110px; height: 110px; top: 75%; left: 75%; animation-delay: 5s; }
        .big-bubble-7 { width: 150px; height: 150px; top: 20%; left: 80%; animation-delay: 6s; }

        /* Bubble floating animation */
        @keyframes bubbleFloat {
          0%, 100% {
            transform: translateY(0) translateX(0);
            opacity: 0.7;
          }
          50% {
            transform: translateY(-20px) translateX(10px);
            opacity: 0.85;
          }
        }

        /* Sparkling shimmer effect */
        @keyframes bubbleSparkle {
          0%, 100% {
            box-shadow:
              0 0 10px 3px rgba(255 255 255 / 0.3),
              inset 0 0 10px 2px rgba(255 255 255 / 0.4);
          }
          50% {
            box-shadow:
              0 0 18px 7px rgba(255 255 255 / 0.5),
              inset 0 0 18px 5px rgba(255 255 255 / 0.6);
          }
        }
      `}</style>
    </div>
  )
}

export default SignUp
