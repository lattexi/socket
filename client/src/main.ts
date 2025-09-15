import CryptoJS from "crypto-js";
import { io } from "socket.io-client";

const socket = io(undefined, { path: "/socket.io" });

const messages = document.getElementById("messages") as HTMLUListElement;
const form = document.getElementById("form") as HTMLFormElement;
const input = document.getElementById("input") as HTMLInputElement;
const nameDialog = document.getElementById("name-dialog") as HTMLDialogElement;

nameDialog.showModal();

const nameForm = document.getElementById("name-form") as HTMLFormElement;
const nameInput = document.getElementById("name") as HTMLInputElement;
const roomButtons = document.querySelectorAll(
  "#rooms > button"
) as NodeListOf<HTMLButtonElement>;
const encryptionKeyInput = document.getElementById(
  "encryption-key"
) as HTMLInputElement;

let userName: string | undefined;

nameForm.addEventListener("submit", function (e) {
  e.preventDefault();
  if (nameInput.value) {
    userName = nameInput.value;
    nameDialog.close();
    roomButtons.forEach((button) => {
      button.style.display = "inline-block";
    });
    encryptionKeyInput.style.display = "block";
  }
});

let currentRoom: string | null = null;

roomButtons.forEach((button) => {
  button.addEventListener("click", () => {
    socket.emit("join room", { room: button.id, name: userName });
    console.log(button.id);
    currentRoom = button.id;
    roomButtons.forEach((btn) => {
      if (btn.id == button.id) {
        btn.style.background = "blue";
      } else {
        btn.style.background = "";
      }
    });
  });
});

form.addEventListener("submit", function (e) {
  e.preventDefault();
  console.log(currentRoom);
  if (!currentRoom) {
    alert("Please select a room first");
    return;
  }
  let item = document.createElement("li");
  item.textContent = userName + ": " + input.value;
  messages.appendChild(item);

  const encryptedMessage = CryptoJS.AES.encrypt(
    input.value,
    encryptionKeyInput.value
  ).toString();

  if (input.value) {
    socket.emit("chat message", {
      name: userName,
      room: currentRoom,
      message: encryptedMessage,
    });
    input.value = "";
  }
});

socket.on("chat message", function (msg) {
  const bytes = CryptoJS.AES.decrypt(msg.message, encryptionKeyInput.value);
  const decrypted = bytes.toString(CryptoJS.enc.Utf8);
  if (!decrypted) {
    return;
  }

  let item = document.createElement("li");
  const text = msg.name + ": " + decrypted;
  item.textContent = text;
  messages.appendChild(item);
  window.scrollTo(0, document.body.scrollHeight);
});
