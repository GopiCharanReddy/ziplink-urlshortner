import React, { useState } from 'react'
import Input from '../components/Input'
import InputButton from '../components/InputButton'
import Header from '../components/Header'
import BottomWarning from '../components/BottomWarning'
import { useNavigate } from 'react-router'
import {useAuth} from '../context/AuthContext'

const SigninPage = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const { login, loadingAuth } = useAuth()
  const navigate = useNavigate()  

  const handleSubmit = async (e) => {
    e.preventDefault()

    setError('')

    if (!email || !password) {
      setError('All fields are required.')
      return;
    }

    if (!email.includes('@')) {
      setError('Please enter a valid email address.')
      return;
    }
    if (password.length < 8) {
      setError('Password must be atleast 8 characters long.')
      return;
    }
    try {
      const response = await login({email, password});
      if(response.success) {
        navigate('/')
      } else {
        setError(response.error || "Signin failed. Please try again.")
      }
    } catch (error) {
      console.log(error)
      setError(error.message || "Signin failed. Please try again.")
    }
  }
  return (
    <div className='min-h-screen flex justify-center items-center bg-black text-white'>
      <div className='grid gap-y-10'>
        <Header text={'Login and continue to start using Ziplink.'} heading={'Welcome to ZipLink'} />
        <form onSubmit={handleSubmit} className='grid gap-y-4 text-sm font-normal'>
          <Input onChange={(e) => setEmail(e.target.value)} value={email} type={'email'} placeholder={'projectmayhem@fc.com'} label={'Email'} />
          <Input onChange={(e) => setPassword(e.target.value)} value={password} placeholder={'••••••••'} type={'password'} label={'Password'} />
          <div>
            <div className='text-[11px] mb-2 ml-1 text-red-400'>
              {error && (
                <div>
                  {error}
                </div>
              )}
            </div>
            <InputButton type={'submit'} disabled={loadingAuth} isLoading={loadingAuth} loadingText={'Signing in...'} text={'Sign in →'} />
          </div>
          <BottomWarning label={"Already have an account?"} buttonText={"Sign up"} to={"/signup"} />
        </form>
      </div>
    </div>
  )
}

export default SigninPage