import { signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-auth.js";
import { doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js";
import { auth, db } from "./firebase-config.js";

const loginOverlay = document.getElementById('loginOverlay');
const loginBtn = document.getElementById('loginBtn');
const loginForm = document.getElementById('loginForm');

// Observer to check if user is logged in
onAuthStateChanged(auth, (user) => {
    if (user) {
        // User is signed in, hide login screen
        loginOverlay.style.display = 'none';
        console.log("Admin Logged In:", user.email);
        
        // Fetch current Firestore data and populate forms
        loadContent();
        
    } else {
        // No user is signed in, enforce login screen
        loginOverlay.style.display = 'flex';
        console.log("Admin logged out.");
    }
});

// Handle Login Form Submission
if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        const originalBtnText = loginBtn.innerHTML;
        
        loginBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Authenticating...';
        loginBtn.disabled = true;

        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Success - the onAuthStateChanged will hide the overlay
                loginForm.reset();
            })
            .catch((error) => {
                const errorCode = error.code;
                if (errorCode === 'auth/invalid-credential' || errorCode === 'auth/user-not-found' || errorCode === 'auth/wrong-password') {
                    alert("Invalid Admin Email or Password! (Did you create this user in your Firebase Console?)");
                } else {
                    alert("Login Error: " + error.message);
                }
            })
            .finally(() => {
                loginBtn.innerHTML = originalBtnText;
                loginBtn.disabled = false;
            });
    });
}

// Handle Logout
const logoutBtn = document.getElementById('logoutBtn');
if (logoutBtn) {
    logoutBtn.addEventListener('click', (e) => {
        e.preventDefault();
        signOut(auth).then(() => {
            // Sign-out successful - onAuthStateChanged will show overlay
            alert("Securely logged out.");
        }).catch((error) => {
            console.error("Logout Error", error);
        });
    });
}

// ---------------------------------------------
// FIRESTORE READ & WRITE LOGIC
// ---------------------------------------------

const contentDocRef = doc(db, "portfolio", "content");

// Load content from Database into Admin Forms
async function loadContent() {
    try {
        const docSnap = await getDoc(contentDocRef);
        if (docSnap.exists()) {
            const data = docSnap.data();
            
            // Hero & About
            document.getElementById('cms-first-name').value = data.firstName || '';
            document.getElementById('cms-last-name').value = data.lastName || '';
            document.getElementById('cms-titles').value = data.titles || '';
            document.getElementById('cms-cv-link').value = data.cvLink || '';
            document.getElementById('cms-exp-years').value = data.expYears || '';
            document.getElementById('cms-bio').value = data.bio || '';
            
            // Experience 1
            if (data.exp1) {
                document.getElementById('cms-exp1-title').value = data.exp1.title || '';
                document.getElementById('cms-exp1-date').value = data.exp1.date || '';
                document.getElementById('cms-exp1-company').value = data.exp1.company || '';
                document.getElementById('cms-exp1-desc').value = data.exp1.desc || '';
            }
            // Experience 2
            if (data.exp2) {
                document.getElementById('cms-exp2-title').value = data.exp2.title || '';
                document.getElementById('cms-exp2-date').value = data.exp2.date || '';
                document.getElementById('cms-exp2-company').value = data.exp2.company || '';
                document.getElementById('cms-exp2-desc').value = data.exp2.desc || '';
            }
            
            // Certifications
            document.getElementById('cms-certifications').value = data.certifications || '';
            
            console.log("Admin Dashboard Loaded latest DB data.");
        } else {
            console.log("No previous data found. Form remains blank (first time setup).");
        }
    } catch (error) {
        console.error("Error loading data:", error);
    }
}

// Save all content from Admin Forms to Database
const globalSaveBtn = document.getElementById('globalSaveBtn');
if (globalSaveBtn) {
    globalSaveBtn.addEventListener('click', async () => {
        const originalBtnText = globalSaveBtn.innerHTML;
        globalSaveBtn.innerHTML = '<span class="spinner-border spinner-border-sm"></span> Saving...';
        globalSaveBtn.disabled = true;

        const payload = {
            firstName: document.getElementById('cms-first-name').value,
            lastName: document.getElementById('cms-last-name').value,
            titles: document.getElementById('cms-titles').value,
            cvLink: document.getElementById('cms-cv-link').value,
            expYears: document.getElementById('cms-exp-years').value,
            bio: document.getElementById('cms-bio').value,
            exp1: {
                title: document.getElementById('cms-exp1-title').value,
                date: document.getElementById('cms-exp1-date').value,
                company: document.getElementById('cms-exp1-company').value,
                desc: document.getElementById('cms-exp1-desc').value
            },
            exp2: {
                title: document.getElementById('cms-exp2-title').value,
                date: document.getElementById('cms-exp2-date').value,
                company: document.getElementById('cms-exp2-company').value,
                desc: document.getElementById('cms-exp2-desc').value
            },
            certifications: document.getElementById('cms-certifications').value
        };

        try {
            await setDoc(contentDocRef, payload);
            
            const alertBox = document.getElementById('saveAlert');
            alertBox.classList.remove('d-none');
            setTimeout(() => { alertBox.classList.add('d-none'); }, 3000);
            
        } catch (error) {
            console.error("Error saving data:", error);
            alert("Error saving data. Make sure database rules allow writing.");
        } finally {
            globalSaveBtn.innerHTML = originalBtnText;
            globalSaveBtn.disabled = false;
        }
    });
}
