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
  login();
});

// Login function to determine if user is logged in
function login() {
  if (localStorage.getItem("keepLoggedIn") === "yes" && localStorage.getItem("user")) {
    currentUser = JSON.parse(localStorage.getItem("user"));
  } else if (sessionStorage.getItem("user")) {
    currentUser = JSON.parse(sessionStorage.getItem("user"));
  }

  if (currentUser && currentUser.email) {
    userlink.textContent = `Welcome, ${currentUser.displayName || currentUser.username}`;
  } else {
    window.location.href = "./Login.html";
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
    const divHeader = createHeader(blog.title);
    const divContent = createContent(blog.title, blog.content, blogId);

    // Append elements to the blog list
    blogList.appendChild(divHeader);
    blogList.appendChild(divContent);
  });

  // Function to create header (title + lock icon)
  function createHeader(title) {
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

    // Create Edit and Delete buttons
    const editBtn = document.createElement("button");
    editBtn.textContent = "Edit";
    editBtn.classList.add("edit-btn");
    editBtn.onclick = () => editBlog(blogId, title, content);

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.classList.add("delete-btn");
    deleteBtn.onclick = () => deleteBlog(blogId);

    buttonContainer.appendChild(editBtn);
    buttonContainer.appendChild(deleteBtn);

    divContent.appendChild(blogParagraph);
    divContent.appendChild(buttonContainer);
    return divContent;
  }
}

// Add or update blog
blogForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const title = blogTitle.value.trim();
  const content = blogContent.value.trim();

  if (!title || !content) return;

  if (isEditing) {
    await updateBlog(editingBlogId, title, content);
  } else {
    await addBlog(title, content);
  }

  // Reset form and state
  blogTitle.value = "";
  blogContent.value = "";
  isEditing = false;
  editingBlogId = null;
  document.querySelector("#blog-btn").textContent = "Add Blog";
  fetchAndDisplayBlogs();
});

// Add a new blog
async function addBlog(title, content) {
  try {
    const blogCollectionRef = collection(db, "users", currentUser.email, "blogs");
    await addDoc(blogCollectionRef, {
      title,
      content,
      createdAt: new Date(),
    });
  } catch (error) {
    console.error("Error adding blog: ", error);
  }
}

// Update an existing blog
async function updateBlog(blogId, title, content) {
  try {
    const blogRef = doc(db, "users", currentUser.email, "blogs", blogId);
    await updateDoc(blogRef, {
      title,
      content,
      updatedAt: new Date(),
    });
  } catch (error) {
    console.error("Error updating blog: ", error);
  }
}

// Delete a blog
async function deleteBlog(blogId) {
  try {
    const blogRef = doc(db, "users", currentUser.email, "blogs", blogId);
    await deleteDoc(blogRef);
    fetchAndDisplayBlogs();
  } catch (error) {
    console.error("Error deleting blog: ", error);
  }
}

// Edit a blog
function editBlog(blogId, title, content) {
  isEditing = true;
  editingBlogId = blogId;
  blogTitle.value = title;
  blogContent.value = content;
  blogTitle.focus()
  document.querySelector("#blog-btn").textContent = "Update Blog";
}

// Event listener for sign-out button
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
  const changerContent = ["Anywhere.", "Anytime.", "Anyday.", "Anyhow."];

  let characterchanger = 0;
  let changerContentSample = 0;

  function update() {
      changerContainer.textContent = changerContent[changerContentSample].slice(0, characterchanger);
      characterchanger++;

      if (characterchanger > changerContent[changerContentSample].length) {
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

// const blogList = document.querySelector("#blog-list");

// Check if there are any child elements in the blogList
// blogList.children.length === 0 
//   ? document.querySelector("#bloggg h2").style.display = "none" 
//   : document.querySelector("#bloggg h2").style.display = "block";

