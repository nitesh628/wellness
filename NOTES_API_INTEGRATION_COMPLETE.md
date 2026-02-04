# Notes API Integration - Complete Documentation

## Overview

The Notes feature has been fully integrated between the frontend and backend. All API endpoints are properly connected with Redux state management, authentication, and error handling.

---

## Backend API Endpoints

### Base URL

```
http://localhost:5000
```

### Authentication

All endpoints require:

- JWT Token in Authorization header: `Authorization: Bearer {token}`
- Middleware: `isLogin` (required on all routes)

### Routes (in correct order to avoid conflicts)

#### 1. Create Note

- **Endpoint**: `POST /notes`
- **Authentication**: Required
- **Request Body**:

```json
{
  "title": "My Note",
  "content": "Note content here",
  "category": "Work",
  "priority": "medium",
  "status": "draft",
  "tags": ["tag1", "tag2"],
  "isPrivate": true
}
```

- **Response**:

```json
{
  "success": true,
  "data": {
    "_id": "note_id",
    "title": "My Note",
    "content": "Note content here",
    "category": "Work",
    "priority": "medium",
    "status": "draft",
    "tags": ["tag1", "tag2"],
    "isPrivate": true,
    "isFavorite": false,
    "author": {
      "_id": "user_id",
      "firstName": "John",
      "lastName": "Doe"
    },
    "createdAt": "2026-02-04T...",
    "updatedAt": "2026-02-04T..."
  }
}
```

#### 2. Get Notes (with filtering, sorting, pagination)

- **Endpoint**: `GET /notes`
- **Authentication**: Required
- **Query Parameters**:
  - `page` (default: 1)
  - `limit` (default: 10)
  - `category` (optional, default: "all")
  - `status` (optional: "draft", "published", "archived", default: "all")
  - `priority` (optional: "low", "medium", "high", default: "all")
  - `search` (optional)
  - `sortBy` (optional, default: "updatedAt")
  - `sortOrder` (optional: "asc" or "desc", default: "desc")

- **Example**: `/notes?page=1&limit=10&status=draft&search=test`

- **Response**:

```json
{
  "success": true,
  "data": [
    {
      "_id": "note_id",
      "title": "My Note",
      "content": "...",
      "category": "Work",
      "priority": "medium",
      "status": "draft",
      "tags": [],
      "isFavorite": false,
      "isPrivate": true,
      "author": {...},
      "createdAt": "...",
      "updatedAt": "..."
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 42,
    "pages": 5
  }
}
```

#### 3. Get Note Stats

- **Endpoint**: `GET /notes/stats`
- **Authentication**: Required
- **Response**:

```json
{
  "success": true,
  "data": {
    "totalNotes": 42,
    "publishedNotes": 25,
    "draftNotes": 15,
    "favoriteNotes": 8
  }
}
```

#### 4. Export Notes

- **Endpoint**: `GET /notes/export`
- **Authentication**: Required
- **Response**: CSV file download
- **Columns**: Title, Category, Status, Priority, Favorite, Tags, Created At, Updated At, Content

#### 5. Get Note by ID

- **Endpoint**: `GET /notes/:id`
- **Authentication**: Required
- **Response**:

```json
{
  "success": true,
  "data": {
    "_id": "note_id",
    "title": "...",
    "content": "...",
    ...
  }
}
```

#### 6. Update Note

- **Endpoint**: `PUT /notes/:id`
- **Authentication**: Required
- **Request Body**: Any fields to update (same as create)
- **Response**: Updated note object

#### 7. Delete Note

- **Endpoint**: `DELETE /notes/:id`
- **Authentication**: Required
- **Response**:

```json
{
  "success": true,
  "message": "Note deleted successfully",
  "id": "note_id"
}
```

#### 8. Toggle Favorite

- **Endpoint**: `PATCH /notes/:id/favorite`
- **Authentication**: Required
- **Response**: Updated note object with `isFavorite` toggled

---

## Frontend Redux Integration

### Redux Slice: `notesSlice.ts`

#### State Structure

```typescript
interface NoteState {
  data: Note[];
  isLoading: boolean;
  error: string | null;
  selectedNote: Note | null;
  stats: NoteStats | null;
  filters: {
    category: string;
    status: string;
    priority: string;
    search: string;
  };
  pagination: {
    page: number;
    limit: number;
    total: number;
  };
}
```

#### Redux Actions (Async Thunks)

##### 1. fetchNotes()

Fetches notes with current filters and pagination

```typescript
dispatch(fetchNotes());
```

##### 2. fetchNoteById(noteId)

Fetches a single note by ID

```typescript
const success = await dispatch(fetchNoteById(noteId));
```

##### 3. fetchNoteStats()

Fetches note statistics

```typescript
dispatch(fetchNoteStats());
```

##### 4. createNote(newNote)

Creates a new note

```typescript
const success = await dispatch(
  createNote({
    title: "...",
    content: "...",
    category: "...",
    priority: "...",
    status: "...",
    tags: [],
    isPrivate: true,
  }),
);
```

##### 5. updateNote(noteId, updatedData)

Updates an existing note

```typescript
const success = await dispatch(
  updateNote(noteId, {
    title: "Updated Title",
    content: "Updated content",
  }),
);
```

##### 6. deleteNote(noteId)

Deletes a note

```typescript
const success = await dispatch(deleteNote(noteId));
```

##### 7. toggleFavorite(noteId)

Toggles favorite status

```typescript
const success = await dispatch(toggleFavorite(noteId));
```

##### 8. exportNotes()

Exports notes as CSV

```typescript
await dispatch(exportNotes());
```

#### Redux Selectors

