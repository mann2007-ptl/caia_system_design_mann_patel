import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { conceptService, bookmarkService, noteService, voteService, taxonomyService, analyticsService } from '../../services/dashboardService';

// ═══════════════════════════════════════════
//  ASYNC THUNKS
// ═══════════════════════════════════════════

export const fetchConcepts = createAsyncThunk(
    'concepts/fetchAll',
    async (params = {}, { rejectWithValue }) => {
        try {
            const res = await conceptService.getAll(params);
            return res.data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || 'Failed to fetch concepts');
        }
    }
);

export const fetchConceptById = createAsyncThunk(
    'concepts/fetchById',
    async (id, { rejectWithValue }) => {
        try {
            const res = await conceptService.getById(id);
            return res.data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || 'Failed to fetch concept');
        }
    }
);

export const fetchRandomConcept = createAsyncThunk(
    'concepts/fetchRandom',
    async (_, { rejectWithValue }) => {
        try {
            const res = await conceptService.getRandom();
            return res.data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || 'Failed to fetch random concept');
        }
    }
);

export const createConcept = createAsyncThunk(
    'concepts/create',
    async (data, { rejectWithValue }) => {
        try {
            const res = await conceptService.create(data);
            return res.data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || 'Failed to create concept');
        }
    }
);

export const updateConcept = createAsyncThunk(
    'concepts/update',
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
    'concepts/delete',
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
    'concepts/archive',
    async (id, { rejectWithValue }) => {
        try {
            const res = await conceptService.archive(id);
            return res.data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || 'Failed to archive concept');
        }
    }
);

export const restoreConcept = createAsyncThunk(
    'concepts/restore',
    async (id, { rejectWithValue }) => {
        try {
            const res = await conceptService.restore(id);
            return res.data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || 'Failed to restore concept');
        }
    }
);

// ─── Bookmarks ───
export const fetchBookmarks = createAsyncThunk(
    'concepts/fetchBookmarks',
    async (_, { getState, rejectWithValue }) => {
        try {
            const user = getState().auth.user;
            if (!user) return [];
            return JSON.parse(localStorage.getItem(`bookmarks_${user._id}`) || '[]');
        } catch (err) {
            return rejectWithValue('Failed to fetch bookmarks');
        }
    }
);

export const addBookmark = createAsyncThunk(
    'concepts/addBookmark',
    async (conceptId, { getState, rejectWithValue }) => {
        try {
            const state = getState();
            const user = state.auth.user;
            if (!user) return rejectWithValue('Not authenticated');

            let concept = state.concepts.items.find(c => c._id === conceptId) ||
                (state.concepts.selectedConcept?._id === conceptId ? state.concepts.selectedConcept : null);

            if (!concept) {
                const res = await conceptService.getById(conceptId);
                concept = res.data?.data || res.data;
            }

            const localBookmarks = JSON.parse(localStorage.getItem(`bookmarks_${user._id}`) || '[]');
            if (concept && !localBookmarks.find(b => b._id === conceptId)) {
                localBookmarks.push(concept);
                localStorage.setItem(`bookmarks_${user._id}`, JSON.stringify(localBookmarks));
            }
            return concept;
        } catch (err) {
            return rejectWithValue('Failed to bookmark');
        }
    }
);

export const removeBookmark = createAsyncThunk(
    'concepts/removeBookmark',
    async (conceptId, { getState, rejectWithValue }) => {
        try {
            const user = getState().auth.user;
            if (!user) return rejectWithValue('Not authenticated');

            let localBookmarks = JSON.parse(localStorage.getItem(`bookmarks_${user._id}`) || '[]');
            localBookmarks = localBookmarks.filter(b => b._id !== conceptId);
            localStorage.setItem(`bookmarks_${user._id}`, JSON.stringify(localBookmarks));

            return conceptId;
        } catch (err) {
            return rejectWithValue('Failed to remove bookmark');
        }
    }
);

// ─── Notes ───
export const fetchNotes = createAsyncThunk(
    'concepts/fetchNotes',
    async (conceptId, { rejectWithValue }) => {
        try {
            const res = await noteService.getByConceptId(conceptId);
            return res.data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || 'Failed to fetch notes');
        }
    }
);

export const addNote = createAsyncThunk(
    'concepts/addNote',
    async ({ conceptId, data }, { rejectWithValue }) => {
        try {
            const res = await noteService.add(conceptId, data);
            return res.data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || 'Failed to add note');
        }
    }
);

