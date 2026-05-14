import axios from 'axios'

const fallbackBaseURL = import.meta.env.DEV ? 'http://localhost:5000' : ''
const baseURL = (import.meta.env.VITE_API_BASE_URL || fallbackBaseURL).replace(/\/$/, '')

const api = axios.create({
  baseURL,
})

export default api
