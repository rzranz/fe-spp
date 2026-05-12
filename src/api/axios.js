import axios from 'axios'

const Api = axios.create({
  
  baseURL: 'https://api.darulfikri.sch.id/api', 
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
})
Api.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
}, error => {
  return Promise.reject(error)
})
Api.interceptors.response.use(response => response, error => {
  if (error.response && error.response.status === 401) {
    const currentPath = window.location.pathname;
    
    if (currentPath !== '/login' && currentPath !== '/') {
        localStorage.clear();
        window.location.href = '/login';
    }
  }
  return Promise.reject(error)
})

export default Api
