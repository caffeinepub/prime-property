# Prime Property

## Current State
A real estate consultancy website with sections: Hero, Services, Testimonials, Contact form, Footer. Backend stores contact inquiries. No property listings feature exists. Admin authorization is a basic single-principal setup.

## Requested Changes (Diff)

### Add
- Property listings data type: title, description, price, location, type (Sale/Rent), imageUrl, createdAt
- Backend CRUD: addProperty, removeProperty, getAllProperties (public), getProperty
- Admin authentication via Internet Identity
- Admin panel page (/admin): login/logout, upload property photo (blob storage), fill in title/description/price/location/type, submit
- Public "Properties" section on the website showing property cards with photo, title, description, price, location badge
- "Properties" link in the navbar

### Modify
- Backend: add property management functions alongside existing inquiry logic
- Navbar: add "Properties" link
- Footer quick links: add Properties

### Remove
- Nothing removed

## Implementation Plan
1. Select `authorization` and `blob-storage` Caffeine components
2. Generate Motoko backend with Property type + CRUD functions + existing inquiry functions
3. Build frontend:
   - Admin page with Internet Identity login, property upload form (image via blob-storage), manage/delete listings
   - Public Properties section displaying cards fetched from backend
   - Navbar + footer links updated
