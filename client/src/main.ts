import { io } from "socket.io-client";

const socket = io("http://localhost:3000");

const messages = document.getElementById("messages") as HTMLUListElement | null;
if (!messages) throw new Error("Messages list not found");

const form = document.getElementById("form") as HTMLFormElement | null;
if (!form) throw new Error("Form not found");

const input = document.getElementById("input") as HTMLInputElement | null;
if (!input) throw new Error("Input not found");

const nameDialog = document.getElementById(
  "name-dialog"
) as HTMLDialogElement | null;
if (!nameDialog) throw new Error("Name dialog not found");

nameDialog.showModal();

const nameForm = document.getElementById("name-form") as HTMLFormElement | null;
if (!nameForm) throw new Error("Name form not found");

const nameInput = document.getElementById("name") as HTMLInputElement | null;
if (!nameInput) throw new Error("Name input not found");

const roomButtons = document.querySelectorAll(
  "#rooms > button"
) as NodeListOf<HTMLButtonElement>;
if (roomButtons.length === 0) throw new Error("No room buttons found");

let userName: string | undefined;

nameForm.addEventListener("submit", function (e) {
  e.preventDefault();
  if (nameInput.value) {
    userName = nameInput.value;
    nameDialog.close();
    roomButtons.forEach((button) => {
      button.style.display = "inline-block";
    });
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

  if (input.value) {
    socket.emit("chat message", {
      name: userName,
      room: currentRoom,
      message: input.value,
    });
    input.value = "";
  }
});

socket.on("chat message", function (msg) {
  let item = document.createElement("li");
  item.textContent = msg;
  messages.appendChild(item);
  window.scrollTo(0, document.body.scrollHeight);
});
