# Changelog

## v3.4 - Citizen Experience Update (2026-01-09)
### New Features
- **User Complaints Dashboard**: New portal (`/my-complaints`) for citizens to track filed complaints.
- **Notification System**: Real-time badge in Navbar for unread updates on complaints.
- **Enhanced Profile**: Users can now add IC Phone, Discord, Bio, and upload a Profile Photo.
- **Roster 2.0**: Complete visual overhaul of Faction Rosters with large cards, hover effects, and detailed info.
- **Developer Attribution**: Dedicated System Updates page with developer attribution and "Damon" icon.

### Improvements
- **Complaint Submission**: Improved success flow with direct link to tracking dashboard.
- **Navbar**: Converted Notification Bell to interactive dropdown with "Mark all as read".
- **Dashboard**: Implemented pagination (5 per page) for Recent Activity feed and added a "System Updates" widget.
- **UX**: Removed redundant "My Complaints" text link in favor of the notification center.

### Bug Fixes
- **Navigation**: Resolved 404 errors during complaint status redirection by ensuring `basePath` compatibility.
- **Complaint Modal**: Resolved issue where modal would leave page blurred after submission.
- **Complaint Security**: Enforced stricter author verification to prevent spoofing.

## v3.3 - Security & Roster Overhaul (2026-01-09)
### New Features
- **Roster Management**:
    - Added image upload support for member portraits.
    - Added "Edit Member" functionality for fixing mistakes.
- **Security**:
    - Implemented strict anti-spoofing for Complaints.
    - Locked identity fields for logged-in users.
- **Role System**:
    - Introduced **Superadmin** role for global management.
    - Scoped `admin` role to Department Leader (only sees their dept).
    - Restricted "Manage Users" to Superadmins.
    - **Complaint System**:
        - **Resolution Workflow**: Added "Active" vs "History" tabs.
        - Resolved/Dismissed complaints automatically move to History.
    - **Developer Experience**:
        - **Changelog**: Added full Markdown rendering support (bold, lists, code blocks).
    - **Bug Fixes**:
        - **DOJ Page**: Fixed "File Complaint" modal blurring interaction bugs.
        - **Submission Logic**: Fixed permission error preventing complaints from being sent.

## v3.2 - Developer Ecosystem (2026-01-09)
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
