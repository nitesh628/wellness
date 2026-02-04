# Notes API Integration - Architecture Overview

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    FRONTEND (Next.js + React)               │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌─────────────────────────────────────────────────────┐    │
│  │           Notes Page Component                      │    │
│  │  (app/(dashboard)/doctors/notes/page.tsx)         │    │
│  │                                                     │    │
│  │  • Create modal with LexicalEditor               │    │
│  │  • List view (Table & Grid)                      │    │
│  │  • Search, Filter, Sort                          │    │
│  │  • Favorites, Delete, Export                     │    │
│  │  • Statistics display                            │    │
│  └─────────────────────────────────────────────────────┘    │
│                          ↓                                    │
│  ┌─────────────────────────────────────────────────────┐    │
│  │          Redux State Management                     │    │
│  │  (lib/redux/features/notesSlice.ts)               │    │
│  │                                                     │    │
│  │  • Async Thunks (all CRUD operations)             │    │
│  │  • State Reducers                                 │    │
│  │  • Selectors                                      │    │
│  │  • Auth Config & Error Handling                   │    │
│  └─────────────────────────────────────────────────────┘    │
│                          ↓ (Axios)                            │
└─────────────────────────────────────────────────────────────┘
                          ║
        ┌─────────────────╨──────────────────┐
        │   HTTP/REST with JWT Auth Token    │
        │   Authorization: Bearer {token}    │
        └─────────────────┬──────────────────┘
                          ║
┌─────────────────────────┴──────────────────────────────────┐
│              BACKEND (Express.js + MongoDB)                │
├────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌────────────────────────────────────────────────────┐    │
│  │           Routes (notesRoute.js)                   │    │
│  │                                                    │    │
│  │  POST   /notes ..................... createNote   │    │
│  │  GET    /notes/stats ............... getNoteStats │    │
│  │  GET    /notes/export ............. exportNotes   │    │
│  │  GET    /notes .................... listNotes    │    │
│  │  GET    /notes/:id ................ getNoteById   │    │
│  │  PUT    /notes/:id ................ updateNote   │    │
│  │  DELETE /notes/:id ................ deleteNote   │    │
│  │  PATCH  /notes/:id/favorite ....... toggleFav     │    │
│  └────────────────────────────────────────────────────┘    │
│                          ↓                                   │
│  ┌────────────────────────────────────────────────────┐    │
│  │        Controllers (notesController.js)            │    │
│  │                                                    │    │
│  │  • Request validation                            │    │
│  │  • MongoDB operations                            │    │
│  │  • Response formatting                           │    │
│  │  • Error handling                                │    │
│  └────────────────────────────────────────────────────┘    │
│                          ↓                                   │
│  ┌────────────────────────────────────────────────────┐    │
│  │          Model (notesModel.js)                     │    │
│  │                                                    │    │
│  │  • Schema definition                             │    │
│  │  • Validation rules                              │    │
│  │  • Indexes for performance                       │    │
│  │  • Timestamps (createdAt, updatedAt)            │    │
│  └────────────────────────────────────────────────────┘    │
│                          ↓                                   │
│  ┌────────────────────────────────────────────────────┐    │
│  │         Database (MongoDB)                         │    │
│  │                                                    │    │
│  │  • notes collection                              │    │
│  │  • User authentication check                     │    │
│  │  • Data persistence                              │    │
│  └────────────────────────────────────────────────────┘    │
│                                                              │
└────────────────────────────────────────────────────────────┘
```

---

## Data Flow: Create Note

```
┌──────────────────────────────────────────────────────────────────┐
│ 1. USER CREATES NOTE IN FRONTEND                                 │
└──────────────────────────────────────────────────────────────────┘
         ↓
    ┌─────────────────────────────────────────┐
    │ handleAddNote()                         │
    │ • Extracts form data                    │
    │ • Gets editor content                   │
    │ • Builds payload                        │
    └─────────────────────────────────────────┘
         ↓
    ┌─────────────────────────────────────────┐
    │ dispatch(createNote(payload))           │
    │ • Redux action triggered                │
    │ • Sets loading: true                    │
    └─────────────────────────────────────────┘
         ↓
    ┌─────────────────────────────────────────┐
    │ axios.post(                             │
    │   '/notes',                             │
    │   payload,                              │
    │   { Authorization: Bearer {token} }     │
    │ )                                       │
    └─────────────────────────────────────────┘
         ↓
    ┌─────────────────────────────────────────┐
    │ BACKEND RECEIVES REQUEST                │
    │ POST /notes                             │
    └─────────────────────────────────────────┘
         ↓
    ┌─────────────────────────────────────────┐
    │ isLogin middleware                      │
    │ • Verifies JWT token                    │
    │ • Sets req.user                         │
    └─────────────────────────────────────────┘
         ↓
    ┌─────────────────────────────────────────┐
    │ createNote controller                   │
    │ • Extracts author from req.user         │
    │ • Validates input data                  │
    │ • Creates Note document                 │
    │ • Populates author info                 │
    │ • Sends response                        │
    └─────────────────────────────────────────┘
         ↓
    ┌─────────────────────────────────────────┐
    │ SUCCESS RESPONSE (201)                  │
    │ {                                       │
    │   success: true,                        │
    │   data: { ...note object... }           │
    │ }                                       │
    └─────────────────────────────────────────┘
         ↓
    ┌─────────────────────────────────────────┐
    │ FRONTEND HANDLES SUCCESS                │
    │ • Closes modal                          │
    │ • Clears editor: setEditorContent("")   │
    │ • Fetches updated list                  │
    │ • Updates stats                         │
    │ • Shows success feedback                │
    └─────────────────────────────────────────┘
