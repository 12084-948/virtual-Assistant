import React, { useContext, useEffect, useRef, useState } from 'react'
import { userDataContext } from '../context/UserContext'
import { useNavigate } from 'react-router-dom'
import aiImg from '../assets/ai.gif'
import userImg from '../assets/user.gif'
import axios from 'axios'
import { CgMenuRight } from 'react-icons/cg'
import { RxCross1 } from 'react-icons/rx'

const Home = () => {
  const { userData, serverUrl, setUserData, getGeminiResponse } = useContext(userDataContext)
  const navigate = useNavigate()
  const [listening, setListening] = useState(false)
  const isSpeakingRef = useRef(false);
  const recognitionRef = useRef(null);
  const isRecognizingRef = useRef(false)

  const synth = window.speechSynthesis

  const [userText, setUserText] = useState("")
  const [aiText, setAiText] = useState("")

  const [ham, setHam] = useState(false)


  const handleLogout = async () => {
    try {
      const result = await axios.get(`${serverUrl}/api/auth/logout`, { withCredentials: true })
      setUserData(null)
      navigate('/signup')

    } catch (error) {
      setUserData(null)
      console.log(error)
    }
  }

  const handleCommand = (data) => {
    const { type, userInput, response } = data;


    if (type === 'google-search') {
      const query = encodeURIComponent(userInput);
      window.open(`https://www.google.com/search?q=${query}`, '_blank');
    }
    if (type === 'calculator-open') {
      window.open('https://www.google.com/search?q=calculator', '_blank');
    }

    if (type === "instagram-open") {

      window.open('https://www.instagram.com/', '_blank');
    }

    if (type === "facebook-open") {
      window.open('https://www.facebook.com/', '_blank');

    }

    if (type === "weather-show") {
      window.open('https://www.google.com/search?q=weather', '_blank');
    }

    if (type === 'youtube-search' || type === 'youtube-play') {
      const query = encodeURIComponent(userInput);
      window.open(`https://www.youtube.com/results?search_query=${query}`, '_blank');

    }
  }

  const startRecognition = () => {
    if (!isSpeakingRef.current && !isRecognizingRef.current) {
      try {
        recognitionRef.current?.start()
        // setListening(true)
      } catch (error) {
        if (!error.name !== "InvalidStateError") {
          console.log("Recognition error", error)
        }
      }
    }
  }

  // const speak = (text, callback) => {


  //   const utterance = new SpeechSynthesisUtterance(text);
  //   isSpeakingRef.current = true
  //   utterance.onend = () => {
  //     isSpeakingRef.current = false
  //     if (callback) callback() 
  //     startRecognition()

  //   }
  //   synth.speak(utterance);
  // };
  const speak = (text, callback) => {
    if (!text) return

    // cancel anything still speaking
    synth.cancel()

    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = 'hi-IN'
    isSpeakingRef.current = true

    utterance.onend = () => {
      setAiText("")
      isSpeakingRef.current = false
      setTimeout(() => {
        startRecognition()
      }, 800)
      if (callback) callback() // e.g. handleCommand
      startRecognition()       // restart listening after speech
    }

    utterance.onerror = (e) => {
      console.error("Speech error:", e)
      isSpeakingRef.current = false
      startRecognition()
    }
    synth.cancel()
    synth.speak(utterance)
  }
  const unlockTTS = () => {
    const utterance = new SpeechSynthesisUtterance("Voice assistant ready.");
    window.speechSynthesis.speak(utterance);
  };


  useEffect(() => {

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.lang = "en-US";
    recognition.interimResults = false

    recognitionRef.current = recognition

    let isMounted = true

    const startTimeout = setTimeout(() => {
      if (!isMounted && !isSpeakingRef.current && !isRecognizingRef.current) {
        try {
          recognition.start()
          // setListening(true)
        } catch (error) {
          if (!error.name !== "InvalidStateError") {
            console.log("Recognition error", error)
          }
        }
      }
    }, 1000)


    const safeRecognizition = () => {

      if (!isSpeakingRef.current && !isRecognizingRef.current) {
        try {
          recognition.start()
          console.log('Recognization requested to start')
        } catch (error) {
          if (error.name !== "InvalidStateError") {
            console.log('start error', error)
          }
        }
      }
    }

    recognition.onstart = () => {
      isRecognizingRef.current = true;
      setListening(true)
    }

    recognition.onend = () => {
      isRecognizingRef.current = false;
      setListening(false)

      if (isMounted && !isSpeakingRef.current) {
        setTimeout(() => {
          if (isMounted) {
            try {
              recognition.start()
            } catch (error) {
              if (error.name !== "InvalidStateError") {
                console.log('start error', error)
              }
            }
          }
        }, 1000)
      }
    }

    recognition.onerror = (event) => {
      console.warn("Recognization error:", event.error)
      isRecognizingRef.current = false;
      setListening(false);
      if (event.error !== "aborted" && isMounted && !isSpeakingRef.current) {
        setTimeout(() => {
          if(isMounted){
            try {
              recognition.start()
            } catch (error) {
              if (error.name !== "InvalidStateError") {
                console.log('start error', error)
              }
            }
          }
        }, 1000);
      }
    }


    recognition.onresult = async (e) => {
      const transcript =
        e.results[e.results.length - 1][0].transcript.trim();
      console.log("Heard:", transcript);

      if (
        transcript
          .toLowerCase()
          .includes(userData.user.assistantName.toLowerCase())
      ) {
        setAiText("")
        setUserText(transcript)
        recognition.stop()
        isRecognizingRef.current = false
        setListening(false)
        const data = await getGeminiResponse(transcript);
        console.log("AI:", data.response);

        // handleCommand(data)
        // speak(data.response);
        speak(data.response, () => handleCommand(data))
        // setTimeout(() => handleCommand(data), 500) // delay to let voice start
        setAiText(data.response)
        setUserText("")
      }
    };

    const callback = setInterval(() => {
      if (!isSpeakingRef.current && !isRecognizingRef.current) {
        safeRecognizition()
      }
    }, 10000)

    safeRecognizition()

      // const greeting = new SpeechSynthesisUtterance(`Hello ${userData.name}, what can I Help you with?`)
      // greeting.lang = 'hi-IN'
      // window.speechSynthesis.speak(greeting)
 
    return () => {
      isMounted(false)
      recognition.stop()
      setListening(false)
      isRecognizingRef.current = false
      clearTimeout(startTimeout)
    }

  }, []);


  return (
    <div className='overflow-hidden w-full gap-[15px] relative h-[100vh] bg-gradient-to-t from-[black] to-[#020236] flex justify-center items-center flex-col'>
      <CgMenuRight onClick={() => setHam(true)} className='lg:hidden cursor-pointer text-white absolute top-[20px] right-[20px] w-[25px] h-[25px]' />

      <div className={`flex flex-col ${ham ? "translate-x-0" : "translate-x-full"} transition-transform gap-[20px] items-start absolute p-[20px] top-0 w-full h-full bg-[#0000003d] backdrop-blur-lg`}>
        <RxCross1 onClick={() => setHam(false)} className=' cursor-pointer text-white absolute top-[20px] right-[20px] w-[25px] h-[25px]' />
        <button type='submit' onClick={handleLogout} className=' cursor-pointer min-w-[150px] h-[60px] bg-white rounded-full text-black font-semibold text-[19px] '>Logout</button>
        <button type='submit' onClick={() => navigate('/customize')} className=' cursor-pointer min-w-[150px] h-[60px] bg-white rounded-full text-black font-semibold text-[19px] px-[20px] py-[10px]'>Customize your assistant</button>
        <div className='w-full h-[2px] bg-gray-400'></div>
        <h1 className='text-white font-semibold text-[19px]'>History</h1>
        <div className='w-full h-[400px] overflow-y-auto flex flex-col'>
          {
            userData.user.history?.map((his) => (
              <span className='text-gray-300 text-[18px] truncate '>{his}</span>
            ))

          }
        </div>
      </div>
      <button type='submit' onClick={handleLogout} className='absolute hidden lg:block cursor-pointer min-w-[150px] mt-[30px] h-[60px] bg-white rounded-full text-black font-semibold text-[19px] top-[20px] right-[20px]'>Logout</button>
      <button type='submit' onClick={() => navigate('/customize')} className='absolute hidden lg:block cursor-pointer min-w-[150px] mt-[30px] h-[60px] bg-white rounded-full text-black font-semibold text-[19px] top-[100px] right-[20px] px-[20px] py[10px]'>Customize your assistant</button>
      <button onClick={unlockTTS}>
        Click to enable voice
      </button>


      <div className='w-[300px] h-[400px] flex justify-center items-center overflow-hidden rounded-4xl shadow-lg'>
        <img src={userData?.user.assistantImage} alt="" className='h-full object-cover' />
      </div>
      <h1 className='text-white text-[18px] font-semibold'>I am {userData?.user.assistantName}</h1>
      {
        !aiText && <img src={userImg} className='w-[200px]' />
      }
      {
        aiText && <img src={aiImg} className='w-[200px]' />
      }
      <h1 className='text-white text-[15px] font-semibold text-wrap'>{userText ? userText : aiText ? aiText : null}</h1>

    </div>
  )

}
export default Home