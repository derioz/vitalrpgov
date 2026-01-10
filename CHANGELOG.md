# Changelog

## v3.2 (2026-01-09)
- **Admin Dashboard**: Complete refactor of `/admin` page.
  - Replaced dummy stats with real-time data from Firestore (Users, Complaints, Roster, Jobs).
  - Added role-based filtering for statistics and activity feeds.
  - Implemented "Recent Activity" feed merging Announcements and Complaints.
- **Changelog System**: Added "Developer Changelog" section to Admin Dashboard.
  - Allows Admins to post update logs visible to all dashboard users.
  - Created `changelogs` Firestore collection.
- **UI**: Removed "System Health" widget; updated Sidebar version.

## v3.1
- **Roster System**: Implemented full roster management for LSPD, LSEMS, SAFD, and DOJ.
- **Navigation**: Fixed 404 errors on roster pages; updated Admin Sidebar links.

## v3.0
- **Initial Release**: detailed admin panel with complaints, careers, and laws management.
