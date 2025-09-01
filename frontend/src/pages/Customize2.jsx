import React, { useContext, useState } from 'react'
import { userDataContext } from '../context/UserContext'
import axios from 'axios'
import { MdKeyboardBackspace } from 'react-icons/md'
import { useNavigate } from 'react-router-dom'

const Customize2 = () => {
    const { serverUrl, userData, setUserData, backendImage, selectedImage } = useContext(userDataContext)
    const [assistantName, setAssistantName] = useState(userData?.user.assistantName || "")
    const [loading, setLoading] = useState(false)

    const navigate = useNavigate()

    const handleUpdateAssistant = async () => {
        try {
            let formData = new FormData()
            formData.append("assistantName", assistantName)
            if (backendImage) {
                formData.append("assistantImage", backendImage)
            }
            else {
                formData.append("imageUrl", selectedImage)
            }
            const result = await axios.post(`${serverUrl}/api/user/update`, formData, { withCredentials: true })
            console.log(result.data)
            setUserData(result.data)
        } catch (error) {
            console.log(error)
        }
    }


    return (
        <div className={'w-full h-[100vh] bg-gradient-to-t from-[black] to-[#020236] relative flex justify-center items-center flex-col'}>
            <MdKeyboardBackspace onClick={() => navigate('/customize')} className='absolute cursor-pointer top-[30px] left-[30px] text-white w-[25px] h-[25px]' />
            <h1 className='text-white mb-[30px] text-[30px] text-center'>Enter your <span className='text-blue-300'>Assistant Name</span></h1>
            <input value={assistantName} onChange={(e) => { setAssistantName(e.target.value) }} type="text" required placeholder='Example: Jarvis' className='w-full max-w-[600px] h-[60px] rounded-full px-[20px] py-[10px] text-[18px] outline-none border-2 border-white bg-transparent text-white placeholder-gray-300 ' />
            {
                assistantName &&
                <button disabled={loading} onClick={() => {
                    handleUpdateAssistant()
                     navigate('/')
                }} className='min-w-[300px] mt-[30px] h-[60px] bg-white rounded-full text-black font-semibold text-[19px] cursor-pointer'>{!loading ? "Create your assistant" : "Loading..."}</button>
            }

        </div>
    )
}

export default Customize2