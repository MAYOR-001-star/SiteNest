import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { getFirestore, doc, getDoc, setDoc, addDoc, collection, getDocs, updateDoc, deleteDoc } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDpbbUqwhYv9b4IWlE-D60hzwGCsa16nXA",
  authDomain: "sitenest-318b4.firebaseapp.com",
  projectId: "sitenest-318b4",
  storageBucket: "sitenest-318b4.appspot.com",
  messagingSenderId: "464415746140",
  appId: "1:464415746140:web:00391c12212d034e56de99"
};

// Initialize Firebase and Firestore
const app = initializeApp(firebaseConfig);
const db = getFirestore();

// Select elements
const sign_outBtn = document.querySelector("#sign_out");
const userlink = document.querySelector("#userlink");
const blogForm = document.querySelector("#blog-form");
const blogTitle = document.querySelector("#blog-title");
const blogContent = document.querySelector("#blog-content");
const blogList = document.querySelector("#blog-list");
const loader = document.querySelector(".loader");
const container = document.querySelector(".container");
const totalCharacter = document.querySelector(".total-character-left");

let currentUser = null;
let isEditing = false;  // Flag to check if the user is editing a blog
let editingBlogId = null;  // To store the ID of the blog being edited

window.addEventListener("load", () => {
  loader.classList.add("fadeOut");
  container.classList.add("fadeIn");
});

// Login function to determine if user is logged in
function login() {
  if (localStorage.getItem("keepLoggedIn") === "yes" && localStorage.getItem("user")) {
    currentUser = JSON.parse(localStorage.getItem("user"));
  } else if (sessionStorage.getItem("user")) {
    currentUser = JSON.parse(sessionStorage.getItem("user"));
  }
}

// Sign-out function
function signOut() {
  localStorage.removeItem("user");
  localStorage.removeItem("keepLoggedIn");
  sessionStorage.removeItem("user");
  window.location.href = "./Login.html";
}

// Fetch and display blogs
async function fetchAndDisplayBlogs() {
  if (!currentUser || !currentUser.email) return;

  blogList.innerHTML = ""; // Clear the list

  const blogsCollectionRef = collection(db, "users", currentUser.email, "blogs");
  const querySnapshot = await getDocs(blogsCollectionRef);

  querySnapshot.forEach((doc) => {
    const blog = doc.data();
    const blogId = doc.id;  // Get blog document ID

    // Create the blog post structure
    const divHeader = createHeader(blog.title, blogId);
    const divContent = createContent(blog.title, blog.content, blogId);

    // Append elements to the blog list
    blogList.appendChild(divHeader);
    blogList.appendChild(divContent);
  });

  // Function to create header (title + lock icon)
  function createHeader(title, blogId) {
    const divHeader = document.createElement("div");
    divHeader.classList.add("list");

    const titleParagraph = document.createElement("p");
    titleParagraph.classList.add("title-paragraph");
    titleParagraph.textContent = title;

    const openContainer = document.createElement("div");
    const lockIcon = document.createElement("img");
    lockIcon.src = "./lock.svg";
    lockIcon.alt = "icon";
    lockIcon.classList.add("blog-padlock");
    openContainer.appendChild(lockIcon);

    divHeader.appendChild(titleParagraph);
    divHeader.appendChild(openContainer);
    return divHeader;
  }

  // Function to create content (blog content + buttons)
  function createContent(title, content, blogId) {
    const divContent = document.createElement("div");

    const blogParagraph = document.createElement("p");
    blogParagraph.classList.add("blog-paragraph");
    blogParagraph.textContent = content;

    const buttonContainer = document.createElement("div");
    buttonContainer.classList.add("buttonss");

    const editButton = document.createElement("button");
    editButton.textContent = "Edit";
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.classList.add("deleteBtns");
    editButton.classList.add("editBtn");

    // Attach event listeners to buttons
    editButton.addEventListener("click", () => {
      blogTitle.value = title;
      blogContent.value = content;
      isEditing = true;
      editingBlogId = blogId;
    });

    deleteButton.addEventListener("click", async () => {
      if (confirm("Are you sure you want to delete this blog?")) {
        const blogDocRef = doc(db, "users", currentUser.email, "blogs", blogId);
        await deleteDoc(blogDocRef);
        alert("Blog deleted successfully!");
        await fetchAndDisplayBlogs();  // Refresh the list after deletion
      }
    });

    buttonContainer.appendChild(editButton);
    buttonContainer.appendChild(deleteButton);
    divContent.appendChild(blogParagraph);
    divContent.appendChild(buttonContainer);
    
    return divContent;
  }
}

