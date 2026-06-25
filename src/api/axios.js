import axios from 'axios'

const Api = axios.create({
  // Pastikan URL ini benar ke backend lu
  baseURL: 'http://localhost:8000/api', 
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
})
Api.interceptors.request.use(config => {
  // Ambil token dari LocalStorage
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  
  return config
}, error => {
  return Promise.reject(error)
})


Api.interceptors.response.use(response => response, error => {
  if (error.response && (error.response.status === 401 || error.response.status === 403)) {
    localStorage.clear()
    window.location = '/login'
  }
  return Promise.reject(error)
})

export default Api