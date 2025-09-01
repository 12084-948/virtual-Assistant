import React, { useContext } from 'react'
import { userDataContext } from '../context/UserContext'

const Card = ({image}) => {
  const { backendImage, setBackendImage,
      frontendImage, setFrontendImage,
      selectedImage, setSelectedImage } = useContext(userDataContext)
  
  return (
    <div onClick={()=>{
      setSelectedImage(image)
      setFrontendImage(null)
      setBackendImage(null)
      }} className= {`w-[70px] h-[140px] lg:w-[150px] lg:h-[250px] bg-[#020220] border-2 overflow-hidden border-[#0909f03b] rounded-2xl hover:shadow-2xl hover:shadow:blue cursor-pointer hover:border-white ${selectedImage == image ? "border-4 border-white shadow-2xl shadow-blue-950" : null}`}>
        <img src={image} className='h-full object-cover'/>
    </div>
  )
}
export default Card