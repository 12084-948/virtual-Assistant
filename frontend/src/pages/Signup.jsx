import React, { useContext } from 'react'
import bg from '../assets/authBg.png'
import { IoEye } from 'react-icons/io5'
import { IoEyeOff } from 'react-icons/io5'
import axios from 'axios'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { userDataContext } from '../context/UserContext'

const Signup = () => {
    const { serverUrl, userData, setUserData } = useContext(userDataContext)
    // For Password 
    const [showPassword, setShowPassword] = useState(false)
    const navigate = useNavigate()

    // FOR FORM

    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [err, setErr] = useState("")
    const [loading, setLoading] = useState(false)
    

    const handleSignup = async (e) => {
        e.preventDefault();
        setErr("")
        setLoading(true)
        try {
            let result = await axios.post(`${serverUrl}/api/auth/signup`, {
                name, email, password
            }, { withCredentials: true })
            console.log(result.data)
            setUserData(result.data)
            setLoading(false)
            navigate('/customize')
        } catch (error) {
            console.log(error)
            setUserData(null)
            setErr(error.response.data.message)
            setLoading(false)
        }
    }

    return (
        <div className='w-full h-[100vh] bg-cover flex justify-center items-center' style={{ backgroundImage: `url(${bg})` }}>
            <form onSubmit={handleSignup} className='w-[90%] h-[600px] px-[20px] max-w-[500px] bg-[#00000069] backdrop-blur shadow-lg shadow-black flex flex-col items-center justify-center gap-[20px] '>
                <h1 className='text-white text-[30px] font-semibold mb-[30px]'>Register to <span className='text-blue-400'>Virtual Assistant</span></h1>
                <input type="text" required onChange={(e) => setName(e.target.value)} value={name} placeholder='Enter your name' className='w-full h-[60px] rounded-full px-[20px] py-[10px] text-[18px] outline-none border-2 border-white bg-transparent text-white placeholder-gray-300 ' />
                <input type="email" required onChange={(e) => setEmail(e.target.value)} value={email} placeholder='Enter your Email' className='w-full h-[60px] rounded-full px-[20px] py-[10px] text-[18px] outline-none border-2 border-white bg-transparent text-white placeholder-gray-300 ' />

                <div className='relative w-full h-[60px] border-2 border-white bg-transparent text-white rounded-full text-[18px]'>
                    <input type={showPassword ? "text" : "password"} placeholder='Enter your password' required value={password} onChange={(e) => setPassword(e.target.value)} className='w-full h-full rounded-full px-[20px] py-[10px] text-[18px] outline-none border-2 bg-transparent text-white placeholder-gray-300 ' />
                    {
                        !showPassword &&
                        <IoEye onClick={() => setShowPassword(true)} className=' w-[25px] h-[25px] cursor-pointer absolute top-[18px] right-[20px] text-white' />
                    }

                    {
                        showPassword &&
                        <IoEyeOff onClick={() => setShowPassword(false)} className=' w-[25px] cursor-pointer h-[25px] absolute top-[18px] right-[20px] text-white' />
                    }
                </div>
                {
                    err.length > 0 && 
                    <p className='text-red-500'>*{err}</p>
                }
                <button disabled={loading} type='submit' className='min-w-[150px] mt-[30px] h-[60px] bg-white rounded-full text-black font-semibold text-[19px]'>{loading ? "Loading..." : "Sign Up"}</button>
                <p className='text-white text-[19px] cursor-pointer'>Already have an account? <span onClick={() => navigate('/login')} className='text-blue-400'>Login here!</span></p>
            </form>
        </div>
    )
}

export default Signup