```typescript
// Get all notes
const notes = useSelector(selectNotesData);

// Get loading state
const isLoading = useSelector(selectNotesLoading);

// Get error
const error = useSelector(selectNotesError);

// Get selected note
const selectedNote = useSelector(selectSelectedNote);

// Get statistics
const stats = useSelector(selectNoteStats);

// Get current filters
const filters = useSelector(selectNotesFilters);

// Get pagination info
const pagination = useSelector(selectNotesPagination);
```

#### Redux Synchronous Actions

```typescript
// Set filters (also resets to page 1)
dispatch(
  setFilters({
    category: "Work",
    status: "draft",
    priority: "high",
    search: "query",
  }),
);

// Set pagination
dispatch(
  setPagination({
    page: 2,
    limit: 20,
  }),
);

// Clear selected note
dispatch(clearSelectedNote());
```

---

## Frontend Integration in Notes Page

### File: `app/(dashboard)/doctors/notes/page.tsx`

#### Form Submission Handlers

##### Add Note

```typescript
const handleAddNote = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  const formData = new FormData(e.currentTarget);

  const newNote = {
    title: formData.get("title"),
    content: editorContent,
    category: formData.get("category"),
    priority: formData.get("priority"),
    status: formData.get("status"),
    tags: tags,
    isPrivate: formData.get("isPrivate") === "true",
  };

  const success = await dispatch(createNote(newNote));
  if (success) {
    setIsAddModalOpen(false);
    setEditorContent(""); // ✅ Form is cleared
    dispatch(fetchNotes());
    dispatch(fetchNoteStats());
  }
};
```

##### Update Note

```typescript
const handleUpdateNote = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault()

  const updatedData = {
    title: formData.get("title"),
    content: editorContent,
    ...
  }

  const success = await dispatch(updateNote(selectedNote._id, updatedData))
  if (success) {
    setIsEditModalOpen(false)
    setEditorContent("")  // ✅ Form is cleared
    dispatch(fetchNotes())
    dispatch(fetchNoteStats())
  }
}
```

#### Features Implemented

✅ **Create Notes**

- Form validation
- Rich text editor support
- Category, priority, status selection
- Tags input
- Private/public toggle

✅ **List Notes**

- Pagination (10 items per page)
- Search functionality
- Filter by category, status, priority
- Sort by creation date or update date
- Two view modes: Table & Grid

✅ **Update Notes**

- Edit existing notes
- Update all fields

✅ **Delete Notes**

- Confirmation dialog before deletion
- Instant UI update

✅ **Toggle Favorites**

- Quick favorite button
- Persists to backend

✅ **Export Notes**

- CSV format download
- Includes all note data

✅ **Statistics**

- Total notes count
- Published count
- Favorite count
- Draft count

✅ **Rich Text Editor**

- LexicalEditor component
- Markdown support
- Bold, italic, underline, strikethrough
- Headings (H1, H2, H3)
- Lists and quotes
- Links and images
- Undo/Redo functionality
- Live preview

---

## Authentication Flow

### Token Management

1. Token is stored in `localStorage` as `authToken`
2. Redux actions automatically attach token to all requests
3. Token is included in Authorization header: `Bearer {token}`

### getAuthConfig() Helper

```typescript
const getAuthConfig = () => {
  const token = localStorage.getItem("authToken");
  return {
    withCredentials: true,
    headers: {
      ...(token && { Authorization: `Bearer ${token}` }),
      "Content-Type": "application/json",
    },
  };
};
```

---

## Error Handling

### API Error Handling

- Errors are caught and mapped to user-friendly messages
- Error state is stored in Redux
- Error messages are displayed to user via modal/toast

### handleApiError() Helper

```typescript
const handleApiError = (error: unknown) => {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.message || error.message;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return "An unexpected error occurred";
};
```

---

## Environment Configuration

### Frontend (.env.local)

```
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000
NEXT_PUBLIC_API_URL=http://localhost:5000
```

### Backend Server

- Ensure backend is running on `http://localhost:5000`
- Database connection is properly configured
- JWT middleware is enabled

---

## Testing the Integration

### 1. Create a Note

```
POST http://localhost:5000/notes
Headers: Authorization: Bearer {token}
Body: {
  "title": "Test Note",
  "content": "This is a test",
  "category": "Work",
  "priority": "high",
  "status": "draft",
  "tags": ["test"],
  "isPrivate": true
}
```

### 2. Fetch Notes

```
GET http://localhost:5000/notes?page=1&limit=10
Headers: Authorization: Bearer {token}
```

### 3. Update a Note

```
PUT http://localhost:5000/notes/{noteId}
Headers: Authorization: Bearer {token}
Body: { "title": "Updated Title" }
```

### 4. Delete a Note

```
DELETE http://localhost:5000/notes/{noteId}
Headers: Authorization: Bearer {token}
```

### 5. Toggle Favorite

```
PATCH http://localhost:5000/notes/{noteId}/favorite
Headers: Authorization: Bearer {token}
```

### 6. Get Statistics

```
GET http://localhost:5000/notes/stats
Headers: Authorization: Bearer {token}
```

### 7. Export Notes

```
GET http://localhost:5000/notes/export
Headers: Authorization: Bearer {token}
```

---

## Summary

✅ **All Backend APIs** are properly implemented in `notesController.js`
✅ **Redux Integration** is complete with async thunks for all operations
✅ **Frontend Page** includes all CRUD operations
✅ **Authentication** is handled automatically via Redux
✅ **Error Handling** is comprehensive with user feedback
✅ **Form Clearing** is implemented on successful submission
✅ **Route Order** is corrected to avoid conflicts
✅ **CSV Export** is functional with proper filename

The Notes feature is now fully integrated and ready for production use!
