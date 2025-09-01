import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Signup from './pages/Signup'
import Login from './pages/Login'
import Customize from './pages/Customize'
import { useContext } from 'react'
import { userDataContext } from './context/UserContext'
import Home from './pages/Home'
import Customize2 from './pages/Customize2'

const App = () => {
  const {userData, setUserData} = useContext(userDataContext)
  return (
   <Routes>
      <Route path='/' element={(userData?.user.assistantImage && userData?.user.assistantName) ? <Home /> : <Navigate to={"/customize"} />} />
      <Route path='/signup' element={!userData ? <Signup /> : <Navigate to={"/"} />} />
      <Route path='/login' element={!userData ? <Login /> : <Navigate to={"/"} />} />
      <Route path='/customize' element={userData ? <Customize /> : <Navigate to={"/signup"} />} />
      <Route path='/customize2' element={userData ? <Customize2 /> : <Navigate to={"/signup"} />} />
   </Routes>
  )
}

export default App

