import axios from 'axios';

const API = 'http://localhost:3000/api/v1'; // Replace with your backend base URL

export const signup = async (email: string, password: string, username: string): Promise<boolean> => {
  try {
    const res = await axios.post(
      `${API}/auth/signup`,
      { email, password, username },
      { withCredentials: true } 
    );

    return res.data.status === 200;
  } catch (error) {
    console.error("Signup error:", error);
    return false;
  }
};

export const login = async (email: string, password: string): Promise<boolean> => {
  try {
    const res = await axios.post(
      `${API}/auth/login`,
      { email, password },
      { withCredentials: true }
    );

    return res.data.status === 200;
  } catch (error) {
    console.error("Login error:", error);
    return false;
  }
};

export const logout = async (): Promise<void> => {
  try {
    await axios.post(`${API}/auth/logout`, {}, { withCredentials: true });
  } catch (error) {
    console.error("Logout error:", error);
  }
};
