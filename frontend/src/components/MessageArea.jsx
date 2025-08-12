import React, { useEffect, useRef, useState } from 'react'
import { IoIosArrowRoundBack } from "react-icons/io";
import dp from "../assets/dp.webp"
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedUser } from '../redux/userSlice';
import { RiEmojiStickerLine } from "react-icons/ri";
import { FaImages } from "react-icons/fa6";
import { RiSendPlane2Fill } from "react-icons/ri";
import EmojiPicker from 'emoji-picker-react';
import SenderMessage from './SenderMessage';
import ReceiverMessage from './ReceiverMessage';
import axios from 'axios';
import { serverUrl } from '../main';
import { setMessages } from '../redux/messageSlice';

function MessageArea() {
  let { selectedUser, userData, socket } = useSelector(state => state.user)
  let dispatch = useDispatch()
  let [showPicker, setShowPicker] = useState(false)
  let [input, setInput] = useState("")
  let [frontendImage, setFrontendImage] = useState(null)
  let [backendImage, setBackendImage] = useState(null)
  let image = useRef()
  let { messages } = useSelector(state => state.message)

  const handleImage = (e) => {
    let file = e.target.files[0]
    setBackendImage(file)
    setFrontendImage(URL.createObjectURL(file))
  }

  const handleSendMessage = async (e) => {
    e.preventDefault()
    if (input.length === 0 && backendImage == null) {
      return
    }
    try {
      let formData = new FormData()
      formData.append("message", input)
      if (backendImage) {
        formData.append("image", backendImage)
      }
      let result = await axios.post(`${serverUrl}/api/message/send/${selectedUser._id}`, formData, { withCredentials: true })
      dispatch(setMessages([...messages, result.data]))
      setInput("")
      setFrontendImage(null)
      setBackendImage(null)
    } catch (error) {
      console.log(error)
    }
  }

  const onEmojiClick = (emojiData) => {
    setInput(prevInput => prevInput + emojiData.emoji)
    setShowPicker(false)
  }

  useEffect(() => {
    socket?.on("newMessage", (mess) => {
      dispatch(setMessages([...messages, mess]))
    })
    return () => socket?.off("newMessage")
  }, [messages, dispatch, socket])

  return (
    <div className={`lg:w-[70%] relative ${selectedUser ? "flex" : "hidden"} lg:flex w-full h-full bg-pink-100 border-l-2 border-pink-400 overflow-hidden`}>

      {selectedUser &&
        <div className='w-full h-[100vh] flex flex-col overflow-hidden gap-5 items-center'>
          <div className='w-full h-[100px] bg-pink-600 rounded-b-none shadow-lg flex items-center px-5 gap-5'>
            <div className='cursor-pointer' onClick={() => dispatch(setSelectedUser(null))}>
              <IoIosArrowRoundBack className='w-10 h-10 text-white' />
            </div>
            <div className='w-[50px] h-[50px] rounded-full overflow-hidden flex justify-center items-center bg-white cursor-pointer shadow-lg'>
              <img src={selectedUser?.image || dp} alt="" className='h-full w-full object-cover' />
            </div>
            <h1 className='text-white font-semibold text-xl'>{selectedUser?.name || "user"}</h1>
          </div>

          <div className='w-full h-[70%] flex flex-col py-5 px-5 overflow-auto gap-5'>
            {showPicker && (
              <div className='absolute bottom-[120px] left-[20px] z-[100]'>
                <EmojiPicker width={250} height={350} onEmojiClick={onEmojiClick} />
              </div>
            )}

            {messages && messages.map((mess) =>
              mess.sender === userData._id
                ? <SenderMessage key={mess._id} image={mess.image} message={mess.message} />
                : <ReceiverMessage key={mess._id} image={mess.image} message={mess.message} />
            )}
          </div>
        </div>
      }

      {selectedUser &&
        <div className='w-full lg:w-[70%] h-[100px] fixed bottom-5 flex items-center justify-center px-5'>
          {frontendImage && (
            <img
              src={frontendImage}
              alt="preview"
              className='w-[80px] rounded-lg shadow-lg absolute bottom-[110px] right-[25%]'
            />
          )}

          <form
            className='w-full lg:w-[70%] h-[60px] bg-pink-600 shadow-lg rounded-full flex items-center gap-5 px-5 relative'
            onSubmit={handleSendMessage}
          >
            <div onClick={() => setShowPicker(prev => !prev)} className='cursor-pointer'>
              <RiEmojiStickerLine className='w-6 h-6 text-white' />
            </div>
            <input
              type="file"
              accept="image/*"
              ref={image}
              hidden
              onChange={handleImage}
            />
            <input
              type="text"
              className='w-full h-full px-3 outline-none border-0 text-white bg-transparent placeholder-pink-200 text-lg'
              placeholder='Message'
              onChange={(e) => setInput(e.target.value)}
              value={input}
            />
            <div onClick={() => image.current.click()} className='cursor-pointer'>
              <FaImages className='w-6 h-6 text-white' />
            </div>
            <button
              type="submit"
              disabled={input.length === 0 && !backendImage}
              className={`p-3 rounded-full bg-pink-700 hover:bg-pink-800 transition text-white shadow-lg
                ${(input.length === 0 && !backendImage) ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
              aria-label="Send Message"
            >
              <RiSendPlane2Fill className="w-6 h-6" />
            </button>
          </form>
        </div>
      }

      {!selectedUser &&
        <div className='w-full h-full flex flex-col justify-center items-center'>
          <h1 className='text-pink-700 font-bold text-[50px]'>Welcome to BlinkChat</h1>
          <span className='text-pink-600 font-semibold text-[30px]'>Chat Friendly!</span>
        </div>
      }
    </div>
  )
}

export default MessageArea
