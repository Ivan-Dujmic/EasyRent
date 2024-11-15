# EasyRent - Car Rental Platform

🌐 **Live Demo**: [Easy Rent Frontend](https://easy-rent-ashy.vercel.app/home)

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

## Lokalno pokretanje

Za svaku poteškoću pri pokretanju predlažemo ispitivanje ChatGPT-a ili drugog AI modela za pomoć jer daju vrlo dobra uputstva.

Instalirati aktualne verzije sljedećih programa:
https://nodejs.org/en
https://www.python.org/downloads/
https://www.postgresql.org/download/
https://git-scm.com/

Klonirati repozitorij koristeći git

U mapi projekta izvesti:
python -m venv venv

Zatim pokrenuti:
Windows: venv\Scripts\activate
macOS/Linux: venv/bin/activate

Instalirati Django i potrebne pakete u backend direktoriju projekta:
pip install -r requirements.txt
Ako se pri pokretanju backenda jave greške za nepoznate module, instalirati ih koristeći pip install

Izraditi PostgreSQL bazu i u backendu urediti settings.py objekt DATABASES = {}

U backend folderu izvesti:
python manage.py makemigrations
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver

Backend bi trebao biti dostupan na 
http://127.0.0.1:8000
http://127.0.0.1:8000/admin

Otvoriti još jedan terminal

U frontend folderu pokrenuti
npm install
npm run dev

Frontend bi trebao biti dostupan na
http://localhost:3000

U slučaju grešaka povezivanja frontenda i backenda, na mjestima prijavljene greške potrebno je urediti adrese na prethodno navedene 127.0.0.1:8000 ili localhost:3000
