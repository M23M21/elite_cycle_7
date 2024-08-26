# Solent E-Stores

Solent E-Stores is a web application built using Next.js, React, Tailwind CSS, and Firebase. It allows users to browse and purchase bicycles online, with features for user authentication, product management.

## Features

- User authentication: Users can sign up, log in, and log out. The application distinguishes between regular users and administrators.
- Product browsing: Users can view products by category and search for products by brand or model.
- Shopping cart: Users can add products to their cart, update quantities, and remove items.
- Checkout: Users can place orders, which reduces the product stock and updates the user's balance.
- Order history: Users can view their order history and see the details of each order.
- Admin functionality:
  - Add products: Admin users can add new products to the store.
  - View all products: Admin users can view a list of all products.
  - View all users: Admin users can view a list of all registered users.
  - Edit and delete products: Admin users can edit the details of a product and delete products.

## Getting Started

npx create-next-app@latest solent-e-stores

✔ Would you like to use TypeScript? … No
✔ Would you like to use ESLint? … Yes
✔ Would you like to use Tailwind CSS? …  Yes
✔ Would you like to use `src/` directory? … No
✔ Would you like to use App Router? (recommended) … Yes
✔ Would you like to customize the default import alias (@/*)? … No
cd solent-e-stores
npm install firebase



Add the following environment variables with your Firebase configuration

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyCRXU9rQW1VBnjFbp9QK67sh9WQGcTmrEI",
    authDomain: "bicycle-ad5e4.firebaseapp.com",
    projectId: "bicycle-ad5e4",
    storageBucket: "bicycle-ad5e4.appspot.com",
    messagingSenderId: "425356937704",
    appId: "1:425356937704:web:c0ecc0df7196b0ac73fc5d",
    measurementId: "G-MEVQC8WB36",
  };
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };

 
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p



First, run the development server:

npm run dev

Open your browser and visit http://localhost:3000 to see the application.



User Roles

The application supports two user roles:
Regular User:
Can browse products, add items to the cart, and place orders
Has a virtual balance of £100,000 upon registration
Can view their own order history

Admin User:

Has all the privileges of a regular user
Can add new products to the store
Can view, edit, and delete existing products
Can view a list of all registered users
Can view all orders placed by users

Admin Credentials

The application includes a pre-configured admin user with the following credentials:

Email: admin@solent.co.uk
Password: 123456

Images

The public/images directory contains all the images used in the project.
