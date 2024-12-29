// import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
// import { getFirestore, doc, getDoc, setDoc, addDoc, collection, getDocs, updateDoc, deleteDoc } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";

// const firebaseConfig = {
//   apiKey: "AIzaSyDpbbUqwhYv9b4IWlE-D60hzwGCsa16nXA",
//   authDomain: "sitenest-318b4.firebaseapp.com",
//   projectId: "sitenest-318b4",
//   storageBucket: "sitenest-318b4.appspot.com",
//   messagingSenderId: "464415746140",
//   appId: "1:464415746140:web:00391c12212d034e56de99"
// };

// // Initialize Firebase and Firestore
// const app = initializeApp(firebaseConfig);
// const db = getFirestore();

// // Select elements
// const sign_outBtn = document.querySelector("#sign_out");
// const userlink = document.querySelector("#userlink");
// const blogForm = document.querySelector("#blog-form");
// const blogTitle = document.querySelector("#blog-title");
// const blogContent = document.querySelector("#blog-content");
// const blogList = document.querySelector("#blog-list");
// const loader = document.querySelector(".loader");
// const container = document.querySelector(".container");
// const totalCharacter = document.querySelector(".total-character-left");

// let currentUser = null;
// let isEditing = false;  // Flag to check if the user is editing a blog
// let editingBlogId = null;  // To store the ID of the blog being edited

// window.addEventListener("load", () => {
//   loader.classList.add("fadeOut");
//   container.classList.add("fadeIn");
// });

// // Login function to determine if user is logged in
// function login() {
//   if (localStorage.getItem("keepLoggedIn") === "yes" && localStorage.getItem("user")) {
//     currentUser = JSON.parse(localStorage.getItem("user"));
//   } else if (sessionStorage.getItem("user")) {
//     currentUser = JSON.parse(sessionStorage.getItem("user"));
//   }
// }

// // Sign-out function
// function signOut() {
//   localStorage.removeItem("user");
//   localStorage.removeItem("keepLoggedIn");
//   sessionStorage.removeItem("user");
//   window.location.href = "./Login.html";
// }

// // Fetch and display blogs
// async function fetchAndDisplayBlogs() {
//   if (!currentUser || !currentUser.email) return;

//   blogList.innerHTML = ""; // Clear the list

//   const blogsCollectionRef = collection(db, "users", currentUser.email, "blogs");
//   const querySnapshot = await getDocs(blogsCollectionRef);

//   querySnapshot.forEach((doc) => {
//     const blog = doc.data();
//     const blogId = doc.id;  // Get blog document ID

//     // Create the blog post structure
//     const divHeader = createHeader(blog.title, blogId);
//     const divContent = createContent(blog.title, blog.content, blogId);

//     // Append elements to the blog list
//     blogList.appendChild(divHeader);
//     blogList.appendChild(divContent);
//   });

//   // Function to create header (title + lock icon)
//   function createHeader(title) {
//     const divHeader = document.createElement("div");
//     divHeader.classList.add("list");

//     const titleParagraph = document.createElement("p");
//     titleParagraph.classList.add("title-paragraph");
//     titleParagraph.textContent = title;

//     const openContainer = document.createElement("div");
//     const lockIcon = document.createElement("img");
//     lockIcon.src = "./lock.svg";
//     lockIcon.alt = "icon";
//     lockIcon.classList.add("blog-padlock");
//     openContainer.appendChild(lockIcon);

//     divHeader.appendChild(titleParagraph);
//     divHeader.appendChild(openContainer);
//     return divHeader;
//   }

//   // Function to create content (blog content + buttons)
//   function createContent(title, content, blogId) {
//     const divContent = document.createElement("div");

//     const blogParagraph = document.createElement("p");
//     blogParagraph.classList.add("blog-paragraph");
//     blogParagraph.textContent = content;

//     const buttonContainer = document.createElement("div");
//     buttonContainer.classList.add("buttonss");

//     const editButton = document.createElement("button");
//     editButton.textContent = "Edit";
//     const deleteButton = document.createElement("button");
//     deleteButton.textContent = "Delete";
//     deleteButton.classList.add("deleteBtns");
//     editButton.classList.add("editBtn");

//     // Attach event listeners to buttons
//     editButton.addEventListener("click", () => {
//       blogTitle.value = title;
//       blogContent.value = content;
//       blogTitle.focus()
//       isEditing = true;
//       document.querySelector("#blog-btn").textContent = "Update blog"
//       editingBlogId = blogId;
//     });

