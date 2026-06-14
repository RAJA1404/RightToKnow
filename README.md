# Right To Know (RTI) Management System

A comprehensive full-stack web application for managing Right To Information (RTI) requests and applications in India. This system streamlines the RTI application process, tracks requests through various government departments, and provides a smart assistant for drafting effective RTI queries.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation & Setup](#installation--setup)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Frontend Pages](#frontend-pages)
- [Database Models](#database-models)
- [Key Features in Detail](#key-features-in-detail)
- [Configuration](#configuration)
- [Development](#development)
- [Contributing](#contributing)

---

## Overview

The Right To Know (RTI) Management System is designed to facilitate citizens' access to government information through the Right to Information Act. The system provides:

- **Smart RTI Request Builder**: AI-assisted drafting of RTI applications
- **Application Tracking**: Real-time tracking of RTI requests through different departments
- **Department Management**: Centralized management of government departments and public authorities
- **User Authentication**: Role-based access control (Citizens, Department Admins, HOD, Main Admin)
- **Multi-language Support**: Support for multiple languages including Tamil and English
- **Location Hierarchy**: Complete district-taluk-block-village mapping for Tamil Nadu

---

## Features

### 🎯 Core Features

✅ **User Management**
- User registration and authentication with JWT tokens
- Role-based access control (Citizen, Dept Admin, HOD, Main Admin)
- OTP-based email verification
- Profile management

✅ **RTI Request Management**
- Create, draft, and submit RTI applications
- Smart assistant for query formulation
- Application status tracking
- Automated due date calculation (30 days)
- Request categorization and assignment to departments

✅ **Department & Authority Management**
- Department hierarchy management
- Public authority information management
- Location-based filtering (State → District → Taluk → Block)
- Department keyword mapping for smart routing

✅ **Administrative Features**
- Audit logging for all system activities
- RTI request assignment and transfer between departments
- Overdue tracking and notifications
- Sample questions and guidelines for citizens

✅ **Multi-language Support**
- English and Tamil language support
- Localized content and UI

---

## Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Email Service**: Nodemailer
- **SMS Service**: Twilio
- **Cloud Storage**: AWS S3
- **Task Scheduling**: Node-cron
- **Security**: bcryptjs, cors, express-rate-limit

### Frontend
- **Library**: React 19.x
- **Router**: React Router DOM 7.x
- **HTTP Client**: Axios
- **Styling**: Tailwind CSS
- **Build Tool**: Create React App (react-scripts)
- **Testing**: Jest & React Testing Library

### Additional Tools
- **Development**: Nodemon (backend), Create React App (frontend)
- **Build**: Express, React Scripts

---

## Project Structure

```
RightToKnow/
├── backend/
│   ├── package.json
│   ├── server.js
│   ├── src/
│   │   ├── app.js                 # Express app configuration
│   │   ├── server.js              # Server entry point
│   │   ├── controllers/           # Route controllers
│   │   │   ├── auth.controller.js
│   │   │   ├── departmentController.js
│   │   │   ├── location.controller.js
│   │   │   ├── metadata.controller.js
│   │   │   ├── rti.controller.js
│   │   │   └── tracking.controller.js
│   │   ├── models/                # Database models (Mongoose schemas)
│   │   │   ├── User.js
│   │   │   ├── RtiRequest.js
│   │   │   ├── Department.js
│   │   │   ├── PublicAuthority.js
│   │   │   ├── Category.js
│   │   │   ├── AuditLog.js
│   │   │   ├── OtpVerification.js
│   │   │   └── ...
│   │   ├── routes/                # API route definitions
│   │   │   ├── auth.routes.js
│   │   │   ├── department.routes.js
│   │   │   ├── rti.routes.js
│   │   │   ├── location.routes.js
│   │   │   └── metadata.routes.js
│   │   ├── middleware/            # Custom middleware
│   │   │   └── auth.js            # JWT authentication middleware
│   │   ├── services/              # Business logic services
│   │   │   ├── otp.service.js
│   │   │   └── smartRti.service.js
│   │   ├── utils/                 # Utility functions
│   │   │   ├── departmentKeywords.js
│   │   │   └── legacyAuth.js
│   │   └── data/                  # Static data
│   │       └── districts.json
│   ├── controllers/               # Legacy controllers
│   │   └── hod.controller.js
│   ├── models/                    # Legacy models
│   │   └── Hod.model.js
│   ├── routes/                    # Legacy routes
│   │   └── hod.routes.js
│   ├── data/                      # Data files
│   │   └── hodSeedData.js
│   ├── scripts/                   # Database seeding & import scripts
│   │   ├── seed.js
│   │   ├── seedDepartments.js
│   │   ├── seedUsers.js
│   │   ├── importHod.js
│   │   ├── importLocationHierarchyXlsx.js
│   │   ├── importPublicAuthoritiesXlsx.js
│   │   └── auditTamilNaduLocationMapping.js
│   └── reports/                   # Audit and validation reports
│       └── tamilnadu-location-audit/
│
├── frontend/
│   ├── package.json
│   ├── public/                    # Static public files
│   ├── src/
│   │   ├── index.js              # React entry point
│   │   ├── App.js                # Main app component
│   │   ├── App.css
│   │   ├── App.test.js
│   │   ├── index.css
│   │   ├── constants.js          # Application constants
│   │   ├── translations.js       # i18n translations
│   │   ├── api/
│   │   │   └── axios.js          # Axios HTTP client configuration
│   │   ├── components/           # Reusable React components
│   │   │   ├── Navbar.jsx
│   │   │   ├── DepartmentCard.jsx
│   │   │   ├── LocationInput.jsx
│   │   │   ├── SmartAssistantPanel.jsx
│   │   │   ├── Timeline.jsx
│   │   │   ├── StepIndicator.jsx
│   │   │   ├── ProgressSidebar.jsx
│   │   │   └── ... (more components)
│   │   ├── context/              # React Context for state management
│   │   │   ├── AuthContext.jsx
│   │   │   └── LanguageContext.jsx
│   │   ├── pages/                # Page components
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── NewRTIRequest.jsx
│   │   │   ├── ReviewDraft.jsx
│   │   │   ├── TrackApplication.jsx
│   │   │   ├── PublicAuthority.jsx
│   │   │   ├── FAQ.jsx
│   │   │   ├── Guidelines.jsx
│   │   │   └── AdminPanel.jsx
│   │   ├── i18n/                # Internationalization
│   │   │   └── portalText.js
│   │   ├── utils/               # Utility functions
│   │   │   └── formatApiError.js
│   │   └── reportWebVitals.js
│   ├── build/                   # Production build output
│   ├── tailwind.config.js       # Tailwind CSS configuration
│   └── postcss.config.js        # PostCSS configuration
│
└── TODO.md                      # Project task tracking
```

---

## Prerequisites

Before setting up the project, ensure you have:

- **Node.js** (v16.0.0 or higher)
- **npm** or **yarn** package manager
- **MongoDB** (v4.4 or higher) - local or cloud instance
- **Git** for version control
- Environment variables set up (.env file)

### Required Environment Variables

#### Backend (.env)
```
MONGODB_URI=mongodb://localhost:27017/rti-management
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=7d

# Email Service (Nodemailer)
EMAIL_SERVICE=gmail
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

# SMS Service (Twilio)
TWILIO_ACCOUNT_SID=your_account_sid
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_PHONE_NUMBER=+1234567890

# AWS S3
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_S3_BUCKET=your_bucket_name

# Server
PORT=5000
NODE_ENV=development
```

#### Frontend (.env.local)
```
REACT_APP_API_BASE_URL=http://localhost:5000/api
```

---

## Installation & Setup

### Step 1: Clone the Repository

```bash
git clone <repository-url>
cd RightToKnow
```

### Step 2: Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create .env file with configuration (see Prerequisites)
# Update MongoDB connection string, JWT secret, email/SMS credentials

# Run database migrations/seeds (if applicable)
npm run seed:departments

# Import data (optional)
npm run import:locations
npm run import:public-authorities
```

### Step 3: Frontend Setup

```bash
cd ../frontend

# Install dependencies
npm install

# Create .env.local with API configuration
echo "REACT_APP_API_BASE_URL=http://localhost:5000/api" > .env.local
```

---

## Running the Application

### Development Mode

#### Terminal 1 - Backend Server
```bash
cd backend
npm run dev
# Server runs on http://localhost:5000
```

#### Terminal 2 - Frontend Development Server
```bash
cd frontend
npm start
# Frontend runs on http://localhost:3000
```

### Production Mode

#### Backend
```bash
cd backend
npm start
```

#### Frontend
```bash
cd frontend
npm run build
# Serve the build/ folder with a static server
```

---

## API Documentation

### Authentication Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|--|
| POST | `/api/auth/register` | Register new user | No |
| POST | `/api/auth/login` | User login | No |
| POST | `/api/auth/verify-otp` | Verify OTP | No |
| GET | `/api/auth/profile` | Get user profile | Yes |

### RTI Request Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|--|
| POST | `/api/rti/create` | Create new RTI request | Yes |
| GET | `/api/rti/:id` | Get RTI request details | Yes |
| PUT | `/api/rti/:id` | Update RTI request | Yes |
| GET | `/api/rti/track/:id` | Track RTI status | Yes |
| POST | `/api/rti/assign-application/:id` | Assign request to department | Yes (Admin) |

### Department Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|--|
| GET | `/api/departments` | List all departments | Yes |
| POST | `/api/departments` | Create department | Yes (Admin) |
| GET | `/api/departments/:id` | Get department details | Yes |
| PUT | `/api/departments/:id` | Update department | Yes (Admin) |

### Location Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|--|
| GET | `/api/locations/states` | Get all states | No |
| GET | `/api/locations/districts/:state` | Get districts | No |
| GET | `/api/locations/taluks/:district` | Get taluks | No |
| GET | `/api/locations/blocks/:taluk` | Get blocks | No |

### Metadata Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|--|
| GET | `/api/metadata/categories` | Get RTI categories | No |
| GET | `/api/metadata/faqs` | Get FAQs | No |
| GET | `/api/metadata/guidelines` | Get RTI guidelines | No |

---

## Frontend Pages

### Public Pages
- **Home** (`/`) - Landing page with RTI information
- **Login** (`/login`) - User login
- **Register** (`/register`) - User registration
- **FAQ** (`/faq`) - Frequently asked questions
- **Guidelines** (`/guidelines`) - RTI guidelines and information

### Authenticated Pages
- **Smart RTI Assistant** (`/smart-assistant`) - AI-assisted RTI query builder
- **Review Draft** (`/review-draft`) - Review and edit RTI draft
- **Track Application** (`/track-smart-rti`) - Track RTI status
- **Public Authority** (`/public-authority`) - Browse government departments
- **Submitted Request** (`/submitted-request`) - View submitted RTI requests
- **Admin Panel** (`/admin`) - Administrative dashboard (Admin users only)

### Key Components
- `Navbar.jsx` - Navigation bar with language selection
- `SmartAssistantPanel.jsx` - AI-powered RTI query drafting
- `LocationInput.jsx` - Hierarchical location selection
- `Timeline.jsx` - RTI application status timeline
- `ProgressSidebar.jsx` - Multi-step process indicator
- `DepartmentCard.jsx` - Department information display
- `StepIndicator.jsx` - Current step indicator in workflows

---

## Database Models

### User Model
```javascript
{
  email: String (unique),
  password: String (hashed),
  name: String,
  phone: String,
  role: Enum [CITIZEN, DEPT_ADMIN, HOD, MAIN_ADMIN],
  department: ObjectId,
  isVerified: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### RTI Request Model
```javascript
{
  requestNumber: String (unique),
  userId: ObjectId (ref: User),
  title: String,
  description: String,
  category: ObjectId (ref: Category),
  department: ObjectId (ref: Department),
  location: {
    state: String,
    district: String,
    taluk: String,
    block: String
  },
  status: Enum [DRAFT, SUBMITTED, RECEIVED, IN_PROCESS, REPLIED, CLOSED],
  assignedTo: ObjectId (ref: User),
  dueDate: Date,
  isOverdue: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Department Model
```javascript
{
  name: String,
  description: String,
  email: String,
  phone: String,
  address: String,
  website: String,
  hod: ObjectId (ref: User),
  location: {
    state: String,
    district: String
  },
  createdAt: Date,
  updatedAt: Date
}
```

### AuditLog Model
```javascript
{
  userId: ObjectId,
  action: String,
  entity: String,
  entityId: ObjectId,
  changes: Object,
  timestamp: Date
}
```

---

## Key Features in Detail

### 🤖 Smart RTI Assistant
- Uses keyword analysis to suggest appropriate government departments
- Provides templates and examples for crafting effective queries
- Guides users through multi-step RTI request creation
- Validates input and provides helpful suggestions

### 📍 Location Hierarchy
- Complete mapping of Tamil Nadu state structure
- Districts → Taluks → Blocks → Villages hierarchy
- Used for filtering and routing RTI requests to correct authorities
- Integrated with location audit and validation reports

### 🔐 Authentication & Authorization
- JWT-based authentication with token expiration
- Role-based access control (RBAC)
- OTP verification for email confirmation
- Secure password hashing with bcryptjs

### 📧 Notifications
- Email notifications via Nodemailer
- SMS notifications via Twilio
- Status update notifications to users and departments
- Automated due date reminders

### 📊 Audit Logging
- Complete audit trail of all system activities
- Tracks user actions, RTI status changes, and administrative operations
- Useful for compliance and transparency

### 🌐 Multi-language Support
- English and Tamil language support
- Language context for global state management
- Localized UI and content throughout the application

---

## Configuration

### Express App Configuration (backend/src/app.js)
- CORS enabled for frontend communication
- Rate limiting (100 requests per 15 minutes on /api/)
- JSON request/response parsing
- Global error handling middleware

### Tailwind CSS (frontend/tailwind.config.js)
- Customized color scheme
- Extended font configurations
- Spacing and sizing utilities

### MongoDB Connection
- Mongoose ODM for data modeling
- Connection pooling and error handling
- Automatic timestamp fields (createdAt, updatedAt)

---

## Development

### Database Seeding

```bash
# Seed initial departments
npm run seed:departments

# Import location hierarchy from Excel
npm run import:locations

# Import public authorities data
npm run import:public-authorities
```

### Creating New Models

1. Create schema in `backend/src/models/`
2. Define routes in `backend/src/routes/`
3. Implement controller logic in `backend/src/controllers/`
4. Add middleware as needed in `backend/src/middleware/`

### Creating New Frontend Components

1. Create component in `backend/frontend/src/components/` or `frontend/src/pages/`
2. Use React hooks for state management
3. Integrate with `AuthContext` or `LanguageContext` if needed
4. Style with Tailwind CSS classes

### API Integration
- Use Axios instance configured in `frontend/src/api/axios.js`
- Include JWT token in Authorization header
- Handle errors with `formatApiError` utility

---

## Contributing

1. Create a new branch for your feature:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Commit your changes:
   ```bash
   git commit -m "Add your meaningful commit message"
   ```

3. Push to the branch:
   ```bash
   git push origin feature/your-feature-name
   ```

4. Submit a pull request

---

## License

This project is part of the Right To Know initiative for transparency and accessibility of government information.

---

## Support

For issues, questions, or contributions, please reach out to the project maintainers.

---

**Last Updated**: May 2026  
**Status**: Active Development ✅
