import { defineStore } from 'pinia'

interface User {
  id: string
  email: string
  name: string
}

interface AuthState {
  user: User | null
  token: string | null
}

export const useAuth = defineStore('auth', {
  state: (): AuthState => ({
    user: null,
    token: null
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
    currentUser: (state) => state.user
  },

  actions: {
    async login(email: string, password: string) {
      try {
        const response = await $fetch('/api/auth/login', {
          method: 'POST',
          body: { email, password }
        })

        this.token = response.token
        this.user = response.user
        
        // Store token in localStorage
        localStorage.setItem('token', response.token)
        
        return true
      } catch (error) {
        console.error('Login failed:', error)
        return false
      }
    },

    async register(name: string, email: string, password: string) {
      try {
        await $fetch('/api/auth/register', {
          method: 'POST',
          body: { name, email, password }
        })
        
        return true
      } catch (error) {
        console.error('Registration failed:', error)
        return false
      }
    },

    logout() {
      this.token = null
      this.user = null
      localStorage.removeItem('token')
    },

    async initialize() {
      const token = localStorage.getItem('token')
      if (token) {
        this.token = token
        // Fetch user data
        try {
          const user = await $fetch('/api/auth/me')
          this.user = user
        } catch {
          this.logout()
        }
      }
    }
  }
})