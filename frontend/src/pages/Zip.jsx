import React, { useEffect, useState } from 'react'
import Input from '../components/Input'
import InputButton from '../components/InputButton'
import { useUrl } from '../context/UrlContext.jsx'
import { useNavigate } from 'react-router-dom'
const Zip = ({ longUrl }) => {
  const { shortUrl } = useUrl()
  const [copied, setCopied] = useState(false)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    if (!shortUrl) {
      navigate('/')
    }
  }, [shortUrl, navigate])

  const clickableShortUrl = shortUrl ? `${import.meta.env.VITE_BACKEND_API_URL}/url/${shortUrl}` : ''

  const handleCopy = async (e) => {
    e.preventDefault()

    if (!shortUrl) {
      return (
        <div className='h-screen flex justify-center items-center bg-black text-white'>
          <div className='text-center'>
            <p className='text-xl'>No short URL generated. Please go back to shorten a link.</p>
            <button onClick={() => navigate('/')} className='mt-4 px-6 py-2 bg-blue-600 rounded-md'>Go to Shortener</button>
          </div>
        </div>
      );
    }
    if (!clickableShortUrl) {
      console.warn("No short URL to copy.")
      return;
    }
    setLoading(true)
    try {
      await navigator.clipboard.writeText(clickableShortUrl)
      setCopied(true)
    } catch (error) {
      console.error("Failed to copy URL: ", error)
    } finally {
      setLoading(false)
    }
  }
  return (
    <>
      <div className='bg-black text-white mt-10 p-10'>
        <form>
          <div className='grid gap-y-4 mb-5'>
            <div className='text-3xl font-bold'>Your shortened URL</div>
            <div>Copy the short link and share it.</div>
            <Input type={'text'} onChange={(e) => setLink(e.target.value)} placeholder={'Enter the link here'} readOnly label={''} value={clickableShortUrl} />
            <InputButton onClick={handleCopy} type={'button'} disabled={loading} isLoading={loading} loadingText={loading ? 'Copy Link' : 'Link Copied.'} text={copied ? 'Copied!' : 'Copy Link'} />
          </div>
        </form>
        <Input label={'Long Url: '} value={longUrl} readOnly />
      </div>
      <div>
      </div>
    </>
  )
}

export default Zip