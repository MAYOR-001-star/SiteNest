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
const statusContainer = document.querySelector(".status")
const statusContent = document.querySelector(".status-content")
const statusImg = document.querySelector(".status-img")
const statusLevel = document.querySelector(".status-level")
const undoBtn = document.querySelector("#undo-btn")

let currentUser = null;
// let blogUndo = false
let isEditing = false;  // Flag to check if the user is editing a blog
let editingBlogId = null;  // To store the ID of the blog being edited

window.addEventListener("load", () => {
  loader.classList.add("fadeOut");
  container.classList.add("fadeIn");
  // localStorage.clear()
  login();
  fetchAndDisplayBlogs();
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
    divHeader.addEventListener("click", () => {
      const currentSrc = lockIcon.getAttribute("src");
    
      // Toggle the lock/unlock icon for the clicked blog
      if (currentSrc === "./lock.svg") {
        lockIcon.setAttribute("src", "./unlock.svg");
      } else {
        lockIcon.setAttribute("src", "./lock.svg");
      }
    
      // Select the blog content for the clicked blog (based on parent element)
      const divContent = divHeader.nextElementSibling;
      if (divContent) {
          divContent.classList.toggle("show");
      }
    });

    divHeader.appendChild(titleParagraph);
    divHeader.appendChild(openContainer);
    return divHeader;
  }

  // Function to create content (blog content + buttons)
  function createContent(title, content, blogId) {
    const divContent = document.createElement("div");
    divContent.classList.add("bloggg-content")
    const blogParagraph = document.createElement("p");
    blogParagraph.classList.add("blog-paragraph");
    blogParagraph.textContent = content;

    const buttonContainer = document.createElement("div");
    buttonContainer.classList.add("buttonss");

    // Create Edit and Delete buttons
    const editBtn = document.createElement("button");
    editBtn.textContent = "Edit";
    editBtn.classList.add("edit-btn");
    editBtn.addEventListener('click', () => editBlog(blogId, title, content));

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.classList.add("delete-btn");
    deleteBtn.addEventListener("click", () => deleteBlog(blogId))

    buttonContainer.appendChild(editBtn);
    buttonContainer.appendChild(deleteBtn);

    divContent.appendChild(blogParagraph);
    divContent.appendChild(buttonContainer);
    return divContent;
  }
  blogContainerChecker()
}

fetchAndDisplayBlogs()

// Add or update blog
blogForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const title = blogTitle.value.trim();
  const content = blogContent.value.trim();

  if (!title || !content) return;

  if (isEditing) {
    statusImg.src = "./correct.svg"
    statusLevel.style.backgroundColor = "#00ff00"
    statusContent.textContent = `An existing blog was updated`
    statusContainer.style.display = "block"
    setTimeout(()=>{
      statusContainer.style.display = "none"
    },3500)
    await updateBlog(editingBlogId, title, content);
  } else { 
    statusImg.src = "./correct.svg"
    statusLevel.style.backgroundColor = "#00ff00"
    statusContent.textContent = `A blog was added`
    statusContainer.style.display = "block"
    setTimeout(()=>{
      statusContainer.style.display = "none"
    },3500)
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
    // blogUndo = true;
    // undoBtn.style.display = "block"
    // statusImg.src = "./correct.svg"
    // statusLevel.style.backgroundColor = "#00ff00"
    // statusContent.textContent = `Login Successful`
    // statusContainer.style.display = "block"
    // setTimeout(()=>{
      // statusContainer.style.display = "none"
    // },3500)
    const blogRef = doc(db, "users", currentUser.email, "blogs", blogId);
    // setTimeout(async () => {
      await deleteDoc(blogRef); // Wait for the document to be deleted
      fetchAndDisplayBlogs();   // Fetch and display updated blogs
    // }, 3500);
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


function blogContainerChecker() {
  const header = document.querySelector("#bloggg h2");
  if (blogList.children.length === 0) {
    header.textContent = "No blogs yet";
    header.style.fontStyle = "italic";
  } else {
    header.textContent = "Your Blogs";
    header.style.fontStyle = "normal";
  }
}

const deleteAccountBtn = document.querySelector("#delete-account") 

async function deleteAccount() {
  try {
    // Get reference to the user document
    const userRef = doc(db, "users", currentUser.username || currentUser.displayName);

    // Reference to the blogs subcollection
    const blogsCollectionRef = collection(db, "users", currentUser.email, "blogs");
    const blogsSnapshot = await getDocs(blogsCollectionRef);

    // Proceed with deletion only if blogs exist
    if (!blogsSnapshot.empty) {
      const deleteBlogPromises = blogsSnapshot.docs.map((blogDoc) =>
        deleteDoc(doc(db, "users", currentUser.email, "blogs", blogDoc.id))
      );
      await Promise.all(deleteBlogPromises);
      console.log("All blog documents deleted.");
    } else {
      console.log("No blogs found to delete.");
    }

    // Delete the user document after blogs are deleted
    await deleteDoc(userRef);

    // Optionally redirect after successful deletion
    alert("Account deleted successfully!");
    window.location.href = "./Create_Account.html";
  } catch (error) {
    alert("Error deleting account: " + error.message);
  }
}

deleteAccountBtn.addEventListener("click", ()=>{
  undoBtn.style.display = "block"
  statusImg.src = "./correct.svg"
  statusLevel.style.backgroundColor = "#00ff00"
  statusContent.textContent = `Are you sure you want to delete this Account`
  statusContainer.style.display = "block"
  setTimeout(()=>{
    statusContainer.style.display = "none"
  },3500)
  setTimeout(()=>{
    deleteAccount()
  },3500)
});




async function undo() {
  try {
    // Fetch user data from localStorage or sessionStorage
    let user = JSON.parse(localStorage.getItem("user")) || JSON.parse(sessionStorage.getItem("user"));
    if (!user) {
      alert("No user data available.");
      return;
    }

    // if (blogUndo) {
    //   // Ensure title and content are available for restoring the blog
    //   const title = blogTitle.value.trim();
    //   const content = blogContent.value.trim();
      
    //   if (title && content) {
    //     // Call addBlog function to restore the deleted blog
    //     await addBlog(title, content);
    //     blogUndo = false;
    //     undoBtn.style.display = "none"; // Hide the undo button after restoring
    //   } else {
    //     alert("Title and content are required to restore a blog.");
    //   }
    // } else {
      // Restore user data if needed
      await setDoc(doc(db, "users", currentUser.username || currentUser.displayName), { ...user });
      
      // Update localStorage and sessionStorage to reflect the restored user
      localStorage.setItem("keepLoggedIn", "yes");
      localStorage.setItem("user", JSON.stringify(user));
      sessionStorage.setItem("user", JSON.stringify(user));
    
      window.location.href = "./SiteNest.html";
    // }

    // alert("Restoration successful!");
    // undoBtn.style.display = "block"
  } catch (error) {
    alert("Error during restoration: " + error.message);
  }
}


undoBtn.addEventListener("click", undo);
