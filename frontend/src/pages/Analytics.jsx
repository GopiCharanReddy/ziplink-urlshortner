import axios from 'axios'
import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext'

const Analytics = (shortUrl) => {
  const { accessToken } = useAuth()
  const [analyticsData, setAnalyticsData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleClick = async () => {
    setLoading(true);
    setError(null);
    setAnalyticsData(null);
    if (!shortUrl || !shortUrl.shortUrl) {
      setError("Short URl data is missing.")
      setLoading(false)
      return;
    }
    if (!accessToken) {
      setError("Authentication required to view analytics.")
      setLoading(false)
      return;
    }
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_API_URL}/url/analytics/${shortUrl.shortUrl}`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        },
        withCredentials: true,
      })
      console.log("Analytics received:", response.data.data);
      setAnalyticsData(response.data.data)
    } catch (error) {
      console.error("Error fetching analytics:", error);
      setError(error.response?.data?.message || "Failed to fetch analytics. Please try again.")
    } finally {
      setLoading(false)
    }
  }
  return (
    <div className='text-white m-10 mt-0' >
      <button onClick={handleClick} className='bg-zinc-800 p-2 w-full rounded-md' >
        View Analytics for this URl
      </button>

      {loading && <p className='text-gray-400 mt-2'>Loading Analytics...</p>}
      {error && <p className='text-red-500 mt-2'>Error: {error}</p>}

      {analyticsData && (
        <div className='bg-zinc-800 p-3 mt-3 rounded-md'>
          <h3 className='font-normal'>Total Clicks: {analyticsData.totalClicks}</h3>
        </div>
      )}
    </div>
  )
}

export default Analytics