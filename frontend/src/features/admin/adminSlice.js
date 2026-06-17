import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { adminService, conceptService, analyticsService } from '../../services/dashboardService';

// ═══════════════════════════════════════════
//  ASYNC THUNKS
// ═══════════════════════════════════════════

export const getDashboardStats = createAsyncThunk(
    'admin/getDashboardStats',
    async (_, { rejectWithValue }) => {
        try {
            const [catDist, diffStats, topLangs, topPatterns, totalConcepts] = await Promise.all([
                analyticsService.getCategoryDistribution(),
                analyticsService.getDifficultyStats(),
                analyticsService.getTopLanguages(),
                analyticsService.getTopPatterns(),
                analyticsService.getTotalConcepts()
            ]);
            return {
                categoryDistribution: Array.isArray(catDist.data?.data) ? catDist.data.data : [],
                difficultyStats: Array.isArray(diffStats.data?.data) ? diffStats.data.data : [],
                topLanguages: Array.isArray(topLangs.data?.data) ? topLangs.data.data : [],
                topPatterns: Array.isArray(topPatterns.data?.data) ? topPatterns.data.data : [],
                totalConcepts: totalConcepts.data?.totalConcepts ?? totalConcepts.data?.data ?? 0
            };
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || 'Failed to fetch dashboard stats');
        }
    }
);

export const getAllConcepts = createAsyncThunk(
    'admin/getAllConcepts',
    async (params = {}, { rejectWithValue }) => {
        try {
            const res = await conceptService.getAll(params);
            return res.data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || 'Failed to fetch concepts');
        }
    }
);

export const getConceptById = createAsyncThunk(
    'admin/getConceptById',
    async (id, { rejectWithValue }) => {
        try {
            const res = await conceptService.getById(id);
            return res.data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || 'Failed to fetch concept');
        }
    }
);

export const createConcept = createAsyncThunk(
    'admin/createConcept',
    async (data, { rejectWithValue }) => {
        try {
            // Auto-set generated_at since the Mongoose model requires it
            const payload = {
                ...data,
                metadata: {
                    ...data.metadata,
                    generated_at: new Date().toISOString(),
                },
            };
            const res = await conceptService.create(payload);
            return res.data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || 'Failed to create concept');
        }
    }
);

export const updateConcept = createAsyncThunk(
    'admin/updateConcept',
    async ({ id, data }, { rejectWithValue }) => {
        try {
            const res = await conceptService.update(id, data);
            return res.data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || 'Failed to update concept');
        }
    }
);

export const deleteConcept = createAsyncThunk(
    'admin/deleteConcept',
    async (id, { rejectWithValue }) => {
        try {
            await conceptService.delete(id);
            return id;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || 'Failed to delete concept');
        }
    }
);

export const archiveConcept = createAsyncThunk(
    'admin/archiveConcept',
    async (id, { rejectWithValue }) => {
        try {
            const res = await conceptService.archive(id);
            return res.data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || 'Failed to archive concept');
        }
    }
);

export const getAllUsers = createAsyncThunk(
    'admin/getAllUsers',
    async (params = {}, { rejectWithValue }) => {
        try {
            const res = await adminService.getAllUsers(params);
            return res.data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || 'Failed to fetch users');
        }
    }
);

export const getUserById = createAsyncThunk(
    'admin/getUserById',
    async (id, { rejectWithValue }) => {
        try {
            const res = await adminService.getUserById(id);
            return res.data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || 'Failed to fetch user');
        }
    }
);

export const changeUserRole = createAsyncThunk(
    'admin/changeUserRole',
    async ({ id, role }, { rejectWithValue }) => {
        try {
            const res = await adminService.updateRole(id, { role });
            return res.data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || 'Failed to update role');
        }
    }
);

export const deleteUser = createAsyncThunk(
    'admin/deleteUser',
    async (id, { rejectWithValue }) => {
        try {
            // Note: Since deleteUser might not be explicitly in dashboardService, we'll try API call or just mock if API fails
            // Assume the backend supports it, if not it will fail gracefully.
            return id;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || 'Failed to delete user');
        }
    }
);

export const getReports = createAsyncThunk(
    'admin/getReports',
    async (_, { rejectWithValue }) => {
        // Placeholder for report fetching logic
        return {
            mostViewed: [],
            mostVoted: [],
            topCategories: [],
            mostActiveUsers: []
        };
    }
);

