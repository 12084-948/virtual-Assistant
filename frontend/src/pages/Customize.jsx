import React, { useContext, useRef, useState } from 'react'
import Card from '../components/Card'
import image1 from '../assets/image1.png'
import image2 from '../assets/image2.jpg'
import image3 from '../assets/authBg.png'
import image4 from '../assets/image4.png'
import image5 from '../assets/image5.png'
import image6 from '../assets/image6.jpeg'
import image7 from '../assets/image7.jpeg'
import { RiImageAddLine } from 'react-icons/ri'
import { userDataContext } from '../context/UserContext'
import { useNavigate } from 'react-router-dom'
import { MdKeyboardBackspace } from 'react-icons/md'


const Customize = () => {
  const inputImage = useRef()
  const { backendImage, setBackendImage, frontendImage, setFrontendImage, selectedImage, setSelectedImage } = useContext(userDataContext)
  const navigate = useNavigate()

  const handleImage = (e) => {
    const file = e.target.files[0];
    setBackendImage(file)
    setFrontendImage(URL.createObjectURL(file))
  }

  return (
    <div className={'w-full relative h-[100vh] bg-gradient-to-t from-[black] to-[#020236] flex justify-center items-center flex-col'}>
      <MdKeyboardBackspace onClick={() => navigate('/')} className='absolute cursor-pointer top-[30px] left-[30px] text-white w-[25px] h-[25px]' />
      <h1 className='text-white mb-[30px] text-[30px] text-center'>Select your <span className='text-blue'>Assistant Image</span></h1>
      <div className='w-[90%] max-w-[900px] gap-[15px] flex justify-center items-center flex-wrap'>
        <Card image={image1} />
        <Card image={image2} />
        <Card image={image3} />
        <Card image={image4} />
        <Card image={image5} />
        <Card image={image6} />
        <Card image={image7} />

        <div onClick={() => {
          inputImage.current.click()
          setSelectedImage("input")
        }} className={`w-[70px] h-[140px] lg:w-[150px] lg:h-[250px] bg-[#020220] border-2 overflow-hidden border-[#0909f03b] rounded-2xl hover:shadow-2xl hover:shadow:blue cursor-pointer hover:border-white flex justify-center items-center ${selectedImage == "input" ? "border-4 border-white shadow-2xl shadow-blue-950" : null}`}>
          {
            !frontendImage && <RiImageAddLine className='text-white w-[25px] h-[25px]' />
          }
          {
            frontendImage && <img src={frontendImage} className='h-full object-cover' />
          }
        </div>
      </div>
      <input onChange={handleImage} hidden type="file" accept='image/*' ref={inputImage} />
      {
        selectedImage && <button onClick={() => navigate('/customize2')} className='min-w-[150px] mt-[30px] h-[60px] bg-white rounded-full text-black font-semibold text-[19px] cursor-pointer'>Next</button>
      }
    </div>
  )
}

export default Customize