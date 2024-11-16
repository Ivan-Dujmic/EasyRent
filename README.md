# EasyRent - Car Rental Platform

🌐 **Live Demo**: [EasyRent Website](https://easy-rent-ashy.vercel.app/home)

## Project Overview

EasyRent is a web application designed to streamline the car rental process for users by offering a seamless platform where customers can browse available cars, filter them based on various parameters, and book vehicles using external payment services or an integrated virtual wallet. The application allows for multiple roles, where users, vehicle owners, and administrators interact and collaborate efficiently to create a personalized and effective car rental experience.

### Motivation

This project is the result of team collaboration for the **Software Engineering** course at the Faculty of Electrical Engineering and Computing, University of Zagreb. The primary goal of EasyRent is to simplify car rental operations in the tourism and business sectors, enabling users to quickly and easily book vehicles online. The platform optimizes the business processes for companies dealing with car rentals and is scalable to meet the needs of different users and businesses. This project provided an opportunity for the team to learn about cutting-edge technologies, including **frontend and backend development, database management, DevOps practices, and security implementation through OAuth 2.0**. 


### Problem We Are Solving

In an era of digital transformation, traditional car rental processes are often inefficient, involving manual processes, multiple interactions, and unclear communication. EasyRent solves this problem by offering:
- A centralized platform to view and book vehicles.
- Communication tools for direct interaction between users and car owners.
- A secure and transparent review system to ensure trust between users and owners.
- Integrated payment solutions to simplify transactions.

By addressing these challenges, EasyRent enhances both the customer and car owner experience, making the process quicker, easier, and more transparent.

## Key Features

### User Roles and Interactions:
1. **Customers:**
   - Browse, filter, and book vehicles.
   - Direct communication with car owners through a built-in chat.
   - Payment options using the virtual wallet or external services (PayPal/Stripe).
   - Rating and reviewing vehicles and services.

2. **Car Owners:**
   - Add, manage, and price their vehicles.
   - Communicate with customers to finalize rental details.
   - Manage their earnings and review customer feedback.

3. **Administrators:**
   - Monitor and moderate user interactions, including chats, reviews, and transactions.
   - Manage users and car owners, ensuring compliance with platform policies.
   - Create promotions and bonuses for customers.

### Additional Features
- **Vehicle Recommendation System**: Based on user reviews, the system suggests the most popular or highly-rated cars.
- **Negotiation System**: Customers and car owners can negotiate rental conditions 

## Local run

Install the following:
https://nodejs.org/en
https://www.python.org/downloads/
https://www.postgresql.org/download/
https://git-scm.com/

Create an empty directory and navigate to it
_git clone --branch local https://github.com/fran-galic/EasyRent.git_
Navigate to the outer backend directory
_python -m venv venv_
Windows: _.\venv\Scripts\activate_
macOS/Linux: _source venv/bin/activate_
pip install -r requirements.txt
Create a PostgreSQL database (ideally named EasyRentTest)
In backend/backend/settings.py navigate to object DATABASES and adjust the attributes (common ports are 5432 and 5433)
Navigate back to the outer backend
_python manage.py migrate_
_python manage.py createsuperuser_
_python manage.py runserver_
The backend should now be available at 127.0.0.1:8000
Open 127.0.0.1:8000/admin
Go to SITES Sites and change example to {Domain name: 127.0.0.1:8000, Display name: localhost}

(Optional) Email confirmation sender
You have to setup your gmail account to work with apps
Navigate to the outer backend folder, add file named .env and fill the following data:
_GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
HOST_PASSWORD=
HOST_EMAIL=_

Go to the admin page again
ADD Social Accounts Social applications {Provider: Google, Name: google, Client id: GOOGLE_CLIENT_ID, Secret key: GOOGLE_CLIENT_SECRET} and add the 127.0.0.1:8000 site

Open another terminal
Navigate to Front
_npm install_
_npm run dev_
The frontend should now be running at localhost:3000

In case you skipped the email confirmation setup, you can go to the backend admin site or directly into the database and edit the auth_user's is_active property to true