// Add or edit blog
blogForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  try {
    const email = currentUser.email;
    const title = blogTitle.value.trim();
    const content = blogContent.value.trim();

    if (!title || !content) {
      alert("All fields must be filled!");
      return;
    }

    const blogsCollectionRef = collection(db, "users", email, "blogs");
    const querySnapshot = await getDocs(blogsCollectionRef);
    

    // Check for duplicate title if it's not in edit mode
    if (!isEditing) {
        const duplicate = querySnapshot.docs.find(
            (doc) => doc.data().title.toLowerCase() === title.toLowerCase()
        );

        if (duplicate) {
            alert("A blog with the same title already exists! Please use a different title.");
            return;
        }

      // Add new blog
        await addDoc(blogsCollectionRef, {
            title,
            content,
            createdAt: new Date(),
        });

        alert("Blog added successfully!");
    } else {
        // Update existing blog
        const blogDocRef = doc(db, "users", currentUser.email, "blogs", editingBlogId);
        await updateDoc(blogDocRef, {
            title,
            content,
            updatedAt: new Date(),
        });

        alert("Blog updated successfully!");
        isEditing = false; // Reset flag
        editingBlogId = null; // Reset blog ID
        }

        blogForm.reset(); // Clear form
        await fetchAndDisplayBlogs(); // Refresh blogs
    } catch (error) {
        console.error("Error saving blog:", error);
        alert(`Error: ${error.message}`);
    }
    });

// Ensure DOM is fully loaded before running the script
document.addEventListener("DOMContentLoaded", async () => {
    login();
    if (currentUser === null) {
        userlink.textContent = "Please login";
        blogForm.style.display = "none";
        document.querySelector("#bloggg").style.display = "none";
        sign_outBtn.style.display = "none";
    } else {
        userlink.textContent = `Welcome, ${currentUser.displayName || currentUser.username}`;
        blogForm.style.display = "block";
        document.querySelector("#bloggg").style.display = "flex";
        sign_outBtn.style.display = "block";
        await fetchAndDisplayBlogs();
    }
});

sign_outBtn.addEventListener("click", signOut);

function blogCharacter() {
    totalCharacter.textContent = blogContent.maxLength - blogContent.value.length;
    if (totalCharacter.textContent <= 10) {
        document.querySelector(".text-checker").style.color = "red";
    } else {
        document.querySelector(".text-checker").style.color = "black";
    }
}

blogCharacter();

blogContent.addEventListener("keyup", () => {
    if (blogContent && totalCharacter) {
        blogCharacter();
        document.querySelector("#blog-btn").disabled = false;
    } else {
        document.querySelector("#blog-btn").disabled = true;
    }
}); 


function changer() {
    const changerContainer = document.querySelector(".changer");
    const changerContent = ["Anywhere", "Anytime", "Anyday", "Anyhow"];

    let characterchanger = 0;
    let changerContentSample = 0;

    function update() {
        changerContainer.textContent = changerContent[changerContentSample].slice(0, characterchanger);
        characterchanger++;

        if (characterchanger === changerContent[changerContentSample].length) {
            characterchanger = 0;
            changerContentSample++;
        }

        if (changerContentSample >= changerContent.length) {
            characterchanger = 0;
            changerContentSample = 0;
        }
    }

    setInterval(update, 400);
}
changer();
