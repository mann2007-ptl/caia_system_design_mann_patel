import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';
import { API_ENDPOINTS, STORAGE_KEYS } from '../../constants';

// ───────────── Async Thunks ─────────────

export const loginUser = createAsyncThunk(
    'auth/loginUser',
    async (credentials, { rejectWithValue }) => {
        try {
            const response = await api.post(API_ENDPOINTS.AUTH.LOGIN, credentials);
            const { data, accessToken, refreshToken } = response.data;
            let userData = data?.user || data;

            // Failsafe: If the backend login response is outdated and missing the role, 
            // fetch the full profile immediately using the new token.
            if (!userData.role) {
                const profileRes = await api.get(API_ENDPOINTS.AUTH.PROFILE, {
                    headers: { Authorization: `Bearer ${accessToken}` }
                });
                const profileData = profileRes.data?.data?.user || profileRes.data?.data || profileRes.data;
                if (profileData && profileData.role) {
                    userData.role = profileData.role;
                }
            }

            // Persist tokens and user
            localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken);
            localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
            localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userData));

            return { user: userData, token: accessToken };
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || 'Login failed. Please try again.'
            );
        }
    }
);

export const registerUser = createAsyncThunk(
    'auth/registerUser',
    async (userData, { rejectWithValue }) => {
        try {
            const response = await api.post(API_ENDPOINTS.AUTH.REGISTER, userData);
            const { data, accessToken, refreshToken } = response.data;
            const userData = data?.user || data;

            localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken);
            localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
            localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userData));

            return { user: userData, token: accessToken };
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || 'Registration failed. Please try again.'
            );
        }
    }
);

export const forgotPassword = createAsyncThunk(
    'auth/forgotPassword',
    async (email, { rejectWithValue }) => {
        try {
            const response = await api.post(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, { email });
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || 'Something went wrong.'
            );
        }
    }
);

export const resetPassword = createAsyncThunk(
    'auth/resetPassword',
    async ({ resetToken, newPassword }, { rejectWithValue }) => {
        try {
            const response = await api.post(API_ENDPOINTS.AUTH.RESET_PASSWORD, {
                resetToken,
                newPassword,
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || 'Failed to reset password.'
            );
        }
    }
);

export const verifyEmail = createAsyncThunk(
    'auth/verifyEmail',
    async (email, { rejectWithValue }) => {
        try {
            const response = await api.post(API_ENDPOINTS.AUTH.VERIFY_EMAIL, { email });
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || 'Email verification failed.'
            );
        }
    }
);

export const fetchCurrentUser = createAsyncThunk(
    'auth/fetchCurrentUser',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get(API_ENDPOINTS.AUTH.PROFILE);
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || 'Failed to authenticate user.'
            );
        }
    }
);

// ───────────── Persisted State ─────────────

const persistedUser = (() => {
    try {
        const raw = localStorage.getItem(STORAGE_KEYS.USER);
        return raw ? JSON.parse(raw) : null;
    } catch {
        return null;
    }
})();

const persistedToken = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN) || null;

// ───────────── Slice ─────────────

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        user: persistedUser,
        token: persistedToken,
        role: persistedUser?.role || persistedUser?.user?.role || null,
        isAuthenticated: !!persistedToken,
        isInitialized: !persistedToken,
        loading: false,
        error: null,
        forgotPasswordSuccess: false,
        resetPasswordSuccess: false,
        emailVerified: false,
    },
    reducers: {
        logout: (state) => {
            state.user = null;
            state.token = null;
            state.role = null;
            state.isAuthenticated = false;
            state.loading = false;
            state.error = null;
            localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
            localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
            localStorage.removeItem(STORAGE_KEYS.USER);
        },
        clearError: (state) => {
            state.error = null;
        },
        resetAuthStates: (state) => {
            state.forgotPasswordSuccess = false;
            state.resetPasswordSuccess = false;
            state.emailVerified = false;
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Login
            .addCase(loginUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.loading = false;
                state.isAuthenticated = true;
                const userData = action.payload.user?.user || action.payload.user;
                state.user = userData;
                state.token = action.payload.token;
                state.role = userData?.role || 'user';
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Register
            .addCase(registerUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.loading = false;
                state.isAuthenticated = true;
                const userData = action.payload.user?.user || action.payload.user;
                state.user = userData;
                state.token = action.payload.token;
                state.role = userData?.role || 'user';
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Forgot Password
            .addCase(forgotPassword.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.forgotPasswordSuccess = false;
            })
            .addCase(forgotPassword.fulfilled, (state) => {
                state.loading = false;
                state.forgotPasswordSuccess = true;
            })
            .addCase(forgotPassword.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Reset Password
            .addCase(resetPassword.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.resetPasswordSuccess = false;
            })
            .addCase(resetPassword.fulfilled, (state) => {
                state.loading = false;
                state.resetPasswordSuccess = true;
            })
            .addCase(resetPassword.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Verify Email
            .addCase(verifyEmail.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.emailVerified = false;
            })
            .addCase(verifyEmail.fulfilled, (state) => {
                state.loading = false;
                state.emailVerified = true;
            })
            .addCase(verifyEmail.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Fetch Current User
            .addCase(fetchCurrentUser.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchCurrentUser.fulfilled, (state, action) => {
                state.loading = false;
                state.isInitialized = true;
                state.isAuthenticated = true;
                const userData = action.payload.data?.user || action.payload.data || action.payload.user || action.payload;
                state.user = userData;
                state.role = userData?.role || 'user';
            })
            .addCase(fetchCurrentUser.rejected, (state) => {
                state.loading = false;
                state.isInitialized = true;
                state.isAuthenticated = false;
                state.user = null;
                state.token = null;
                state.role = null;
                localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
                localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
                localStorage.removeItem(STORAGE_KEYS.USER);
            });
    },
});

export const { logout, clearError, resetAuthStates } = authSlice.actions;
export default authSlice.reducer;
