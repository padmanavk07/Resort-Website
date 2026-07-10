# Resort Website

A comprehensive, full-stack web application designed to streamline resort management and enhance the guest booking experience. This platform centralizes user reservations, administrative controls, and customer feedback into a single interface.

**Deployed Link:** https://resortwebsitezwp.onrender.com/
**GitHub Repository:** https://github.com/padmanavk07/Resort-Website.git

# Key Features

**User Authentication:** End-to-end user registration and login workflows (`auth.py`, `register.html`).
**Booking System:** A user-friendly interface for guests to book and secure reservations (`booking.html`).
**Admin Dashboard:** Dedicated administrative controls for staff/admin to monitor and manage resort operations (`admin.py`, `dashboard.html`).
**Customer Reviews:** Integrated feedback system allowing guests to leave ratings and share their experiences (`reviews.html`).
**Real-Time Database:** Powered by Supabase for efficient, real-time data management (`supabase_client.py`).

# Tech Stack

**Backend:** Flask (Python)
**Database:** Supabase (PostgreSQL)
**Frontend:** HTML, CSS, JavaScript
**Deployment Platform:** Render

# Project Structure

Resort Website/
├── resort/
│   ├── __init__.py
│   ├── home.py                 # Main application logic
│   ├── auth.py                 # Authentication controllers
│   ├── admin.py                # Admin dashboard routing
│   ├── db.py                   # Database connection handling
│   ├── supabase_client.py      # Supabase integration
│   ├── static/                 # CSS, JS, and image assets
│   │   ├── styles.css
│   │   ├── style1.css
│   │   ├── script.js
│   │   └── images/
│   └── templates/              # HTML templates
│       ├── base.html
│       ├── index.html
│       ├── booking.html
│       ├── reviews.html
│       ├── profile.html
│       ├── services.html
│       ├── joinfam.html
│       ├── auth/register.html
│       └── admin/dashboard.html
├── requirements.txt            # Python dependencies
├── Procfile                    
└── README.md

# Contributors

• Padmanav Khamari
• Om Sai Mohapatra
• Anwesha Satapathy