```

---

## Data Flow: List Notes

```
┌──────────────────────────────────────────────────────────┐
│ 1. PAGE LOADS / USER CHANGES FILTER                      │
└──────────────────────────────────────────────────────────┘
         ↓
    ┌──────────────────────────────────────┐
    │ useEffect(() => {                    │
    │   dispatch(fetchNotes())             │
    │   dispatch(fetchNoteStats())         │
    │ }, [dispatch])                       │
    └──────────────────────────────────────┘
         ↓
    ┌──────────────────────────────────────┐
    │ fetchNotes async thunk                │
    │ • Gets filters & pagination from     │
    │   Redux state                        │
    │ • Builds query params                │
    │ • setNoteLoading()                   │
    └──────────────────────────────────────┘
         ↓
    ┌──────────────────────────────────────┐
    │ axios.get(                           │
    │   '/notes?page=1&limit=10...',       │
    │   { Authorization: Bearer... }       │
    │ )                                    │
    └──────────────────────────────────────┘
         ↓
    ┌──────────────────────────────────────┐
    │ BACKEND: listNotes controller        │
    │ • Checks auth token                  │
    │ • Builds filter from query params    │
    │ • Queries MongoDB                    │
    │ • Sorts & paginates results         │
    │ • Returns with author populated      │
    └──────────────────────────────────────┘
         ↓
    ┌──────────────────────────────────────┐
    │ SUCCESS RESPONSE (200)               │
    │ {                                    │
    │   success: true,                     │
    │   data: [ ...notes... ],             │
    │   pagination: {                      │
    │     page: 1,                         │
    │     limit: 10,                       │
    │     total: 42,                       │
    │     pages: 5                         │
    │   }                                  │
    │ }                                    │
    └──────────────────────────────────────┘
         ↓
    ┌──────────────────────────────────────┐
    │ FRONTEND: Response handling          │
    │ • Maps API notes to frontend format  │
    │ • setNoteData(mapped notes)          │
    │ • Updates Redux state                │
    │ • Component re-renders               │
    │ • Table/Grid displays notes          │
    └──────────────────────────────────────┘
```

---

## Component Hierarchy

```
NotesPage (page.tsx)
├── Header
│   ├── Title
│   └── Action Buttons
│       ├── Export
│       └── New Note
│
├── Statistics Cards
│   ├── Total Notes
│   ├── Active Notes
│   ├── Published Notes
│   └── Favorites
│
├── Filters & Search
│   ├── Search Input
│   ├── Status Filter
│   ├── Category Filter
│   ├── Priority Filter
│   └── View Toggle (Table/Grid)
│
├── Content Area
│   ├── Table View
│   │   └── Note Rows
│   │       ├── Title
│   │       ├── Patient
│   │       ├── Date
│   │       ├── Diagnosis
│   │       ├── Status Badge
│   │       └── Actions (View, Delete)
│   │
│   └── Grid View
│       └── Note Cards
│           ├── Title
│           ├── Category Badge
│           ├── Priority
│           ├── Status
│           └── Actions (Edit, Delete, Favorite)
│
├── Pagination
│
├── Add Modal
│   └── Form
│       ├── LexicalEditor
│       ├── Title Input
│       ├── Category Select
│       ├── Priority Select
│       ├── Status Select
│       ├── Tags Input
│       ├── Private Toggle
│       └── Submit Button
│
└── Edit Modal
    └── Form (same as Add)