export const updateNote = createAsyncThunk(
    'concepts/updateNote',
    async ({ noteId, data }, { rejectWithValue }) => {
        try {
            const res = await noteService.update(noteId, data);
            return res.data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || 'Failed to update note');
        }
    }
);

export const deleteNote = createAsyncThunk(
    'concepts/deleteNote',
    async (noteId, { rejectWithValue }) => {
        try {
            await noteService.delete(noteId);
            return noteId;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || 'Failed to delete note');
        }
    }
);

// ─── Votes ───
export const voteOnConcept = createAsyncThunk(
    'concepts/vote',
    async ({ conceptId, voteType }, { rejectWithValue }) => {
        try {
            const res = await voteService.vote(conceptId, { voteType });
            return res.data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || 'Failed to vote');
        }
    }
);

// ─── Taxonomy ───
export const fetchTaxonomy = createAsyncThunk(
    'concepts/fetchTaxonomy',
    async (_, { rejectWithValue }) => {
        try {
            const [categories, languages, difficulties, questionTypes] = await Promise.all([
                taxonomyService.getCategories(),
                taxonomyService.getLanguages(),
                taxonomyService.getDifficulties(),
                taxonomyService.getQuestionTypes(),
            ]);

            const formatTaxonomy = (data) => {
                const arr = data?.data || data || [];
                const strings = arr.map(i => typeof i === 'string' ? i : i.name || i._id).filter(Boolean);
                // Deduplicate ignoring case, preferring the lengthiest/most-capitalized version
                const uniqueMap = new Map();
                strings.forEach(s => {
                    const lower = s.toLowerCase();
                    if (!uniqueMap.has(lower) || s.length > uniqueMap.get(lower).length || s > uniqueMap.get(lower)) {
                        uniqueMap.set(lower, s);
                    }
                });
                return Array.from(uniqueMap.values());
            };

            return {
                categories: formatTaxonomy(categories.data),
                languages: formatTaxonomy(languages.data),
                difficulties: formatTaxonomy(difficulties.data),
                questionTypes: formatTaxonomy(questionTypes.data),
            };
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || 'Failed to fetch taxonomy');
        }
    }
);

// ─── Dashboard Stats ───
export const fetchDashboardStats = createAsyncThunk(
    'concepts/fetchDashboardStats',
    async (_, { getState, rejectWithValue }) => {
        try {
            const user = getState().auth.user;
            const [total] = await Promise.all([
                analyticsService.getTotalConcepts(),
            ]);
            let bookmarks = [];
            if (user) {
                bookmarks = JSON.parse(localStorage.getItem(`bookmarks_${user._id}`) || '[]');
            }
            return {
                totalConcepts: total.data?.data?.totalConcepts || total.data?.total || 0,
                bookmarks: bookmarks,
            };
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || 'Failed to fetch stats');
        }
    }
);

// ═══════════════════════════════════════════
//  SLICE
// ═══════════════════════════════════════════

