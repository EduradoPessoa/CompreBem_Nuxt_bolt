export default defineNuxtRouteMiddleware((to) => {
  const auth = useAuth()
  
  // Public routes
  const publicRoutes = ['/login', '/register']
  
  if (!auth.isAuthenticated && !publicRoutes.includes(to.path)) {
    return navigateTo('/login')
  }
  
  if (auth.isAuthenticated && publicRoutes.includes(to.path)) {
    return navigateTo('/')
  }
})