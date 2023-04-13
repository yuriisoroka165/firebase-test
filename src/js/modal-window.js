import { nanoid } from "nanoid";

import {
    registerSubmitHandler,
    loginSubmitHandler,
    logOff,
    writeUserDataToDatabase,
} from "./authorization/authorizationFunctions";

const rawData = [{ id: nanoid(), name: "Yurii Soroka", number: "111-11-11" }];

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

refs.loginBtn.addEventListener("click", () =>
    authorizationFormChanger("login")
);
refs.signinBtn.addEventListener("click", () =>
    authorizationFormChanger("signin")
);
refs.closeModalBtn.addEventListener("click", onCloseModal);
refs.logOffBtn.addEventListener("click", logOff);
refs.writeBtn.addEventListener("click", () => writeUserDataToDatabase(rawData));

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

export function modalToggle() {
    refs.modal.classList.toggle("modal-hidden");
}

export function clearEventListeners() {
    refs.modalForm.removeEventListener("submit", registerSubmitHandler);
    refs.modalForm.removeEventListener("submit", loginSubmitHandler);
}
