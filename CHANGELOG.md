# Changelog

## v3.7 - Resources & Quick Links System (2026-01-12)
### Feature: Faction Quick Links
- **New Sidebar Widget**: Implemented a dedicated "Quick Links" widget for all factions (DOJ, LSPD, LSEMS, SAFD), separate from Official Resources.
- **Admin Management**: Created independent managers for Quick Links (`/admin/[faction]/quick-links`) with icon picking and color selection.
- **Migration**: Moved legacy navigation buttons (Join, Roster, SOPs, etc.) from horizontal bars into this new sidebar system for a cleaner UI.
- **Smart Behavior**: Links starting with `#` now trigger smooth scrolling to page sections instead of opening new tabs.

### Feature: Universal Resources
- **Generic Architecture**: Refactored the Resources system to be fully generic, allowing any faction to have multiple resource lists (e.g., "Official Resources", "Quick Links").
- **DOJ Migration**: Consolidated DOJ-specific resource handling into the universal system.
- **Admin Panel**: Added dedicated "Resources" managers for all factions.

### Visual & UX Improvements
- **Contrast Update**: Increased background opacity and border contrast for Cards, Modals, and Rosters to improve readability against the black background.
- **Admin Layout**: Fixed layout issues where the sidebar/content height was incorrect, removing unnecessary scrollbars.
- **Bar Association**:
  - Added Photo URL, Bar Number, and Firm fields to the Attorney Roster.
  - Enhanced the Admin Bar Manager with photo upload support and nicer edit forms.
- **Cleanup**: Removed deprecated "Quick Action" grids (MDT, Impound, Gang Intel) to declutter faction pages.

## v3.6.2 - Admin "Command Center" Redesign (2026-01-11)
### Admin Panel Overhaul
- **Dual-Mode Sidebar**: Implemented Full vs. Mini (icon-only) toggle to maximize workspace area.
- **Collapsible Categories**: Grouped navigation into collapsible sections (Judiciary, Police, Medical, Fire) for better organization.
- **Horizontal Context Hub**: Added a secondary top bar with real-time breadcrumbs and dynamic **Quick Actions** (e.g., "New Post" button appears automatically in Announcements).
- **Profile Standardization**: Consistent usage of custom `photoURL` across Navbar, Admin Top Bar, and Sidebar Profile items.

### Navbar & UX
- **Profile Dropdown**: Implemented a premium hover menu for the user pill with stabilized hover state.
- **Visual Polish**: Added micro-animations to sidebar icons and enhanced glassmorphism depth.

## v3.6.1 - Background Hotfix (2026-01-11)
### Bug Fixes
- **Layout Consistency**: Resolved an issue where **EMS** and **FD** pages had redundant layout files causing background "cutoff" bars and restricted widths on large monitors.
- **Global Theme Sync**: Synchronized Navbar, Home Page, and Quick Navigation to use the pure black theme.

## v3.6 - Dark Mode Redesign (2026-01-11)
### Visual Overhaul & Dark Theme
- **Global Dark Mode**: Switched to a pure black (`#000000`) theme for a premium, cinematic aesthetic.
- **Admin Panel Redesign**:
  - **Sidebar**: Compacted layout with semi-transparent, darker backgrounds.
  - **Data Tables**: Reduced padding for higher information density, applied consistent dark styling to Records, Laws, Complaints, Careers, and Bar pages.
- **Faction Pages**:
  - Updated **LSPD**, **LSEMS**, **SAFD**, and **DOJ** pages with smaller headers and compact content blocks.
  - **Components**: Redesigned `FactionRoster`, `FactionAnnouncements`, and `FactionJobs` to align with the new dark theme.

## v3.5 - Visual Polish & Optimization (2026-01-10)
### Visual Overhaul
- **Global Typography**: Applied "Condensed Infinity" style - tighter tracking (`tracking-tighter`), reduced header sizes (`text-7xl` max), and adjusted line heights for a premium, dense feel.
- **Layout Compression**: 
  - Reduced vertical spacing (`py`, `my`) by ~40% across all pages.
  - Condensed Admin Sidebar items and sections for better information density.
  - Tightened grid gaps throughout Faction and Admin pages.

### Mobile Responsiveness
- **Admin Panel**: 
  - Fixed "Invisible Menu" issue by implementing a dedicated `fixed` mobile navbar (`z-50`).
  - Added auto-close behavior to sidebar links to improve navigation flow (fixed Dashboard link not closing menu).
  - Adjusted mobile header sizing and responsiveness for Laws & Users pages.
- **Faction Pages**: Ensured headers and grid layouts scale correctly on smaller screens.

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
