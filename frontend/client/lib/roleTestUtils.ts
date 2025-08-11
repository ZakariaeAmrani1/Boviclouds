import type { UserRole } from "./roleNavigation";

/**
 * Development utility to test different roles
 * This should only be used during development
 */
export const setTestRole = (role: UserRole | null) => {
  if (import.meta.env.DEV) {
    console.log(`Setting test role to: ${role}`);
    
    // Create a mock JWT token with the specified role
    if (role) {
      const mockToken = btoa(JSON.stringify({
        header: { alg: "HS256", typ: "JWT" }
      })) + '.' + 
      btoa(JSON.stringify({
        sub: "test-user",
        email: "test@example.com",
        role: role,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60) // 24 hours
      })) + '.signature';
      
      localStorage.setItem('access_token', mockToken);
      
      // Also set a mock user
      const mockUser = {
        CIN: "TEST123",
        email: "test@example.com",
        nom_ar: "اختبار",
        prenom_ar: "مستخدم",
        nom_lat: "Test",
        prenom_lat: "User",
        civilite: "M",
        adresse: "Test Address",
        region: "Test Region",
        province: "Test Province",
        password: "",
        raison_sociale: "",
        role: role
      };
      
      localStorage.setItem('user', JSON.stringify(mockUser));
    } else {
      localStorage.removeItem('access_token');
      localStorage.removeItem('user');
    }
    
    // Reload the page to apply changes
    window.location.reload();
  } else {
    console.warn('setTestRole can only be used in development mode');
  }
};

// Create global function for easy testing in browser console
if (import.meta.env.DEV) {
  (window as any).setTestRole = setTestRole;
  console.log('Role testing utility loaded. Use setTestRole("ADMIN"), setTestRole("INSEMINATEUR"), etc. in console to test different roles');
}