const conceptSlice = createSlice({
    name: 'concepts',
    initialState: {
        // Concepts
        items: [],
        selectedConcept: null,
        loading: false,
        error: null,
        pagination: { page: 1, limit: 12, total: 0, totalPages: 0 },

        // Bookmarks
        bookmarks: [],
        bookmarkLoading: false,

        // Notes
        notes: [],
        noteLoading: false,

        // Taxonomy (filter options)
        taxonomy: { categories: [], languages: [], difficulties: [], questionTypes: [] },

        // Dashboard
        dashboardStats: { totalConcepts: 0, totalBookmarks: 0, totalArchived: 0, totalNotes: 0 },
        statsLoading: false,
    },
    reducers: {
        clearSelectedConcept: (state) => {
            state.selectedConcept = null;
        },
        clearError: (state) => {
            state.error = null;
        },
        setPage: (state, action) => {
            state.pagination.page = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch Concepts
            .addCase(fetchConcepts.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(fetchConcepts.fulfilled, (state, action) => {
                state.loading = false;
                const d = action.payload;
                const rawItems = d.data || d.concepts || d || [];
                const uniqueMap = new Map();
                rawItems.forEach(item => {
                    const key = item.metadata?.concept || item.prompt;
                    if (key && !uniqueMap.has(key)) {
                        uniqueMap.set(key, item);
                    }
                });
                state.items = Array.from(uniqueMap.values());
                // Backend returns: { total, page, totalPages, count, data }
                if (d.total !== undefined) state.pagination.total = d.total;
                if (d.totalPages !== undefined) state.pagination.totalPages = d.totalPages;
                if (d.page !== undefined) state.pagination.page = d.page;
                if (d.pagination) {
                    state.pagination = { ...state.pagination, ...d.pagination };
                }
            })
            .addCase(fetchConcepts.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

            // Fetch by ID
            .addCase(fetchConceptById.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(fetchConceptById.fulfilled, (state, action) => {
                state.loading = false;
                state.selectedConcept = action.payload.data || action.payload;
            })
            .addCase(fetchConceptById.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

            // Random
            .addCase(fetchRandomConcept.fulfilled, (state, action) => {
                state.selectedConcept = action.payload.data || action.payload;
            })

            // Create
            .addCase(createConcept.fulfilled, (state, action) => {
                const newConcept = action.payload.data || action.payload;
                state.items.unshift(newConcept);
            })

            // Update
            .addCase(updateConcept.fulfilled, (state, action) => {
                const updated = action.payload.data || action.payload;
                const idx = state.items.findIndex(c => c._id === updated._id);
                if (idx !== -1) state.items[idx] = updated;
                if (state.selectedConcept?._id === updated._id) state.selectedConcept = updated;
            })

            // Delete
            .addCase(deleteConcept.fulfilled, (state, action) => {
                state.items = state.items.filter(c => c._id !== action.payload);
            })

            // Archive
            .addCase(archiveConcept.fulfilled, (state, action) => {
                const archived = action.payload.data || action.payload;
                const idx = state.items.findIndex(c => c._id === archived._id);
                if (idx !== -1) state.items[idx] = archived;
            })

            // Restore
            .addCase(restoreConcept.fulfilled, (state, action) => {
                const restored = action.payload.data || action.payload;
                const idx = state.items.findIndex(c => c._id === restored._id);
                if (idx !== -1) state.items[idx] = restored;
            })

            // Bookmarks
            .addCase(fetchBookmarks.pending, (state) => { state.bookmarkLoading = true; })
            .addCase(fetchBookmarks.fulfilled, (state, action) => {
                state.bookmarkLoading = false;
                state.bookmarks = action.payload.data || action.payload || [];
            })
            .addCase(fetchBookmarks.rejected, (state) => { state.bookmarkLoading = false; })
            .addCase(addBookmark.fulfilled, (state, action) => {
                const bm = action.payload.data || action.payload;
                if (bm) state.bookmarks.push(bm);
            })
            .addCase(removeBookmark.fulfilled, (state, action) => {
                state.bookmarks = state.bookmarks.filter(b => (b.conceptId || b._id) !== action.payload);
            })

            // Notes
            .addCase(fetchNotes.pending, (state) => { state.noteLoading = true; })
            .addCase(fetchNotes.fulfilled, (state, action) => {
                state.noteLoading = false;
                state.notes = action.payload.data || action.payload || [];
            })
            .addCase(fetchNotes.rejected, (state) => { state.noteLoading = false; })
            .addCase(addNote.fulfilled, (state, action) => {
                const note = action.payload.data || action.payload;
                if (note) state.notes.push(note);
            })
            .addCase(updateNote.fulfilled, (state, action) => {
                const updated = action.payload.data || action.payload;
                const idx = state.notes.findIndex(n => n._id === updated._id);
                if (idx !== -1) state.notes[idx] = updated;
            })
            .addCase(deleteNote.fulfilled, (state, action) => {
                state.notes = state.notes.filter(n => n._id !== action.payload);
            })

            // Votes
            .addCase(voteOnConcept.fulfilled, (state, action) => {
                const updated = action.payload.data || action.payload;
                if (updated?._id) {
                    const idx = state.items.findIndex(c => c._id === updated._id);
                    if (idx !== -1) state.items[idx] = updated;
                    if (state.selectedConcept?._id === updated._id) state.selectedConcept = updated;
                }
            })

            // Taxonomy
            .addCase(fetchTaxonomy.fulfilled, (state, action) => {
                state.taxonomy = action.payload;
            })

            // Dashboard Stats
            .addCase(fetchDashboardStats.pending, (state) => { state.statsLoading = true; })
            .addCase(fetchDashboardStats.fulfilled, (state, action) => {
                state.statsLoading = false;
                state.dashboardStats.totalConcepts = action.payload.totalConcepts;
                state.dashboardStats.totalBookmarks = action.payload.bookmarks?.length || 0;
            })
            .addCase(fetchDashboardStats.rejected, (state) => { state.statsLoading = false; });
    },
});

export const { clearSelectedConcept, clearError, setPage } = conceptSlice.actions;
export default conceptSlice.reducer;
