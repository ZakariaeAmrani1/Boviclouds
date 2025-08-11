# Role-Based Navigation System

This document describes the role-based navigation system implemented for the Boviclouds application.

## Overview

The system restricts access to pages based on user roles extracted from JWT tokens. Each role has specific permissions to access certain pages while maintaining the existing functionality of all services.

## Roles and Permissions

### ADMIN
- **Access**: All pages
- **Pages**: Dashboard, Rebouclage, Identification, Insémination, Semences, Lactations, Exploitations, Utilisateurs, CCTV, Traitement, Profile

### INSEMINATEUR  
- **Access**: Insemination-related pages
- **Pages**: Dashboard, Insémination, Semences, Profile

### IDENTIFICATEUR
- **Access**: Identification-related pages  
- **Pages**: Dashboard, Identification, Rebouclage, Profile

### CONTROLEUR_LAITIER
- **Access**: Lactation-related pages
- **Pages**: Dashboard, Lactations, Profile

### RESPONSABLE_LOCAL
- **Access**: All pages (same as Admin for now)
- **Pages**: Dashboard, Rebouclage, Identification, Insémination, Semences, Lactations, Exploitations, Utilisateurs, CCTV, Traitement, Profile

## Implementation Files

### Core Files
- `client/lib/jwt.ts` - JWT token decoding utilities
- `client/lib/roleNavigation.ts` - Role-based navigation configuration
- `client/contexts/AuthContext.tsx` - Updated to include role management
- `client/components/Sidebar.tsx` - Updated to show role-appropriate menu items
- `client/components/RoleProtectedRoute.tsx` - Route protection component

### Development Tools
- `client/components/RoleIndicator.tsx` - Shows current user role (dev)
- `client/components/RoleTestPanel.tsx` - Test different roles (dev only)  
- `client/lib/roleTestUtils.ts` - Utilities for role testing (dev only)

## How It Works

1. **JWT Token**: On login, the JWT token is stored in localStorage
2. **Role Extraction**: The role is extracted from the JWT token payload
3. **Navigation Filtering**: Sidebar menu items are filtered based on role permissions
4. **Route Protection**: `RoleProtectedRoute` component prevents unauthorized access
5. **Fallback**: Users without permission are redirected to dashboard

## Testing (Development Mode)

In development mode, you can test different roles using:

1. **Browser Console**: 
   ```javascript
   setTestRole("ADMIN")
   setTestRole("INSEMINATEUR") 
   setTestRole("IDENTIFICATEUR")
   setTestRole("CONTROLEUR_LAITIER")
   setTestRole("RESPONSABLE_LOCAL")
   setTestRole(null) // Logout
   ```

2. **Test Panel**: A floating test panel appears in the bottom-right corner with buttons to switch between roles.

3. **Role Indicator**: A badge in the top-right shows the current user role.

## JWT Token Structure

The system expects JWT tokens with this payload structure:
```json
{
  "sub": "user-id",
  "email": "user@example.com", 
  "role": "ADMIN|INSEMINATEUR|IDENTIFICATEUR|CONTROLEUR_LAITIER|RESPONSABLE_LOCAL",
  "iat": 1234567890,
  "exp": 1234567890
}
```

## Key Features

- ✅ **Non-breaking**: All existing services and functionality remain unchanged
- ✅ **Role-based Navigation**: Menu items filtered by user role
- ✅ **Route Protection**: Unauthorized routes redirect to dashboard
- ✅ **JWT Integration**: Seamless integration with existing auth system
- ✅ **Development Tools**: Easy testing with role switching utilities
- ✅ **Fallback Support**: Graceful handling of missing or invalid roles

## Future Enhancements

- Add more granular permissions (read/write/delete)
- Add role management interface for admins
- Add audit logging for role-based access
- Add dynamic role updates without re-login
