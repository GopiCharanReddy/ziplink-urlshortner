import React, { createContext, useContext, useState } from 'react'

const urlcontext = createContext(null)

export const UrlProvider = ({children}) => {
  const [shortUrl, setShortUrl] = useState('')
  const contextValue = {
    shortUrl, setShortUrl
  }

  return (
    <urlcontext.Provider value={contextValue}>
      {children}
    </urlcontext.Provider>
  )
}

export const useUrl = () => {
  const context = useContext(urlcontext)
  if(context === undefined) {
    throw new Error('useUrl must be used within a UrlProvider')
  }
  return context;
}