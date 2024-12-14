export default defineNuxtPlugin(async (nuxtApp) => {
  const auth = useAuth()
  
  // Initialize auth state
  await auth.initialize()
  
  // Add auth header to all requests
  nuxtApp.hook('app:created', () => {
    const token = auth.token
    if (token) {
      useRequestHeaders({
        Authorization: `Bearer ${token}`
      })
    }
  })
})