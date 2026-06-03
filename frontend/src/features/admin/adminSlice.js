import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { adminService, analyticsService } from '../../services/dashboardService';

// ═══════════════════════════════════════════
//  ASYNC THUNKS
// ═══════════════════════════════════════════

export const fetchAllUsers = createAsyncThunk(
    'admin/fetchAllUsers',
    async (params = {}, { rejectWithValue }) => {
        try {
            const res = await adminService.getAllUsers(params);
            return res.data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || 'Failed to fetch users');
        }
    }
);

export const updateUserRole = createAsyncThunk(
    'admin/updateUserRole',
    async ({ id, role }, { rejectWithValue }) => {
        try {
            const res = await adminService.updateRole(id, { role });
            return res.data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || 'Failed to update role');
        }
    }
);

export const banUser = createAsyncThunk(
    'admin/banUser',
    async (id, { rejectWithValue }) => {
        try {
            const res = await adminService.banUser(id);
            return res.data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || 'Failed to ban user');
        }
    }
);

export const unbanUser = createAsyncThunk(
    'admin/unbanUser',
    async (id, { rejectWithValue }) => {
        try {
            const res = await adminService.unbanUser(id);
            return res.data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || 'Failed to unban user');
        }
    }
);

export const fetchAdminAnalytics = createAsyncThunk(
    'admin/fetchAnalytics',
    async (_, { rejectWithValue }) => {
        try {
            const [catDist, diffStats, topLangs, topPatterns] = await Promise.all([
                analyticsService.getCategoryDistribution(),
                analyticsService.getDifficultyStats(),
                analyticsService.getTopLanguages(),
                analyticsService.getTopPatterns(),
            ]);
            return {
                categoryDistribution: catDist.data?.data || catDist.data || [],
                difficultyStats: diffStats.data?.data || diffStats.data || [],
                topLanguages: topLangs.data?.data || topLangs.data || [],
                topPatterns: topPatterns.data?.data || topPatterns.data || [],
            };
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || 'Failed to fetch analytics');
        }
    }
);

// ═══════════════════════════════════════════
//  SLICE
// ═══════════════════════════════════════════

const adminSlice = createSlice({
    name: 'admin',
    initialState: {
        users: [],
        userLoading: false,
        userError: null,
        analytics: {
            categoryDistribution: [],
            difficultyStats: [],
            topLanguages: [],
            topPatterns: [],
        },
        analyticsLoading: false,
    },
    reducers: {
        clearAdminError: (state) => { state.userError = null; },
    },
    extraReducers: (builder) => {
        builder
            // Users
            .addCase(fetchAllUsers.pending, (state) => { state.userLoading = true; state.userError = null; })
            .addCase(fetchAllUsers.fulfilled, (state, action) => {
                state.userLoading = false;
                state.users = action.payload.data || action.payload.users || action.payload || [];
            })
            .addCase(fetchAllUsers.rejected, (state, action) => { state.userLoading = false; state.userError = action.payload; })

            // Update Role
            .addCase(updateUserRole.fulfilled, (state, action) => {
                const updated = action.payload.data || action.payload;
                const idx = state.users.findIndex(u => u._id === updated._id);
                if (idx !== -1) state.users[idx] = updated;
            })

            // Ban
            .addCase(banUser.fulfilled, (state, action) => {
                const updated = action.payload.data || action.payload;
                const idx = state.users.findIndex(u => u._id === updated._id);
                if (idx !== -1) state.users[idx] = updated;
            })

            // Unban
            .addCase(unbanUser.fulfilled, (state, action) => {
                const updated = action.payload.data || action.payload;
                const idx = state.users.findIndex(u => u._id === updated._id);
                if (idx !== -1) state.users[idx] = updated;
            })

            // Analytics
            .addCase(fetchAdminAnalytics.pending, (state) => { state.analyticsLoading = true; })
            .addCase(fetchAdminAnalytics.fulfilled, (state, action) => {
                state.analyticsLoading = false;
                state.analytics = action.payload;
            })
            .addCase(fetchAdminAnalytics.rejected, (state) => { state.analyticsLoading = false; });
    },
});

export const { clearAdminError } = adminSlice.actions;
export default adminSlice.reducer;