//     deleteButton.addEventListener("click", async () => {
//       if (confirm("Are you sure you want to delete this blog?")) {
//         const blogDocRef = doc(db, "users", currentUser.email, "blogs", blogId);
//         await deleteDoc(blogDocRef);
//         alert("Blog deleted successfully!");
//         await fetchAndDisplayBlogs();  // Refresh the list after deletion
//       }
//     });

//     buttonContainer.appendChild(editButton);
//     buttonContainer.appendChild(deleteButton);
//     divContent.appendChild(blogParagraph);
//     divContent.appendChild(buttonContainer);
    
//     return divContent;
//   }
// }

// // Add or edit blog
// blogForm.addEventListener("submit", async (event) => {
//   event.preventDefault();
//   try {
//     const email = currentUser.email;
//     const title = blogTitle.value.trim();
//     const content = blogContent.value.trim();

//     if (!title || !content) {
//       alert("All fields must be filled!");
//       return;
//     }

//     const blogsCollectionRef = collection(db, "users", email, "blogs");
//     const querySnapshot = await getDocs(blogsCollectionRef);
    

//     // Check for duplicate title if it's not in edit mode
//     if (!isEditing) {
//       document.querySelector("#blog-btn").textContent = "Add blog"
//       const duplicate = querySnapshot.docs.find(
//           (doc) => doc.data().title.toLowerCase() === title.toLowerCase()
//       );

//       if (duplicate) {
//           alert("A blog with the same title already exists! Please use a different title.");
//           return;
//       }

//       // Add new blog
//         await addDoc(blogsCollectionRef, {
//             title,
//             content,
//             createdAt: new Date(),
//         });

//         alert("Blog added successfully!");
//     } else {
//         // Update existing blog
//         // document.querySelector("#blog-btn").textContent = "Update blog"
//         const blogDocRef = doc(db, "users", currentUser.email, "blogs", editingBlogId);
//         await updateDoc(blogDocRef, {
//             title,
//             content,
//             updatedAt: new Date(),
//         });

//         alert("Blog updated successfully!");
//         isEditing = false; // Reset flag
//         editingBlogId = null; // Reset blog ID
//         }

//         blogForm.reset(); // Clear form
//         await fetchAndDisplayBlogs(); // Refresh blogs
//     } catch (error) {
//         console.error("Error saving blog:", error);
//         alert(`Error: ${error.message}`);
//     }
//     });

// // Ensure DOM is fully loaded before running the script
// document.addEventListener("DOMContentLoaded", async () => {
//     login();
//     if (currentUser === null) {
//         userlink.textContent = "Please login";
//         blogForm.style.display = "none";
//         document.querySelector("#bloggg").style.display = "none";
//         sign_outBtn.style.display = "none";
//     } else {
//         userlink.textContent = `Welcome, ${currentUser.displayName || currentUser.username}`;
//         blogForm.style.display = "block";
//         document.querySelector("#bloggg").style.display = "flex";
//         sign_outBtn.style.display = "block";
//         await fetchAndDisplayBlogs();
//     }
// });

// sign_outBtn.addEventListener("click", signOut);

// function blogCharacter() {
//     totalCharacter.textContent = blogContent.maxLength - blogContent.value.length;
//     if (totalCharacter.textContent <= 10) {
//         document.querySelector(".text-checker").style.color = "red";
//     } else {
//         document.querySelector(".text-checker").style.color = "black";
//     }
// }

// blogCharacter();

// blogContent.addEventListener("keyup", () => {
//     if (blogContent && totalCharacter) {
//         blogCharacter();
//         document.querySelector("#blog-btn").disabled = false;
//     } else {
//         document.querySelector("#blog-btn").disabled = true;
//     }
// }); 


// function changer() {
//     const changerContainer = document.querySelector(".changer");
//     const changerContent = ["Anywhere", "Anytime", "Anyday", "Anyhow"];

//     let characterchanger = 0;
//     let changerContentSample = 0;

//     function update() {
//         changerContainer.textContent = changerContent[changerContentSample].slice(0, characterchanger);
//         characterchanger++;

//         if (characterchanger === changerContent[changerContentSample].length) {
//             characterchanger = 0;
//             changerContentSample++;
//         }

//         if (changerContentSample >= changerContent.length) {
//             characterchanger = 0;
//             changerContentSample = 0;
//         }
//     }

//     setInterval(update, 400);
// }
// changer();






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
  login();  // Check login status on load
  // if (isEditing) {
  //   document.querySelector("#blog-btn").textContent = "Update blog"
  // } else {
  //   document.querySelector("#blog-btn").textContent = "Add blog"
  // }
  // fetchAndDisplayBlogs();  // Fetch and display blogs on page load
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
  const changerContent = ["Anywhere", "Anytime", "Anyday", "Anyhow"];

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