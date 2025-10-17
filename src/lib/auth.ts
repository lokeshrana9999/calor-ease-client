import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';

interface JwtPayload {
  exp: number;
  iat: number;
  [key: string]: any;
}

export const AUTH_TOKEN_KEY = 'auth_token';

export const authUtils = {
  // Store token in cookie
  setToken(token: string): void {
    // Set cookie to expire in 1 hour (same as JWT)
    Cookies.set(AUTH_TOKEN_KEY, token, {
      expires: 1 / 24, // 1 hour in days
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    });
  },

  // Get token from cookie
  getToken(): string | null {
    return Cookies.get(AUTH_TOKEN_KEY) || null;
  },

  // Remove token
  removeToken(): void {
    Cookies.remove(AUTH_TOKEN_KEY);
  },

  // Check if token is valid and not expired
  isTokenValid(): boolean {
    let token = this.getToken();
    if (!token) return false;

    try {
      const decoded = jwtDecode<JwtPayload>(token);
      let currentTime = Date.now() / 1000;
      return decoded.exp > currentTime;
    } catch {
      return false;
    }
  },

  // Get token expiration time
  getTokenExpiration(): Date | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      const decoded = jwtDecode<JwtPayload>(token);
      return new Date(decoded.exp * 1000);
    } catch {
      return null;
    }
  },

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return this.isTokenValid();
  },
};

