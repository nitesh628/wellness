# Notes Integration - Quick Reference

## Backend Route Order (IMPORTANT!)

**File**: `backend/routes/notesRoute.js`

```javascript
router.post("/", createNote); // ✅ CREATE
router.get("/stats", getNoteStats); // ✅ STATS (before /:id)
router.get("/export", exportNotes); // ✅ EXPORT (before /:id)
router.get("/", listNotes); // ✅ LIST
router.get("/:id", getNoteById); // ✅ GET BY ID
router.put("/:id", updateNote); // ✅ UPDATE
router.delete("/:id", deleteNote); // ✅ DELETE
router.patch("/:id/favorite", toggleFavoriteNote); // ✅ TOGGLE
```

> ⚠️ **Critical**: `/stats` and `/export` must come BEFORE `/:id` to prevent Express from treating them as ID parameters!

---

## Frontend Integration Checklist

### ✅ Redux Slice

- **File**: `frontend/lib/redux/features/notesSlice.ts`
- **Status**: Fully integrated with all API calls
- **Features**:
  - Async thunks for all CRUD operations
  - Authentication token auto-injection
  - Error handling
  - State management with filters & pagination

### ✅ Frontend Page

- **File**: `frontend/app/(dashboard)/doctors/notes/page.tsx`
- **Features**:
  - Create notes modal with form clearing
  - Update notes modal with form clearing
  - Delete with confirmation
  - Toggle favorites
  - Search, filter, sort
  - Table & Grid views
  - Statistics display
  - CSV export
  - Rich text editor support

### ✅ Rich Text Editor

- **File**: `frontend/app/(dashboard)/doctors/notes/LexicalEditor.tsx`
- **Features**:
  - Markdown support
  - Formatting: Bold, Italic, Underline, Strikethrough
  - Headings: H1, H2, H3
  - Lists: Bullet & Numbered
  - Links & Images
  - Live preview
  - Undo/Redo

---

## API Endpoints Summary

| Method | Endpoint              | Auth | Purpose                    |
| ------ | --------------------- | ---- | -------------------------- |
| POST   | `/notes`              | ✅   | Create new note            |
| GET    | `/notes`              | ✅   | List all notes (paginated) |
| GET    | `/notes/stats`        | ✅   | Get statistics             |
| GET    | `/notes/export`       | ✅   | Export as CSV              |
| GET    | `/notes/:id`          | ✅   | Get single note            |
| PUT    | `/notes/:id`          | ✅   | Update note                |
| DELETE | `/notes/:id`          | ✅   | Delete note                |
| PATCH  | `/notes/:id/favorite` | ✅   | Toggle favorite            |

---

## Form Clearing Implementation

### Create Note Handler

```typescript
const handleAddNote = async (e: React.FormEvent<HTMLFormElement>) => {
  // ... form processing ...

  const success = await dispatch(createNote(newNote));
  if (success) {
    setIsAddModalOpen(false); // Close modal
    setEditorContent(""); // ✅ Clear editor
    dispatch(fetchNotes()); // Refresh list
    dispatch(fetchNoteStats()); // Update stats
  }
};
```

### Key Points:

- Modal closes automatically
- Editor content is cleared: `setEditorContent("")`
- Form inputs reset when modal reopens (modal state resets)
- Data is refreshed from backend

---

## Authentication Setup

### Token Location

- Stored in: `localStorage.getItem("authToken")`
- Automatically attached to all API requests
- Header format: `Authorization: Bearer {token}`

### Environment Variables

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000
NEXT_PUBLIC_API_URL=http://localhost:5000
```

---

## Redux Hooks Usage

```typescript
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import {
  fetchNotes,
  createNote,
  selectNotesData,
  selectNotesLoading,
} from "@/lib/redux/features/notesSlice";

// In component:
const dispatch = useAppDispatch();
const notes = useAppSelector(selectNotesData);
const isLoading = useAppSelector(selectNotesLoading);

// Fetch notes
useEffect(() => {
  dispatch(fetchNotes());
}, [dispatch]);

// Create note
const handleCreate = async (noteData) => {
  const success = await dispatch(createNote(noteData));
  if (success) {
    // Success handling
  }
};
```

---

## Backend Controllers

### File: `backend/controllers/notesController.js`

#### Implemented Functions:

1. `createNote` - POST /notes
2. `listNotes` - GET /notes
3. `getNoteById` - GET /notes/:id
4. `updateNote` - PUT /notes/:id
5. `deleteNote` - DELETE /notes/:id
6. `toggleFavoriteNote` - PATCH /notes/:id/favorite
7. `getNoteStats` - GET /notes/stats
8. `exportNotes` - GET /notes/export

#### Features:

- Request validation
- Error handling
- MongoDB operations
- User authentication check
- CSV export capability

---

## Database Model

### File: `backend/models/notesModel.js`

```javascript
{
  title: String (required, max 200 chars),
  content: String,
  category: String (default: "General"),
  priority: String (enum: low, medium, high),
  status: String (enum: draft, published, archived),
  author: ObjectId (ref: User, required),
  tags: [String],
  isFavorite: Boolean (default: false),
  isPrivate: Boolean (default: true),
  timestamps: true  // createdAt, updatedAt
}
```

#### Indexes:

- `{ author: 1, category: 1, status: 1 }`
- Text index on: title, content, tags

---

## Testing Quick Commands

### Create Note (Postman/cURL)

```bash
POST http://localhost:5000/notes
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "Test Note",
  "content": "Test content",
  "category": "Work",
  "priority": "high",
  "status": "draft",
  "tags": ["test"],
  "isPrivate": true
}
```

### List Notes

```bash
GET http://localhost:5000/notes?page=1&limit=10&status=draft
Authorization: Bearer {token}
```

### Get Stats

```bash
GET http://localhost:5000/notes/stats
Authorization: Bearer {token}
```

### Export Notes

```bash
GET http://localhost:5000/notes/export
Authorization: Bearer {token}
```

---

## Common Issues & Solutions

### Issue: Form doesn't clear after submission

**Solution**: Check that `setEditorContent("")` is called in the success handler

### Issue: Stats not updating

**Solution**: Ensure `fetchNoteStats()` is called after create/delete/update

### Issue: Cannot fetch notes (401 error)

**Solution**: Verify token is in localStorage and auth middleware is applied

### Issue: `/stats` endpoint not working

**Solution**: Verify route order - `/stats` must come BEFORE `/:id`

### Issue: Export shows error

**Solution**: Ensure `/export` route comes BEFORE `/:id`

---

## Performance Optimizations

1. **Pagination**: Notes are fetched in pages of 10
2. **Filtering**: Client-side filtering to reduce API calls
3. **Debouncing**: Implement search debounce (optional)
4. **Lazy Loading**: Grid view loads images on demand
5. **Memoization**: Use `useMemoizedSelector` for expensive selectors

---

## Future Enhancements

- [ ] Real-time collaboration
- [ ] Note versioning/history
- [ ] Sharing notes with other users
- [ ] Note templates
- [ ] Encryption for private notes
- [ ] Mobile app integration
- [ ] Note attachments
- [ ] Full-text search
- [ ] Custom tags management
- [ ] Note reminders

---

## Support

For issues or questions, refer to:

1. `NOTES_API_INTEGRATION_COMPLETE.md` - Full documentation
2. Backend API docs in `API_DOCUMENTATION_UPDATED.md`
3. Redux best practices in `notesSlice.ts`
4. Frontend component in `page.tsx`

**Last Updated**: February 4, 2026
**Version**: 1.0
**Status**: ✅ Production Ready
