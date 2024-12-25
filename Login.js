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
            alert("All fields are required.");
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
                alert("Incorrect password or username");
            }
            } else {
            alert("Account not found");
            }
        } catch (error) {
            alert(`Error: ${error.message}`);
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
          loginGoogle(user);
        } else {
          alert("Account not found!");
        }
      } catch (error) {
        alert(`Error during Google Sign-In: ${error.message}`);
      }
    }

    function loginGoogle(user){
      sessionStorage.setItem("user", JSON.stringify(user))
      window.location.href = "./SiteNest.html"
    }

    function login(user){
        let loggedIn = document.querySelector("#still_log").checked;
        if(!loggedIn){
            sessionStorage.setItem("user", JSON.stringify(user))
            window.location.href = "./SiteNest.html"
        }else{
            localStorage.setItem("keepLoggedIn", "yes")
            localStorage.setItem("user", JSON.stringify(user))
            window.location.href = "./SiteNest.html"
        }
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
  