# Local Storage Setup for Image Uploads

This project now supports **local file storage** as an alternative to AWS S3.

## Configuration

Add these to your `.env` file:

```env
# Use local storage
STORAGE_TYPE=local

# Your backend URL (for generating image URLs)
BACKEND_URL=http://localhost:5000
```

## How it Works

1. **Upload**: Files are saved to `backend/uploads/` folder
2. **Access**: Files served at `http://localhost:5000/uploads/filename.jpg`
3. **Delete**: Files automatically deleted when category/item is removed

## Folder Structure

```
backend/
  ├── uploads/          # Auto-created, stores uploaded images
  ├── config/
  │   ├── s3Config.js   # Handles both S3 and local storage
  │   └── localStorage.js  # Local storage implementation
  └── .env
```

## Switching Between Storage Types

### Local Storage (Default)

```env
STORAGE_TYPE=local
BACKEND_URL=http://localhost:5000
```

### AWS S3 Storage

```env
STORAGE_TYPE=s3
AWS_REGION=your-region
AWS_ACCESS_KEY_ID=your-key
AWS_SECRET_ACCESS_KEY=your-secret
AWS_BUCKET_NAME=your-bucket
```

## Important Notes

- `uploads/` folder is in `.gitignore` (images won't be committed)
- Maximum file size: 5MB
- Supported formats: All image types (jpg, png, gif, webp, etc.)
- Production: Use a CDN or cloud storage for better performance
