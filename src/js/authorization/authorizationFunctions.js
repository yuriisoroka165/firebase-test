import { initializeApp } from "firebase/app";
import { firebaseConfig } from "./firebaseConfig";

import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
} from "firebase/auth";
import { getDatabase, set, update, ref, push } from "firebase/database";
import Notiflix from "notiflix";

import { modalToggle, clearEventListeners } from "../modal-window";

// ініціалізація додатку, авторизації, та бази даних firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const database = getDatabase(app);

const currentDate = new Date();

// функція реєстрації
export function registerSubmitHandler(event) {
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
export function loginSubmitHandler(event) {
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

export function logOff() {
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

export function writeUserDataToDatabase(data) {
    const userId = auth.currentUser.uid;
    update(ref(database, "users/" + userId), {
        queue: [...data],
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
