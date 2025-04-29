import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true, // Ensures cookies are sent with requests
});

export const login = async (email: string, password: string) => {
  try {
    const response = await api.post('/auth/login', { email, password });
    const { token } = response.data;

    // Store the token in localStorage
    localStorage.setItem('token', token);

    return { success: true, message: 'Logged in successfully' };
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error('Login failed:', error.response?.data || error.message);
    } else {
      console.error('Login failed:', error);
    }
    return { 
      success: false, 
      message: axios.isAxiosError(error) && error.response?.data?.message 
        ? error.response.data.message 
        : 'Login failed' 
    };
  }
};