# CacheNest

This is a feature-rich to-do list application built with Next.js and MongoDB. It provides a seamless experience for managing tasks, with user authentication and advanced filtering.


## ✨ Features

- **User Authentication**: Secure signup and login system with JWT and OTP email verification.
- **CRUD Operations for Tasks**: Create, Read, Update, and Delete tasks.
- **Advanced Task Management**: Assign priority, category, and due dates to your tasks.
- **Filtering System**: Filter tasks by their status (Completed/Pending), priority (High/Medium/Low), or category.
- **Light & Dark Mode**: Switch between light and dark themes for your comfort.
- **Toast Notifications**: Get instant feedback for your actions with non-intrusive notifications.

## 🛠️ Tech Stack

- **Framework**: Next.js
- **Database**: Mongodb with mongoose
- **Authentication**: JWT and NodeMailer
- **API**: Next.js API Routes
- **Styling**: CSS Modules
- **Deployment**: Vercel


### Prerequisites

- Node.js
- Mongodb atlas

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/Siddharth-Sameer-Nevgi/CacheNest.git
    cd CacheNest
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up environment variables:**
    Create a file named `.env.local` in the root of your project and add the following variables.

    ```env
    # MongoDB Connection String
    MONGO_URI=your_mongodb_connection_string

    # JWT Secret
    TOKEN_SECRET=your_jwt_secret_key

    # Nodemailer Credentials (for sending OTPs)
    # Use an App Password for Gmail
    USER_MAILL=your_email@gmail.com
    USER_PASS=your_gmail_app_password
    ```

4.  **Run the development server:**
    ```bash
    npm run dev
    ```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.


