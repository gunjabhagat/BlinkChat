import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import dp from "../assets/dp.webp"
import { IoIosSearch } from "react-icons/io";
import { RxCross2 } from "react-icons/rx";
import { BiLogOutCircle } from "react-icons/bi";
import { serverUrl } from '../main';
import axios from 'axios';
import { setOtherUsers, setSearchData, setSelectedUser, setUserData } from '../redux/userSlice';
import { useNavigate } from 'react-router-dom';

function SideBar() {
  let { userData, otherUsers, selectedUser, onlineUsers, searchData } = useSelector(state => state.user)
  let [search, setSearch] = useState(false)
  let [input, setInput] = useState("")
  let dispatch = useDispatch()
  let navigate = useNavigate()

  const handleLogOut = async () => {
    try {
      await axios.get(`${serverUrl}/api/auth/logout`, { withCredentials: true })
      dispatch(setUserData(null))
      dispatch(setOtherUsers(null))
      navigate("/login")
    } catch (error) {
      console.log(error)
    }
  }

  const handlesearch = async () => {
    try {
      let result = await axios.get(`${serverUrl}/api/user/search?query=${input}`, { withCredentials: true })
      dispatch(setSearchData(result.data))
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    if (input) handlesearch()
  }, [input])

  return (
    <div className={`lg:w-[30%] w-full h-full overflow-hidden lg:block bg-pink-400/80 backdrop-blur-md relative
      ${!selectedUser ? "block" : "hidden"} shadow-lg border border-pink-600`}>

      {/* Logout Button */}
      <div
        className='w-14 h-14 fixed bottom-6 left-4 rounded-full bg-pink-600/70 backdrop-blur-md shadow-lg flex justify-center items-center cursor-pointer hover:bg-pink-700 transition'
        onClick={handleLogOut}
        title="Logout"
      >
        <BiLogOutCircle className='w-7 h-7 text-white' />
      </div>

      {/* Search results dropdown */}
      {input.length > 0 && (
        <div className='flex absolute top-[220px] bg-pink-700/90 w-full max-h-[400px] overflow-y-auto items-center pt-5 flex-col gap-3 z-[150] rounded-lg shadow-xl border border-pink-600/90 px-2'>
          {searchData?.map((user) => (
            <div
              key={user._id}
              className='w-[95%] h-[70px] flex items-center gap-5 px-4 rounded-lg hover:bg-pink-600 cursor-pointer transition text-white'
              onClick={() => {
                dispatch(setSelectedUser(user))
                setInput("")
                setSearch(false)
              }}
            >
              <div className='relative rounded-full bg-pink-300 shadow-md flex justify-center items-center w-14 h-14'>
                <img src={user.image || dp} alt="" className='h-full w-full object-cover rounded-full' />
                {onlineUsers?.includes(user._id) && (
                  <span className='w-3 h-3 rounded-full absolute bottom-1 right-1 bg-green-400 shadow-md'></span>
                )}
              </div>
              <h1 className='font-semibold text-lg truncate'>{user.name || user.userName}</h1>
            </div>
          ))}
        </div>
      )}

      {/* Header */}
      <div className='w-full h-[230px] bg-pink-600/80 backdrop-blur-md shadow-lg flex flex-col justify-center px-6 border border-pink-700 rounded-none'>
        <h1 className='text-white font-extrabold text-3xl mb-3 select-none drop-shadow-lg'>BlinkChat</h1>

        <div className='flex justify-between items-center mb-3'>
          <h1 className='text-white font-semibold text-2xl select-none drop-shadow-md'>Hii, {userData?.name || "user"}</h1>
          <div
            className='w-14 h-14 rounded-full overflow-hidden bg-pink-300 shadow-lg cursor-pointer transition hover:scale-105'
            onClick={() => navigate("/profile")}
          >
            <img src={userData?.image || dp} alt="" className='h-full w-full object-cover' />
          </div>
        </div>

        {/* Search Bar */}
        <div className='w-full'>
          {!search && (
            <button
              className='w-14 h-14 rounded-full bg-pink-300 shadow-md flex justify-center items-center cursor-pointer hover:scale-110 transition'
              onClick={() => setSearch(true)}
              aria-label="Open Search"
            >
              <IoIosSearch className='w-7 h-7 text-pink-800' />
            </button>
          )}

          {search && (
            <form className='w-full h-14 bg-pink-300 rounded-full shadow-md flex items-center gap-4 px-5 relative'>
              <IoIosSearch className='w-7 h-7 text-pink-800' />
              <input
                type="text"
                placeholder='Search users...'
                className='flex-grow h-full text-lg outline-none border-0 bg-transparent text-pink-900 placeholder-pink-800'
                onChange={(e) => setInput(e.target.value)}
                value={input}
                autoFocus
              />
              <RxCross2
                className='w-7 h-7 cursor-pointer text-pink-800 hover:text-pink-900 transition'
                onClick={() => { setSearch(false); setInput('') }}
                aria-label="Close Search"
              />
            </form>
          )}
        </div>

        {/* Online users circles */}
        <div className='flex items-center gap-5 mt-4 overflow-x-auto'>
          {!search && otherUsers?.map(user => (
            onlineUsers?.includes(user._id) && (
              <div
                key={user._id}
                className='relative w-14 h-14 rounded-full bg-pink-300 shadow-md cursor-pointer hover:scale-110 transition transform'
                onClick={() => dispatch(setSelectedUser(user))}
                title={user.name || user.userName}
              >
                <img src={user.image || dp} alt="" className='w-full h-full object-cover rounded-full' />
                <span className='w-3 h-3 rounded-full absolute bottom-1 right-1 bg-green-400 shadow-md'></span>
              </div>
            )
          ))}
        </div>
      </div>

      {/* Users list */}
      <div className='w-full h-[50%] overflow-y-auto flex flex-col gap-5 items-center mt-5 px-4'>
        {otherUsers?.map(user => (
          <div
            key={user._id}
            className='w-full max-w-[95%] h-[60px] flex items-center gap-5 bg-pink-300 rounded-full shadow-md hover:bg-pink-400 cursor-pointer transition px-4 text-pink-900'
            onClick={() => dispatch(setSelectedUser(user))}
          >
            <div className='relative w-14 h-14 rounded-full bg-pink-200 shadow-md flex justify-center items-center'>
              <img src={user.image || dp} alt="" className='w-full h-full object-cover rounded-full' />
              {onlineUsers?.includes(user._id) && (
                <span className='w-3 h-3 rounded-full absolute bottom-1 right-1 bg-green-400 shadow-md'></span>
              )}
            </div>
            <h1 className='font-semibold text-lg truncate'>{user.name || user.userName}</h1>
          </div>
        ))}
      </div>
    </div>
  )
}

export default SideBar
