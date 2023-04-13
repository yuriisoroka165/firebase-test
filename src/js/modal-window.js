import { initializeApp } from "firebase/app";
import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
} from "firebase/auth";
import { getDatabase, set, update, ref } from "firebase/database";
import Notiflix from "notiflix";

// дані firebase
const firebaseConfig = {
    apiKey: "AIzaSyCRTPr2q4rbgHs0n3SJxofCEvC1QedTgPQ",
    authDomain: "filmoteka-ad98a.firebaseapp.com",
    databaseURL:
        "https://filmoteka-ad98a-default-rtdb.europe-west1.firebasedatabase.app/",
    projectId: "filmoteka-ad98a",
    storageBucket: "filmoteka-ad98a.appspot.com",
    messagingSenderId: "199206793785",
    appId: "1:199206793785:web:6e36302426a4d27ab093e8",
};

const lastLoginDate = new Date();

// ініціалізація додатку, авторизації, та бази даних firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const database = getDatabase(app);

const refs = {
    loginBtn: document.querySelector(".login-button"),
    signinBtn: document.querySelector(".signin-button"),
    closeModalBtn: document.querySelector("[data-modal-close]"),
    modal: document.querySelector("[data-modal]"),
    modalSubmitBtn: document.querySelector(".modal-window__button"),
    modalForm: document.querySelector(".modal-window__form"),
    logOffBtn: document.querySelector(".logoff-button"),
    writeBtn: document.querySelector(".write-button"),
};

refs.loginBtn.addEventListener("click", () => toggleModal("login"));
refs.signinBtn.addEventListener("click", () => toggleModal("signin"));
refs.closeModalBtn.addEventListener("click", onCloseModal);
refs.logOffBtn.addEventListener("click", logOff);
refs.writeBtn.addEventListener("click", () => writeUserDataToDatabase(rawData));

function onCloseModal() {
    refs.modal.classList.toggle("modal-hidden");
    refs.modalForm.removeEventListener("submit", registerSubmitHandler);
    refs.modalForm.removeEventListener("submit", loginSubmitHandler);
}

// функція показу приховування модального вікна входу
function toggleModal(trigger) {
    if (trigger === "signin") {
        refs.modalForm.addEventListener("submit", registerSubmitHandler);
        refs.modalSubmitBtn.textContent = "Register";
    } else if (trigger === "login") {
        refs.modalForm.addEventListener("submit", loginSubmitHandler);
        refs.modalSubmitBtn.textContent = "Login";
    }
    refs.modal.classList.toggle("modal-hidden");
}

// функція реєстрації
function registerSubmitHandler(event) {
    // console.log("register");
    event.preventDefault();
    const form = event.currentTarget;
    const login = form.elements.login.value;
    const password = form.elements.password.value;

    createUserWithEmailAndPassword(auth, login, password)
        .then(userCredential => {
            const user = userCredential.user;

            set(ref(database, "users/" + user.uid), {
                email: login,
                registerDate: lastLoginDate.toLocaleString(),
            })
                .then(() => {
                    Notiflix.Notify.success("Реєстрація успішна");
                    form.reset();
                    refs.modal.classList.toggle("modal-hidden");
                    refs.modalForm.removeEventListener(
                        "submit",
                        registerSubmitHandler
                    );
                })
                .catch(error => {
                    Notiflix.Notify.failure(
                        `Помилка реєстрації ${error.message}`
                    );
                });
        })
        .catch(error => {
            const errorMessage = error.message;
            Notiflix.Notify.failure(`Помилка реєстрації ${error.message}`);
        });
}

// функція логіну
function loginSubmitHandler(event) {
    console.log("login");
    console.log(auth);
    event.preventDefault();
    const form = event.currentTarget;
    const login = form.elements.login.value;
    const password = form.elements.password.value;

    signInWithEmailAndPassword(auth, login, password)
        .then(userCredential => {
            const user = userCredential.user;
            // додати або оновити властивість lastLoginDate в конкретного користувача
            update(ref(database, "users/" + user.uid), {
                lastLoginDate: lastLoginDate.toLocaleString(),
            })
                .then(() => {
                    Notiflix.Notify.success("Авторизація успішна");
                    form.reset();
                    refs.modal.classList.toggle("modal-hidden");
                    refs.modalForm.removeEventListener(
                        "submit",
                        loginSubmitHandler
                    );
                })
                .catch(error => {
                    Notiflix.Notify.failure(`Помилка входу ${error.message}`);
                });
        })
        .catch(error => {
            const errorMessage = error.message;
            Notiflix.Notify.failure(`Помилка входу ${error.message}`);
        });
}

function logOff() {
    console.log("logoff");
    console.log(auth);
    signOut(auth)
        .then(() => {
            Notiflix.Notify.warning("Авторизацію скасовано");
        })
        .catch(error => {
            Notiflix.Notify.warning(
                `Виникли проблеми при виході: ${error.message}`
            );
        });
}

const rawData = [
    { id: 0, name: "Yurii Soroka", number: "111-11-11" },
    { id: 1, name: "Maria Soroka", number: "222-22-22" },
    { id: 2, name: "Maxim Soroka", number: "333-33-33" },
];

function writeUserDataToDatabase(data) {
    const userId = auth.currentUser.uid;
    update(ref(database, "users/" + userId), {
        queue: data,
    });
}
