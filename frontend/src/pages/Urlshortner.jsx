import React, { useState } from 'react'
import Input from '../components/Input'
import InputButton from '../components/InputButton'
import authService from '../services/authService'
import { useUrl } from '../context/UrlContext.jsx'
import { useNavigate } from 'react-router-dom'
import Zip from './Zip.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import Analytics from './Analytics.jsx'


const Urlshortner = () => {

  const [link, setLink] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { shortUrl, setShortUrl } = useUrl()
  const { accessToken } = useAuth()
  const { logout } = useAuth()
  const navigate = useNavigate()
  const [shortener, setShortener] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setShortUrl('')
    setError('')

    if (!link) {
      setError('Url is required.')
      return
    }
    if (!accessToken) {
      setError("You are not authenticated. Please log in.")
      return;
    }
    setLoading(true)
    try {
      setShortener(false)
      const response = await authService.shorten(link, accessToken);
      setShortUrl(response.id)
      setShortener(true)
    } catch (error) {
      console.log(error)
      if (error.response && (error.response.status === 401 || error.response.status === 403)) {
        setError("Session expired or unauthorized. Please log in again.");
      } else {
        setError(error.message || "Shorten URL failed. Please try again.")
      }
    } finally {
      setLoading(false)
    }
  }

  const handleClick = async (e) => {
    try {
      await logout();
      navigate('/signup')
    } catch (error) {
      console.log(error)
      setError(error.message || "Logout failed. Please try again.")
    }
  }
  return (
    <div className='static h-screen flex justify-center items-center bg-black'>
      <div>
        <div className='text-5xl font-bold text-center mb-8 text-white'>ZipLink</div>
        {shortener ? <div>
          <Zip longUrl={link} />
          <Analytics shortUrl={shortUrl} />
        </div> :
          <div className='bg-black text-white p-10 mt-10'>
            <form onSubmit={handleSubmit}>
              <div className='grid gap-y-4'>
                <div className='text-3xl font-bold'>Paste the URl to be shortened</div>
                {error && (
                  <div className='text-[11px] mb-2 ml-1 text-red-400'>{error}</div>
                )}
                <Input type={'text'} onChange={(e) => setLink(e.target.value)} placeholder={'Enter the link here'} label={''} value={link} readOnly />
                <InputButton type={'submit'} disabled={loading} isLoading={loading} loadingText={'Zipping your url'} text={'Zip Url'} />
              </div>
            </form>
          </div>
        }
      </div>
      <button onClick={handleClick} className='text-white absolute right-4 top-4 bg-zinc-800 p-2 cursor-pointer hover:outline-2 hover:outline-zinc-600 rounded-md'>
        Logout
      </button>
    </div>
  )
}

export default Urlshortner