```

---

## State Management Flow

```
Redux Store: notesSlice
│
├── state.data: Note[]
│   └── Contains all fetched notes
│
├── state.isLoading: boolean
│   └── true during API calls, false when complete
│
├── state.error: string | null
│   └── Error message from API or null
│
├── state.stats: NoteStats
│   ├── totalNotes
│   ├── publishedNotes
│   ├── draftNotes
│   └── favoriteNotes
│
├── state.filters: Filters
│   ├── category
│   ├── status
│   ├── priority
│   └── search
│
└── state.pagination: Pagination
    ├── page
    ├── limit
    └── total
```

---

## API Error Handling

```
┌──────────────────────────────────────┐
│ API Call with error                  │
└──────────────────────────────────────┘
         ↓
    ┌──────────────────────────────────┐
    │ catch (error)                    │
    │ • Check if Axios error          │
    │ • Extract error message         │
    │ • Call handleApiError()         │
    └──────────────────────────────────┘
         ↓
    ┌──────────────────────────────────┐
    │ dispatch(setNoteError(message))  │
    └──────────────────────────────────┘
         ↓
    ┌──────────────────────────────────┐
    │ return false                     │
    │ (Indicates failed operation)     │
    └──────────────────────────────────┘
         ↓
    ┌──────────────────────────────────┐
    │ Frontend component               │
    │ • Checks returned success        │
    │ • Shows error message to user    │
    │ • Keeps modal open               │
    │ • Allows user to retry           │
    └──────────────────────────────────┘
```

---

## Authentication Flow

```
┌──────────────────────────────────────────┐
│ User logs in (via Auth page)             │
└──────────────────────────────────────────┘
         ↓
    ┌──────────────────────────────────┐
    │ Token received from backend      │
    │ • Stored in localStorage         │
    │ • Key: "authToken"               │
    └──────────────────────────────────┘
         ↓
    ┌──────────────────────────────────┐
    │ When fetching notes:             │
    │ getAuthConfig() called           │
    │ • Reads token from localStorage  │
    │ • Creates Authorization header   │
    │ • Format: "Bearer {token}"       │
    └──────────────────────────────────┘
         ↓
    ┌──────────────────────────────────┐
    │ API request sent with token      │
    │ axios.get('/notes', {            │
    │   headers: {                     │
    │     Authorization: 'Bearer...'   │
    │   }                              │
    │ })                               │
    └──────────────────────────────────┘
         ↓
    ┌──────────────────────────────────┐
    │ Backend isLogin middleware       │
    │ • Verifies JWT signature         │
    │ • Decodes user info              │
    │ • Sets req.user                  │
    │ • Allows request to proceed      │
    └──────────────────────────────────┘
```

---

## Performance Considerations

```
Frontend Optimizations:
├── Client-side filtering (no extra API calls)
├── Pagination (10 notes per page)
├── Memoized selectors (useMemoizedSelector)
├── Lazy loading in grid view
├── Debounced search (optional)
└── Efficient re-renders with Redux

Backend Optimizations:
├── Database indexes
│   ├── { author: 1, category: 1, status: 1 }
│   └── Text indexes for search
├── Lean queries where possible
├── Selective field population
├── Efficient pagination
└── Proper error handling to avoid timeouts
```

---

## Feature Summary

| Feature          | Status | Complexity | User Impact  |
| ---------------- | ------ | ---------- | ------------ |
| Create Note      | ✅     | Medium     | Core feature |
| Read Notes       | ✅     | Low        | Core feature |
| Update Note      | ✅     | Medium     | Core feature |
| Delete Note      | ✅     | Low        | Core feature |
| Search           | ✅     | Low        | Convenience  |
| Filter           | ✅     | Low        | Convenience  |
| Sort             | ✅     | Low        | Convenience  |
| Pagination       | ✅     | Low        | Performance  |
| Rich Text Editor | ✅     | High       | Usability    |
| Statistics       | ✅     | Low        | Insight      |
| Export CSV       | ✅     | Medium     | Data access  |
| Favorites        | ✅     | Low        | Organization |
| Multiple Views   | ✅     | Medium     | Preference   |

---

## Testing Strategy

```
Unit Tests:
├── Redux selectors
├── Utility functions
└── Component logic

Integration Tests:
├── Form submission
├── API calls
└── State updates

E2E Tests:
├── Complete CRUD flow
├── Search and filter
├── Export functionality
└── Error scenarios
```

---

**Integration Architecture Complete** ✅
**Last Updated**: February 4, 2026
