# Legal Faction Portal for Vital RP made by Damon

## Changelog

### 2026-01-09
*   **Removed "Legislation" and "Records Database" References**:
    *   Removed sidebar links from the Admin Panel (`AdminSidebar.tsx`).
    *   Removed the "Legal Resources" section (Penal Code, Constitution, Gov Code) from the DOJ page.
    *   Removed "Penal Code" quick action from the LSPD page.
    *   Removed "Records" quick action from the LSEMS page.
*   **Fixed 404 Image Errors**:
    *   Updated `Navbar.tsx`, `Footer.tsx`, and `login/page.tsx` to fix broken image paths (removed incorrect `/vitalrpgov` prefix).
*   **Fixed Firebase Permission Errors**:
    *   Identified missing Firestore rules for `/complaints`, `/bar_members`, `/laws`, and `/dockets`.
    *   Updated `firestore.rules` with comprehensive security rules to resolve "Missing or insufficient permissions" errors in the Admin Panel.
*   **UI Adjustments**:
    *   Resized "Department Announcement" images in `FactionAnnouncements.tsx` (reduced height from `h-64` to `h-32`) for a cleaner look on all faction pages.
