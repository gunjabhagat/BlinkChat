import React, { useEffect, useRef } from 'react'
import dp from "../assets/dp.webp"
import { useSelector } from 'react-redux'

function SenderMessage({ image, message }) {
  let scroll = useRef()
  let { userData } = useSelector(state => state.user)

  useEffect(() => {
    scroll?.current.scrollIntoView({ behavior: "smooth" })
  }, [message, image])

  const handleImageScroll = () => {
    scroll?.current.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <div className='flex items-start gap-3 justify-end'>
      <div
        ref={scroll}
        className='max-w-[480px] px-5 py-3 bg-pink-500 bg-opacity-60 text-white text-lg rounded-tr-none rounded-2xl shadow-lg shadow-pink-400/60 flex flex-col gap-2 animate-fade-in glassmorphism-pink ml-auto'
      >
        {image && (
          <img
            src={image}
            alt="message attachment"
            className='w-[150px] rounded-lg cursor-pointer hover:scale-105 transition-transform duration-300'
            onLoad={handleImageScroll}
            draggable={false}
          />
        )}
        {message && <span>{message}</span>}
      </div>
      <div className='w-10 h-10 rounded-full overflow-hidden bg-white shadow-lg shadow-pink-400 cursor-pointer flex justify-center items-center animate-fade-in'>
        <img
          src={userData?.image || dp}
          alt="sender avatar"
          className='h-full w-full object-cover'
          draggable={false}
        />
      </div>

      <style>{`
        @keyframes fade-in {
          from {opacity: 0; transform: translateY(5px);}
          to {opacity: 1; transform: translateY(0);}
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease forwards;
        }

        .glassmorphism-pink {
          background: rgba(219, 39, 91, 0.4); /* Pinkish glass */
          backdrop-filter: blur(10px);
          border: 1.5px solid rgba(255 182 193 / 0.3);
          box-shadow:
            0 8px 32px 0 rgba(219, 39, 91, 0.3);
          transition: background-color 0.3s ease;
        }
        .glassmorphism-pink:hover {
          background: rgba(219, 39, 91, 0.7);
          box-shadow:
            0 12px 40px 0 rgba(219, 39, 91, 0.6);
        }
      `}</style>
    </div>
  )
}

export default SenderMessage
