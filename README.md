# Blog Management System

## Project Overview
The Blog Management System is a web-based platform where users can log in, create blogs, and manage their content. This project utilizes Firebase for user authentication and Firestore for database storage, ensuring a seamless and scalable solution for managing blog data. Users' blogs are stored under their accounts, and duplicate blog titles are rejected to maintain uniqueness.

## Features

### 1. User Authentication
- Users can log in and out using persistent sessions.
- The login and the account creation state is managed via `localStorage` or `sessionStorage`.

### 2. Blog Management
- Users can create blogs by providing a title and content.
- Blogs are stored in Firestore under a user's email.
- Duplicate blog titles are not allowed, ensuring unique entries.

### 3. Blog Display
- Blogs are dynamically displayed on the user's dashboard after being added.
- All previously created blogs are fetched and displayed upon login.

### 4. Logout Functionality
- Users can log out, clearing their session data and redirecting them to the homepage.

## Technologies Used
- **HTML/CSS**: For structuring and styling the webpage.
- **JavaScript**: For client-side logic and Firebase integration.
- **Firebase**:
  - Authentication: For managing user sessions.
  - Firestore: For storing user data and blogs.

## Prerequisites
To run this project locally, you need:
- A Firebase project with Firestore enabled.
- Basic knowledge of JavaScript and Firebase.

## Setup Instructions

### Step 1: Clone the Repository
```bash
$ git clone <repository_url>
$ cd blog-management-system
```

### Step 2: Configure Firebase
1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com/).
2. Enable Firestore in your Firebase project.
3. Replace the `firebaseConfig` object in the `script` section of the HTML file with your Firebase project credentials.

### Step 3: Open the Project
Simply open the `index.html` file in a web browser to test the application.

## Usage Instructions

### Adding a Blog
1. Log in with your account.
2. Fill in the blog title and content in the form.
3. Click the **Add Blog** button.
   - If the title already exists, an alert will notify you, and the blog will not be added.
   - Otherwise, the blog will be added and displayed immediately.

### Viewing Blogs
- Blogs are displayed in a list under the form after login.
- Each blog shows the title and content.

### Logging Out
- Click the **Logout** button to sign out of the application.

## File Structure
```
.
├── index.html       # Main HTML file with embedded script
├── README.md        # Project documentation
```

## Known Issues
- Duplicate titles are checked case-sensitively.
- Blogs are displayed in the order they were added, without sorting options.

## Future Enhancements
- Add support for editing and deleting blogs.
- Implement a rich-text editor for blog content.
- Add pagination for blog display.
- Enhance title duplication check to be case-insensitive.

## License
This project is open-source and available under the MIT License.

## Acknowledgements
- **Firebase**: For providing authentication and database services.
- **CryptoJS**: For encryption utilities.

