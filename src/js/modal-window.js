import { nanoid } from "nanoid";
import { initializeApp } from "firebase/app";
// import { firebaseConfig } from "./firebaseConfig";
import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
} from "firebase/auth";
import { getDatabase, get, set, update, ref, push, child } from "firebase/database";
import Notiflix from "notiflix";

const rawData = [
    { id: nanoid(), name: "Yu Soroka", number: "111-11-11" },
    { id: nanoid(), name: "Yurii Soroka", number: "111-11-11" },
    { id: nanoid(), name: "Yur Soroa", number: "111-11-11" },
    { id: nanoid(), name: "Yrii Soka", number: "111-11-11" },
];

const refs = {
    loginBtn: document.querySelector(".login-button"),
    signinBtn: document.querySelector(".signin-button"),
    closeModalBtn: document.querySelector("[data-modal-close]"),
    modal: document.querySelector("[data-modal]"),
    modalSubmitBtn: document.querySelector(".modal-window__button"),
    modalForm: document.querySelector(".modal-window__form"),
    logOffBtn: document.querySelector(".logoff-button"),
    writeBtn: document.querySelector(".write-button"),
    readBtn: document.querySelector(".read-button"),
};

refs.loginBtn.addEventListener("click", () =>
    authorizationFormChanger("login")
);
refs.signinBtn.addEventListener("click", () =>
    authorizationFormChanger("signin")
);
refs.closeModalBtn.addEventListener("click", onCloseModal);
refs.logOffBtn.addEventListener("click", logOff);
refs.writeBtn.addEventListener("click", () => writeUserDataToDatabase(rawData));
refs.readBtn.addEventListener("click", readUserDataFromDatabase);

function onCloseModal() {
    modalToggle();
    clearEventListeners();
}

// функція змінює імя кнопки сабиіту та ставить слухач з відповідною функцією
function authorizationFormChanger(trigger) {
    if (trigger === "signin") {
        refs.modalForm.addEventListener("submit", registerSubmitHandler);
        refs.modalSubmitBtn.textContent = "Register";
    } else if (trigger === "login") {
        refs.modalForm.addEventListener("submit", loginSubmitHandler);
        refs.modalSubmitBtn.textContent = "Login";
    }
    modalToggle();
}

function modalToggle() {
    refs.modal.classList.toggle("modal-hidden");
}

function clearEventListeners() {
    refs.modalForm.removeEventListener("submit", registerSubmitHandler);
    refs.modalForm.removeEventListener("submit", loginSubmitHandler);
}

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

// ініціалізація додатку, авторизації, та бази даних firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const database = getDatabase(app);

const currentDate = new Date();

// функція реєстрації
function registerSubmitHandler(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const login = form.elements.login.value;
    const password = form.elements.password.value;

    createUserWithEmailAndPassword(auth, login, password)
        .then(userCredential => {
            const user = userCredential.user;

            set(ref(database, "users/" + user.uid), {
                email: login,
                registerDate: currentDate.toLocaleString(),
                queue: [],
                watched: [],
            })
                .then(() => {
                    Notiflix.Notify.success("Реєстрація успішна");
                    form.reset();
                    modalToggle();
                    clearEventListeners();
                })
                .catch(error => {
                    Notiflix.Notify.failure(
                        `Помилка реєстрації ${error.message}`
                    );
                });
        })
        .catch(error => {
            const errorMessage = error.message;
            Notiflix.Notify.failure(`Помилка реєстрації ${errorMessage}`);
        });
}

// функція логіну
function loginSubmitHandler(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const login = form.elements.login.value;
    const password = form.elements.password.value;

    signInWithEmailAndPassword(auth, login, password)
        .then(userCredential => {
            const user = userCredential.user;
            // додати або оновити властивість lastLoginDate в конкретного користувача
            update(ref(database, "users/" + user.uid), {
                lastLoginDate: currentDate.toLocaleString(),
            })
                .then(() => {
                    Notiflix.Notify.success("Авторизація успішна");
                    form.reset();
                    modalToggle();
                    clearEventListeners();
                })
                .catch(error => {
                    Notiflix.Notify.failure(`Помилка входу ${error.message}`);
                });
        })
        .catch(error => {
            const errorMessage = error.message;
            Notiflix.Notify.failure(`Помилка входу ${errorMessage}`);
        });
}

function logOff() {
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

function writeUserDataToDatabase() {
    const userId = auth.currentUser.uid;
    const queueArray = ref(database, `users/${userId}/queue`);
    const newArrayItem = push(queueArray);
    set(newArrayItem, { id: nanoid(), name: "rii Soka", number: "511-11-11" });
}

function readUserDataFromDatabase() {
    const userId = auth.currentUser.uid;
    const dbRef = ref(database);
    const newArray = [];
    get(child(dbRef, `users/${userId}/queue`))
        .then(snapshot => {
            if (snapshot.exists()) {
                const results = snapshot.val();
                console.log(results);
                // console.log(typeof(snapshot.val()));
                // console.log(Array.from(snapshot.val().values()));
            } else {
                console.log("No data available");
            }
        })
        .catch(error => {
            Notiflix.Notify.warning(
                `Виникли проблеми при читанні бази данних: ${error.message}`
            );
        });
}

// # Запис кожного об'єкту масиву окремо
// ref = db.reference('/path/to/array')
// array = [{'name': 'John', 'age': 25}, {'name': 'Jane', 'age': 30}]
// for item in array:
//     ref.push().set(item)

// export function writeUserDataToDatabase(data) {
//     const userId = auth.currentUser.uid;
//     const postListRef = ref(database, "users/" + userId);
//     const newPostRef = push(postListRef);
//     set(newPostRef, {
//         queue: data
//     })
// }
