import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
    import { getAuth, GoogleAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";
    import { getFirestore, doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";

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
    const email_ = document.querySelector("#user_email");
    const username_ = document.querySelector("#name");
    const sign_upBtn = document.querySelector("#sign_up");
    const sign_upGoogleBtn = document.querySelector("#sign_up-google");
    const statusContainer = document.querySelector(".status")
    const statusContent = document.querySelector(".status-content")
    const statusImg = document.querySelector(".status-img")
    const statusLevel = document.querySelector(".status-level")

    // Hash password
    function encpass() {
      return CryptoJS.SHA256(password_.value).toString(CryptoJS.enc.Base64);
    }

    // Form validation
    function validation() {
      const usernameRegex = /^[a-zA-Z0-9]{3,15}$/;
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      const passwordRegex = /^(?=.*[!@#$%^&*])(?=.*[A-Z])[A-Za-z\d!@#$%^&*]{1,6}$/;

      if (!usernameRegex.test(username_.value)) {
        statusImg.src = "./error.svg"
        statusLevel.style.backgroundColor = "red"
        statusContent.textContent = "Username must be 3-15 characters and only contain letters and numbers."
        statusContainer.style.display = "block"
        setTimeout(()=>{
          statusContainer.style.display = "none"
        },3500)
        return false;
      }
      if (!emailRegex.test(email_.value)) {
        statusImg.src = "./error.svg"
        statusLevel.style.backgroundColor = "red"
        statusContent.textContent = "Please enter a valid email address."
        statusContainer.style.display = "block"
        setTimeout(()=>{
          statusContainer.style.display = "none"
        },3500)
        return false;
      }
      if (!passwordRegex.test(password_.value)) {
        statusImg.src = "./error.svg"
        statusLevel.style.backgroundColor = "red"
        statusContent.textContent = "Password must include at least 1 uppercase letter, 1 special character, and be at most 6 characters long."
        statusContainer.style.display = "block"
        setTimeout(()=>{
          statusContainer.style.display = "none"
        },3500)
        return false;
      }
      return true;
    }

    // Add user to Firestore
    async function addUser() {
      if (!validation()) return;

      try {
        const dbRef = doc(db, "users", username_.value); // Use email as document ID
        const docSnap = await getDoc(dbRef);

        if (docSnap.exists()) {
          alert("Account already exists!");
          return;
        }

        await setDoc(dbRef, {
          email: email_.value,
          username: username_.value,
          password: encpass()
        });

        statusContainer.style.display = "block"

        clearForm();

        setTimeout(() => {
          window.location.href = "./Login.html";
        }, 3500);

      } catch (error) {
        alert(`Error: ${error.message}`);
      }
    }

    // Google Sign-In and save user info
    async function googleAllowUser() {
      try {
        const result = await signInWithPopup(auth, provider);
        const user = result.user;
        
        // Save user info to Firestore
        const dbRef = doc(db, "users", user.displayName); // Use UID as document ID
        const docSnap = await getDoc(dbRef);

        if (!docSnap.exists()) {
          await setDoc(dbRef, {
            email: user.email,
            username: user.displayName,
            photoURL: user.photoURL || ""
          });
          alert(`Welcome, ${user.displayName}! Your account has been created.`);
          login(user);
        } else {
          alert("Account already exists!");
        }
      } catch (error) {
        alert(`Error during Google Sign-In: ${error.message}`);
      }
    }

    function login(user){
      sessionStorage.setItem("user", JSON.stringify(user))
      window.location.href = "./SiteNest.html"
    }

    // Event listeners
    sign_upBtn.addEventListener("click", (event) => {
      event.preventDefault();
      addUser();
    });

    sign_upGoogleBtn.addEventListener("click", googleAllowUser);

    // Clear form inputs
    function clearForm() {
      password_.value = "";
      email_.value = "";
      username_.value = "";
    }


    // checking validation per input

const usernameRegex = /^[a-zA-Z0-9]{3,15}$/;
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const passwordRegex = /^(?=.*[!@#$%^&*])(?=.*[A-Z])[A-Za-z\d!@#$%^&*]{1,6}$/;

const usernameSignal = document.querySelector("#username-signal");
const passwordSignal = document.querySelector("#password-signal");
const emailSignal = document.querySelector("#email-signal");
const emailWarningIcon = document.querySelector("#email-warning-icon");
const passwordWarningIcon = document.querySelector("#password-warning-icon");
const usernameWarningIcon = document.querySelector("#username-warning-icon");


username_.addEventListener("focus", () => {
  usernameSignal.style.opacity = 1;
});

username_.addEventListener("keyup", () => {
  if (!usernameRegex.test(username_.value)) {
    usernameWarningIcon.src = "./error.svg";
    usernameSignal.style.color = "red";
  } else {
    usernameWarningIcon.src = "./correct.svg";
    usernameSignal.style.color = "green";
  }
});

username_.addEventListener("blur", () => {
  usernameSignal.style.opacity = 0;
});

password_.addEventListener("focus", () => {
  passwordSignal.style.opacity = 1;
});

password_.addEventListener("keyup", () => {
  if (!passwordRegex.test(password_.value)) {
    passwordWarningIcon.src = "./error.svg";
    passwordSignal.style.color = "red";
  } else {
    passwordWarningIcon.src = "./correct.svg";
    passwordSignal.style.color = "green";
  }
});

password_.addEventListener("blur", () => {
  passwordSignal.style.opacity = 0;
});

email_.addEventListener("focus", () => {
  emailSignal.style.opacity = 1;
});

email_.addEventListener("keyup", () => {
  if (!emailRegex.test(email_.value)) {
    emailWarningIcon.src = "./error.svg";
    emailSignal.style.color = "red";
  } else {
    emailWarningIcon.src = "./correct.svg";
    emailSignal.style.color = "green";
  }
});

email_.addEventListener("blur", () => {
  emailSignal.style.opacity = 0;
});

    
    
    