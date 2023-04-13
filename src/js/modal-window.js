import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { getFirestore, collection, getDocs } from "firebase/firestore/lite";

const firebaseConfig = {
    apiKey: "AIzaSyCRTPr2q4rbgHs0n3SJxofCEvC1QedTgPQ",
    authDomain: "filmoteka-ad98a.firebaseapp.com",
    projectId: "filmoteka-ad98a",
    storageBucket: "filmoteka-ad98a.appspot.com",
    messagingSenderId: "199206793785",
    appId: "1:199206793785:web:6e36302426a4d27ab093e8",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth();

const refs = {
    loginBtn: document.querySelector(".login-button"),
    signinBtn: document.querySelector(".signin-button"),
    closeModalBtn: document.querySelector("[data-modal-close]"),
    modal: document.querySelector("[data-modal]"),
    modalSubmitBtn: document.querySelector(".modal-window__button"),
    modalForm: document.querySelector(".modal-window__form"),
};

refs.loginBtn.addEventListener("click", () => toggleModal("login"));
refs.signinBtn.addEventListener("click", () => toggleModal("signin"));
refs.closeModalBtn.addEventListener("click", toggleModal);
refs.modalForm.addEventListener("submit", formSubmitHandler);

function toggleModal(trigger) {
    if (trigger === "signin") {
        refs.modalSubmitBtn.textContent = "Register";
    } else if (trigger === "login") {
        refs.modalSubmitBtn.textContent = "Login";
    }
    refs.modal.classList.toggle("modal-hidden");
}

function formSubmitHandler(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const login = form.elements.login.value;
    const password = form.elements.password.value;

    createUserWithEmailAndPassword(auth, login, password)
        .then(userCredential => {
            const user = userCredential.user;
            alert("Реєстрація успішна");
            form.reset();
            refs.modal.classList.toggle("modal-hidden");
        })
        .catch(error => {
            const errorCode = error.code;
            const errorMessage = error.message;
            alert(errorMessage);
        });
}
