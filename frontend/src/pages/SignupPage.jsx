import React, { useState } from 'react'
import Input from '../components/Input'
import InputButton from '../components/InputButton'
import Header from '../components/Header'
import BottomWarning from '../components/BottomWarning'
import { useNavigate } from 'react-router-dom'
import authService from '../services/authService'

const SignupPage = () => {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  

  const handleSubmit = async (e) => {
    e.preventDefault()

    setError('')

    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return;
    }

    if (!username || !email || !password || !confirmPassword) {
      setError('All fields are required.')
      return;
    }

    if (!email.includes('@')) {
      setError('Please enter a valid email address.')
      return;
    }
    if (password.length < 6) {
      setError('Password must be atleast 6 characters long.')
      return;
    }
    setLoading(true)
    try {
     const response = await authService.signup(username, email, password, confirmPassword);
      navigate('/signin')
    } catch (error) {
      console.log("Error while Signup: ", error)
      setError(error.message || "Signup failed. Please try again.")
    }
    finally {
      setLoading(false)
    }

  }
  return (
    <div className='min-h-screen flex justify-center items-center bg-black text-white'>
      <div className='grid gap-y-10'>
        <Header text={'Register and continue to start using Ziplink.'} heading={'Welcome to ZipLink'} />
        <form onSubmit={handleSubmit} className='grid gap-y-4 text-sm font-normal'>
          <Input onChange={(e) => setUsername(e.target.value)} value={username} type={'text'} placeholder={'Tyler Durden'} label={'Username'} />
          <Input onChange={(e) => setEmail(e.target.value)} value={email} type={'email'} placeholder={'projectmayhem@fc.com'} label={'Email'} />
          <Input onChange={(e) => setPassword(e.target.value)} value={password} placeholder={'••••••••'} type={'password'} label={'Password'} />
          <Input onChange={(e) => setConfirmPassword(e.target.value)} value={confirmPassword} type={'password'} placeholder={'••••••••'} label={'Confirm Password'} />
          <div>
            <div className='text-[11px] mb-2 ml-1 text-red-400'>
              {error && (
                <div>
                  {error}
                </div>
              )}
            </div>
            <InputButton type={'submit'} disabled={loading} isLoading={loading} loadingText={'Signing up...'} text={'Sign up →'} />
          </div>
          <BottomWarning label={"Already have an account?"} buttonText={"Sign in"} to={"/signin"} />
        </form>
      </div>
    </div>
  )
}

export default SignupPage