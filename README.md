# Habit Tracker
This project is a full-stack web application for a habit tracker that includes the basic CRUD-Methods for managing habits, associated categories and user data.
- Backend: Laravel (PHP 8, SQLite, REST API)
- Frontend: Next.js (React, Tailwind CSS 3)

## Features
- user registration & login
- CRUD operations for habits, journals, categories and users
- Habit scheduling (daily, weekly, monthly, custom)
- Calendar integration with completion tracking
- Responsive frontend
- Accessibility support

Side note: Journals are only available in the backend at the moment, they will be displayed in the frontend in the future

## Project Structure
.
├── README.md
├── frontend       # Next.js app (React + Tailwind)
└── laravel        # Laravel backend (API + database)

## Installation Requirements
Make sure PHP, Composer, Node.js and npm are installed on your device before installing the project.
- PHP 8.4+ (tested with 8.4.5): https://www.php.net/downloads.php
- Composer 2.8+ (tested with 2.8.8): https://getcomposer.org/download/
- Node.js 23+ (tested with 23.11.0): https://nodejs.org/en/download/current (includes npm)

### Clone Project
Save the project folder in a desired place and open the folder in your code editor.
To be safe, I recommend saving the folder on your device, not in a cloud like OneDrive.

If you would like clone my repository you can find it here: https://github.com/jasobdi/bujo-habit-tracker.git
Don’t know how to clone a repository? Find out under this link: https://docs.github.com/en/repositories/creating-and-managing-repositories/cloning-a-repository


### Backend Setup (Laravel) incl. DB
This project already includes the Laravel framework, no need to install it separately.

#### Install dependencies:
Go to the laravel folder and install the composer:
```bash
cd laravel
composer install
```
#### Database
By default this project uses SQLite because it requires no extra installation.

The database can be set up in two ways:
*Option 1:* Import the provided SQL dump
```bash
# create empty databse file
touch database/database.sqlite

# import dump
sqlite3 database/database.sqlite ".read ../db-dump/habit_tracker.sql"
```

*Option 2:* Run migrations & seeders
```bash
# run migration & seeder
php artisan migrate --seed

# start Laravel server
php artisan serve
```

The API will be available at http://localhost:8000/api
For more information regarding the API, please have a look at the habit-tracker-api-docs.md in the root folder of this project.


### Frontend Setup (Next.js App Router)
#### Install dependencies:
Go to the frontend folder and install npm:
```bash
cd ../frontend
npm install
```
#### Environment setup:
Create a .env.local file in frontend/ with the backend API URL: NEXT_PUBLIC_API_URL=http://localhost:8000/api
To use NextAuth also configure: 
- NEXTAUTH_SECRET=your-secret
To generate a random value for secret, use a generator like this one: https://auth-secret-gen.vercel.app/ 
- NEXTAUTH_URL=http://localhost:3000

#### Start the Next.js dev server:
```bash
npm run dev
```
The frontend runs at http://localhost:3000

## Authentication (Demo User)
The project comes with a demo user (seeded automatically when running migrations).
You can log in with the following credentials:
```
Email: test@example.com
Password: Test_1234
```

Alternatively, you may also register a new user.

## API testing
For testing the Laravel API, I recommend using the open-source API Client Bruno, it is easy to use.
This project already includes a Bruno collection with all endpoints and an environment. Simply import it and start testing right away.

Side note: For the authentication to work, you will have to copy the Bearer Token that is included in the login return and paste it into the environment settings (token variable).

- Install Bruno API client: https://docs.usebruno.com/get-started/bruno-basics/download
- Bruno collection: laravel/docs/Bruno

If you prefer other API tools, you may also use those.
All API endpoints follow a RESTful pattern, here are some example requests:
- POST /api/auth/register – Register a new user
- POST /api/auth/login – Log in and receive a token
- GET /api/habits?date=2025-05-05 – Get habits by date

