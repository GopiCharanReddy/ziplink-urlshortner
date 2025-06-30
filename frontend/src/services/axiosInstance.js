import axios from 'axios'

const instance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_API_URL,
  timeout: 5000,
});

instance.interceptors.request.use(
  config => {
    console.log('Request Interceptor: ', config);
    const token = localStorage.getItem('accessToken')

    if(token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config    
  }, (error) => {
    console.error('Request Error: ', error);
    return Promise.reject(error)    
  }
)

instance.interceptors.response.use(response => {
  console.log('Response Interceptor: ', response);
  return response  
}, (error) => {
  console.error('Response Error: ', error);
  return Promise.reject(error)  
})

export default instance