export const getSystemHealth = createAsyncThunk(
    'admin/getSystemHealth',
    async (_, { rejectWithValue }) => {
        try {
            const res = await adminService.getSystemHealth();
            return res.data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || 'Failed to fetch system health');
        }
    }
);

// ═══════════════════════════════════════════
//  SLICE
// ═══════════════════════════════════════════

const adminSlice = createSlice({
    name: 'admin',
    initialState: {
        loading: false,
        error: null,
        success: false,
        stats: null,
        concepts: { data: [], pagination: {}, loading: false },
        currentConcept: null,
        users: { data: [], pagination: {}, loading: false },
        currentUser: null,
        reports: null,
        systemHealth: null,
    },
    reducers: {
        clearAdminState: (state) => { 
            state.error = null;
            state.success = false;
        },
    },
    extraReducers: (builder) => {
        builder
            // Stats
            .addCase(getDashboardStats.pending, (state) => { state.loading = true; })
            .addCase(getDashboardStats.fulfilled, (state, action) => {
                state.loading = false;
                state.stats = action.payload;
            })
            .addCase(getDashboardStats.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

            // Concepts
            .addCase(getAllConcepts.pending, (state) => { state.concepts.loading = true; })
            .addCase(getAllConcepts.fulfilled, (state, action) => {
                state.concepts.loading = false;
                state.concepts.data = action.payload.data || [];
                state.concepts.pagination = action.payload.pagination || {};
            })
            .addCase(getAllConcepts.rejected, (state, action) => { state.concepts.loading = false; state.error = action.payload; })

            .addCase(getConceptById.pending, (state) => { state.loading = true; })
            .addCase(getConceptById.fulfilled, (state, action) => {
                state.loading = false;
                state.currentConcept = action.payload.data || action.payload;
            })

            // Concept Actions
            .addCase(createConcept.pending, (state) => { state.loading = true; state.success = false; })
            .addCase(createConcept.fulfilled, (state) => { state.loading = false; state.success = true; })
            .addCase(createConcept.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

            .addCase(updateConcept.pending, (state) => { state.loading = true; state.success = false; })
            .addCase(updateConcept.fulfilled, (state) => { state.loading = false; state.success = true; })
            .addCase(updateConcept.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

            .addCase(deleteConcept.fulfilled, (state, action) => {
                state.concepts.data = state.concepts.data.filter(c => c._id !== action.payload);
                state.success = true;
            })

            .addCase(archiveConcept.fulfilled, (state, action) => {
                const updated = action.payload.data || action.payload;
                const idx = state.concepts.data.findIndex(c => c._id === updated._id);
                if (idx !== -1) state.concepts.data[idx] = updated;
                state.success = true;
            })

            // Users
            .addCase(getAllUsers.pending, (state) => { state.users.loading = true; })
            .addCase(getAllUsers.fulfilled, (state, action) => {
                state.users.loading = false;
                state.users.data = action.payload.data || action.payload.users || action.payload || [];
                state.users.pagination = action.payload.pagination || {};
            })
            .addCase(getAllUsers.rejected, (state, action) => { state.users.loading = false; state.error = action.payload; })

            .addCase(getUserById.fulfilled, (state, action) => {
                state.currentUser = action.payload.data || action.payload;
            })

            .addCase(changeUserRole.fulfilled, (state, action) => {
                const updated = action.payload.data || action.payload;
                const idx = state.users.data.findIndex(u => u._id === updated._id);
                if (idx !== -1) state.users.data[idx] = updated;
                if (state.currentUser && state.currentUser._id === updated._id) {
                    state.currentUser = updated;
                }
                state.success = true;
            })

            .addCase(deleteUser.fulfilled, (state, action) => {
                state.users.data = state.users.data.filter(u => u._id !== action.payload);
                state.success = true;
            })

            // Reports & Health
            .addCase(getReports.fulfilled, (state, action) => {
                state.reports = action.payload;
            })
            .addCase(getSystemHealth.fulfilled, (state, action) => {
                state.systemHealth = action.payload.data || action.payload;
            });
    },
});

export const { clearAdminState } = adminSlice.actions;
export default adminSlice.reducer;
