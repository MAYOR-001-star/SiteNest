import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
    import { getFirestore, doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";
    import { getAuth, GoogleAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";

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
    const auth = getAuth(app);
    const db = getFirestore(app);
    auth.languageCode = "en";

    const provider = new GoogleAuthProvider();

    // Select elements
    const password_ = document.querySelector("#passcode");
    const username_ = document.querySelector("#name");
    const sign_inGoogleBtn = document.querySelector("#sign_in-google");
    const sign_inBtn = document.querySelector("#sign_in");
    const statusContainer = document.querySelector(".status")
    const statusContent = document.querySelector(".status-content")
    const statusImg = document.querySelector(".status-img")
    const statusLevel = document.querySelector(".status-level")

    function decpass(passcoded) {
  // Hash the entered password and compare with stored hash
        var hashedPassword = CryptoJS.SHA256(password_.value).toString(CryptoJS.enc.Base64);
        return hashedPassword === passcoded;
    }

    function emptySpaces(str) {
        return !str || str.trim().length === 0;
    }

    async function allowUser() {
        if (emptySpaces(username_.value) || emptySpaces(password_.value)) {
          statusImg.src = "./error.svg"
              statusLevel.style.backgroundColor = "red"
              statusContent.textContent = "All fields are required."
              statusContainer.style.display = "block"
              setTimeout(()=>{
                statusContainer.style.display = "none"
              },3500)
            return;
        }

        try {
            const dbref = doc(db, "users", username_.value);
            const docSnap = await getDoc(dbref);
            if (docSnap.exists()) {              
            const storedHashedPassword = docSnap.data().password;
            
            // Compare the entered password's hash with the stored hash
            if (decpass(storedHashedPassword)) {
                login(docSnap.data());
            } else {
              statusImg.src = "./error.svg"
              statusLevel.style.backgroundColor = "red"
              statusContent.textContent = "Incorrect password or username"
              statusContainer.style.display = "block"
              setTimeout(()=>{
                statusContainer.style.display = "none"
              },3500)
            }
            } else {
              statusImg.src = "./error.svg"
              statusLevel.style.backgroundColor = "red"
              statusContent.textContent = "Account not found!"
              statusContainer.style.display = "block"
              setTimeout(()=>{
                statusContainer.style.display = "none"
              },3500)
            }
        } catch (error) {
          statusImg.src = "./error.svg"
          statusLevel.style.backgroundColor = "red"
          statusContent.textContent = `Error: ${error.message}`
          statusContainer.style.display = "block"
          setTimeout(()=>{
            statusContainer.style.display = "none"
          },3500)
        }
    }

    async function googleAllowUser() {
      try {
        const result = await signInWithPopup(auth, provider);
        const user = result.user;
        
        // Save user info to Firestore
        const dbRef = doc(db, "users", user.displayName); // Use UID as document ID
        const docSnap = await getDoc(dbRef);

        if (docSnap.exists()) {
          statusImg.src = "./correct.svg"
          statusLevel.style.backgroundColor = "#00ff00"
          statusContent.textContent = `Login Successful`
          statusContainer.style.display = "block"
          setTimeout(()=>{
            statusContainer.style.display = "none"
          },3500)
          setTimeout(()=>{
            loginGoogle(user);
          },3500)
          
        } else {
          statusImg.src = "./error.svg"
          statusLevel.style.backgroundColor = "red"
          statusContent.textContent = `Account not found!`
          statusContainer.style.display = "block"
          setTimeout(()=>{
            statusContainer.style.display = "none"
          },3500)
        }
      } catch (error) {
        statusImg.src = "./error.svg"
          statusLevel.style.backgroundColor = "red"
          statusContent.textContent = `Error during Google Sign-In: ${error.message}`
          statusContainer.style.display = "block"
          setTimeout(()=>{
            statusContainer.style.display = "none"
          },3500)
      }
    }

    function loginGoogle(user){
      sessionStorage.setItem("user", JSON.stringify(user))
      window.location.href = "./SiteNest.html";
    }

    
    
    function login(user){
      let loggedIn = document.querySelector("#still_log").checked;
      
      // Store user data based on login preference
      if (!loggedIn) {
        sessionStorage.setItem("user", JSON.stringify(user));
      } else {
        localStorage.setItem("keepLoggedIn", "yes");
        localStorage.setItem("user", JSON.stringify(user));
      }
    
      
      // Delay page navigation by 1 second
      setTimeout(() => {
        window.location.href = "./SiteNest.html";
      }, 3500);
    }
    
const checkbox = document.getElementById("still_log");
const logToggle = document.querySelector(".log-toggle");
const clicker = document.querySelector(".clicker");
const emptyBar = document.querySelector(".empty");

// Update toggle position based on checkbox state
checkbox.addEventListener("change", function () {
  if (checkbox.checked) {
    logToggle.style.left = "1rem";
  } else {
    logToggle.style.left = "0";
  }
});

// Toggle checkbox state when the clicker is clicked
clicker.addEventListener("click", () => {
  checkbox.checked = !checkbox.checked; 
  if (checkbox.checked) {
    logToggle.style.left = "1rem";
    emptyBar.style.backgroundColor = "#007bff";
    logToggle.style.backgroundColor = "white";
  } else {
    logToggle.style.left = "0";
    emptyBar.style.backgroundColor = "white";
    logToggle.style.backgroundColor = "#007bff";
  }
});



  sign_inBtn.addEventListener("click", allowUser)
  sign_inGoogleBtn.addEventListener("click", googleAllowUser);
