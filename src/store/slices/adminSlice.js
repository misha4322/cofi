import { createSlice } from '@reduxjs/toolkit'

const ADMIN_STORAGE_KEY = 'coffeeShopAdminDB'
const SESSION_STORAGE_KEY = 'coffeeShopAdminSession'

const defaultAdminDb = {
  username: 'admin',
  // SHA-256 hash for: admin123
  passwordHash: '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9',
}

const legacyAdminHash = '6f45331f36f44ce03132545fd4ac21695a9f79015edb7ec3d17703f56431313a'

const loadAdminDb = () => {
  try {
    if (typeof window === 'undefined') return defaultAdminDb
    const existing = localStorage.getItem(ADMIN_STORAGE_KEY)
    if (existing) {
      const parsed = JSON.parse(existing)
      // Migrate previous default password to new one.
      if (parsed.passwordHash === legacyAdminHash) {
        const migrated = { ...parsed, passwordHash: defaultAdminDb.passwordHash }
        localStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(migrated))
        return migrated
      }
      return parsed
    }
    localStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(defaultAdminDb))
    return defaultAdminDb
  } catch {
    return defaultAdminDb
  }
}

const loadSession = () => {
  try {
    if (typeof window === 'undefined') return { isLoggedIn: false }
    const session = localStorage.getItem(SESSION_STORAGE_KEY)
    if (!session) return { isLoggedIn: false }
    return JSON.parse(session)
  } catch {
    return { isLoggedIn: false }
  }
}

const saveSession = (session) => {
  try {
    if (typeof window === 'undefined') return
    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session))
  } catch {
    // ignore persist errors
  }
}

const initialSession = loadSession()

const adminSlice = createSlice({
  name: 'admin',
  initialState: {
    db: loadAdminDb(),
    isLoggedIn: Boolean(initialSession.isLoggedIn),
  },
  reducers: {
    loginAdminSuccess: (state) => {
      state.isLoggedIn = true
      saveSession({ isLoggedIn: true })
    },
    logoutAdmin: (state) => {
      state.isLoggedIn = false
      saveSession({ isLoggedIn: false })
    },
  },
})

export const { loginAdminSuccess, logoutAdmin } = adminSlice.actions
export default adminSlice.reducer
