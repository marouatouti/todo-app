lucide.createIcons();

const openButton = document.getElementById("open-create-task");
const closeButton = document.getElementById("close-create-task");
const cancelButton = document.getElementById("cancel-create-task");

const overlay = document.getElementById("create-task-overlay");
const drawer = document.getElementById("create-task-drawer");

function openDrawer() {
    overlay.classList.remove("hidden");
    drawer.classList.remove("hidden");
}

function closeDrawer() {
    overlay.classList.add("hidden");
    drawer.classList.add("hidden");
}

openButton.addEventListener("click", openDrawer);

closeButton.addEventListener("click", closeDrawer);

cancelButton.addEventListener("click", closeDrawer);

overlay.addEventListener("click", closeDrawer);

