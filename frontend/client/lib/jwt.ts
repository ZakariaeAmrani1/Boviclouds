export interface DecodedToken {
  sub: string;
  email: string;
  role: string;
  iat: number;
  exp: number;
}

export const decodeJWT = (token: string): DecodedToken | null => {
  try {
    // JWT tokens have 3 parts separated by dots
    const parts = token.split('.');
    if (parts.length !== 3) {
      throw new Error('Invalid JWT format');
    }

    // Decode the payload (second part)
    const payload = parts[1];
    
    // Add padding if needed
    const paddedPayload = payload + '='.repeat((4 - payload.length % 4) % 4);
    
    // Decode base64
    const decodedPayload = atob(paddedPayload);
    
    // Parse JSON
    const parsedPayload = JSON.parse(decodedPayload);
    
    return parsedPayload;
  } catch (error) {
    console.error('Failed to decode JWT token:', error);
    return null;
  }
};

export const getUserRole = (): string | null => {
  // For now, let's check if the role is stored in the user object
  // until we confirm the JWT token structure from backend
  const savedUser = localStorage.getItem('user');
  if (savedUser) {
    try {
      const user = JSON.parse(savedUser);
      return user.role || 'ADMIN'; // Default to ADMIN for testing
    } catch (error) {
      console.error('Error parsing saved user for role:', error);
    }
  }

  // Fallback: try to decode JWT token
  const token = localStorage.getItem('access_token');
  if (token) {
    try {
      const decoded = decodeJWT(token);
      if (decoded?.role) {
        return decoded.role;
      }
    } catch (error) {
      // Ignore JWT decode errors for now
      console.log('JWT decode failed, using fallback role');
    }
  }

  return 'ADMIN'; // Default role for testing
};

export const isTokenExpired = (token: string): boolean => {
  const decoded = decodeJWT(token);
  if (!decoded) {
    return true;
  }

  const currentTime = Date.now() / 1000;
  return decoded.exp < currentTime;
};
