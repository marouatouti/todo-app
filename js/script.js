lucide.createIcons();

const openButton = document.getElementById("open-create-task");
const closeButton = document.getElementById("close-create-task");
const cancelButton = document.getElementById("cancel-create-task");

const overlay = document.getElementById("create-task-overlay");
const drawer = document.getElementById("create-task-drawer");
const form = drawer.querySelector("form");
const drawerTitle = document.getElementById("create-task-title");
const submitButton = form.querySelector('button[type="submit"]');
let editingIndex = null;
const tasksList = document.getElementById("tasks-list");
const emptyState = document.getElementById("empty-state");
const deleteAllButton = document.getElementById("delete-all-tasks");
const deleteAllDialog = document.getElementById("delete-all-dialog");
const detailsDialog = document.getElementById("task-details");
const taskTable = tasksList.querySelector("div");
const filterButtons = document.querySelectorAll('nav[aria-label="Filtrer les tâches"] button');
const searchInput = document.querySelector('input[type="search"]');
const noResults = document.createElement("p");
noResults.className = "hidden px-4 py-12 text-center text-sm text-gray-500";
noResults.setAttribute("role", "status");
noResults.textContent = "Aucune tâche ne correspond à ta recherche ou à ce filtre.";
taskTable.after(noResults);
let activeFilter = "all";
const summary = tasksList.querySelectorAll("footer span:not([aria-hidden])");
const storageKey = "todo-app-tasks-v2";
const template = taskTable.querySelector("article").cloneNode(true);
const priorities = { Basse: "low", Moyenne: "medium", Haute: "high" };
const exampleTasks = Array.from(taskTable.querySelectorAll("article"), (article) => ({
    title: article.querySelector("h2").textContent.trim(),
    description: article.querySelector("p").textContent.trim(),
    date: article.querySelector("time").dateTime,
    priority: priorities[article.children[2].textContent.trim()] || "",
    completed: article.querySelector('input[type="checkbox"]').checked
}));
let savedTasks = exampleTasks;

try {
    const stored = localStorage.getItem(storageKey);
    if (stored !== null) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) savedTasks = parsed;
    } else {
        const previous = JSON.parse(localStorage.getItem("todo-app-tasks") || "[]");
        if (Array.isArray(previous)) savedTasks = [...exampleTasks, ...previous];
    }
} catch (error) {
    console.warn("Impossible de charger les tâches enregistrées.", error);
}

function openDrawer() {
    editingIndex = null;
    form.reset();
    drawerTitle.textContent = "Nouvelle tâche";
    submitButton.textContent = "Créer la tâche";
    overlay.classList.remove("hidden");
    drawer.classList.remove("hidden");
}

function editTask(index) {
    openDrawer();
    editingIndex = index;
    const task = savedTasks[index];
    form.elements.title.value = task.title;
    form.elements.description.value = task.description;
    form.elements.date.value = task.date;
    form.elements.priority.value = task.priority;
    drawerTitle.textContent = "Modifier la tâche";
    submitButton.textContent = "Enregistrer";
    form.elements.title.focus();
}

function closeDrawer() {
    overlay.classList.add("hidden");
    drawer.classList.add("hidden");
}

openButton.addEventListener("click", openDrawer);

closeButton.addEventListener("click", closeDrawer);

cancelButton.addEventListener("click", closeDrawer);

overlay.addEventListener("click", closeDrawer);
emptyState.querySelector("button").addEventListener("click", openDrawer);

document.addEventListener("click", (event) => {
    if (!event.target.closest('[aria-haspopup="menu"]') && !event.target.closest('[role="menu"]')) {
        taskTable.querySelectorAll('[role="menu"]').forEach((menu) => menu.classList.add("hidden"));
    }
});

function addTaskToList({ title, description, date, priority, completed }, index) {
    const task = template.cloneNode(true);
    const checkbox = task.querySelector('input[type="checkbox"]');
    const priorityLabels = { low: "Basse", medium: "Moyenne", high: "Haute" };
    const priorityClasses = {
        low: "inline-flex items-center rounded-md bg-gray-100 px-3 py-1 text-sm text-gray-500",
        medium: "inline-flex items-center rounded-md bg-blue-50 px-3 py-1 text-sm text-blue-600",
        high: "inline-flex items-center rounded-md bg-red-50 px-3 py-1 text-sm text-danger"
    };

    task.querySelector("h2").textContent = title;
    task.querySelector("p").textContent = description;
    checkbox.checked = Boolean(completed);
    checkbox.setAttribute("aria-label", completed ? `Marquer ${title} comme à faire` : `Marquer ${title} comme terminée`);
    task.querySelector('button[aria-haspopup="menu"]').setAttribute("aria-label", `Actions pour ${title}`);
    const menuButton = task.querySelector('button[aria-haspopup="menu"]');
    const menu = task.querySelector('[role="menu"]');
    menuButton.addEventListener("click", () => {
        const wasHidden = menu.classList.contains("hidden");
        taskTable.querySelectorAll('[role="menu"]').forEach((other) => other.classList.add("hidden"));
        menu.classList.toggle("hidden", !wasHidden);
    });
    const menuItems = menu.querySelectorAll('[role="menuitem"]');
    menuItems[0].addEventListener("click", () => {
        document.getElementById("details-title").textContent = title;
        document.getElementById("details-description").textContent = description || "Aucune description";
        document.getElementById("details-date").textContent = time.textContent;
        document.getElementById("details-priority").textContent = priorityLabels[priority] || "Non définie";
        document.getElementById("details-status").textContent = completed ? "Terminée" : "À faire";
        menu.classList.add("hidden");
        detailsDialog.showModal();
    });
    menuItems[2].lastChild.textContent = completed ? " Marquer comme à faire" : " Marquer comme terminée";
    menuItems[2].addEventListener("click", () => checkbox.click());
    menu.querySelectorAll('[role="menuitem"]')[1].addEventListener("click", () => {
        menu.classList.add("hidden");
        editTask(index);
    });
    menu.querySelectorAll('[role="menuitem"]')[3].addEventListener("click", () => {
        const updatedTasks = savedTasks.filter((item, i) => i !== index);
        try {
            localStorage.setItem(storageKey, JSON.stringify(updatedTasks));
            savedTasks = updatedTasks;
            renderTasks();
        } catch (error) {
            alert("La tâche n'a pas pu être supprimée du navigateur.");
        }
    });

    const time = task.querySelector("time");
    time.dateTime = date;
    time.textContent = date
        ? new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" }).format(new Date(`${date}T00:00:00Z`))
        : "Sans date";

    const priorityBadge = task.children[2].querySelector("span");
    priorityBadge.textContent = priorityLabels[priority] || "Non définie";
    priorityBadge.className = priorityClasses[priority] || priorityClasses.low;

    const status = task.children[3].querySelector("span");
    status.textContent = completed ? "Terminée" : "À faire";
    status.className = completed
        ? "inline-block rounded-md bg-green-50 px-3 py-1 text-sm text-success"
        : "inline-block rounded-md bg-gray-100 px-3 py-1 text-sm text-gray-500";

    checkbox.addEventListener("change", () => {
        const updatedTasks = savedTasks.map((item, i) => i === index ? { ...item, completed: checkbox.checked } : item);
        try {
            localStorage.setItem(storageKey, JSON.stringify(updatedTasks));
            savedTasks = updatedTasks;
            renderTasks();
        } catch (error) {
            checkbox.checked = !checkbox.checked;
            alert("Le statut n'a pas pu être enregistré dans le navigateur.");
        }
    });

    taskTable.appendChild(task);
}

function renderTasks() {
    taskTable.querySelectorAll("article").forEach((task) => task.remove());
    const search = searchInput.value.trim().toLocaleLowerCase("fr");
    let visibleCount = 0;
    savedTasks.forEach((task, index) => {
        const matchesFilter = activeFilter === "all"
            || (activeFilter === "todo" && !task.completed)
            || (activeFilter === "done" && task.completed);
        const matchesSearch = `${task.title} ${task.description}`.toLocaleLowerCase("fr").includes(search);
        if (matchesFilter && matchesSearch) {
            addTaskToList(task, index);
            visibleCount++;
        }
    });
    const total = savedTasks.length;
    noResults.classList.toggle("hidden", total === 0 || visibleCount > 0);
    taskTable.classList.toggle("hidden", visibleCount === 0);
    tasksList.classList.toggle("hidden", total === 0);
    emptyState.classList.toggle("hidden", total !== 0);
    emptyState.classList.toggle("flex", total === 0);
    const completed = savedTasks.filter((task) => task.completed).length;
    const remaining = total - completed;
    filterButtons[0].textContent = `Toutes (${total})`;
    filterButtons[1].textContent = `À faire (${remaining})`;
    filterButtons[2].textContent = `Terminées (${completed})`;
    summary[0].textContent = `${total} tâches au total`;
    summary[1].textContent = `${remaining} à faire`;
    summary[2].textContent = `${completed} terminée${completed > 1 ? "s" : ""}`;
}

filterButtons.forEach((button, index) => {
    button.addEventListener("click", () => {
        activeFilter = ["all", "todo", "done"][index];
        filterButtons.forEach((filterButton, filterIndex) => {
            const active = filterIndex === index;
            filterButton.classList.toggle("bg-primary", active);
            filterButton.classList.toggle("text-white", active);
            filterButton.classList.toggle("bg-gray-50", !active);
            filterButton.setAttribute("aria-pressed", String(active));
        });
        renderTasks();
    });
    button.setAttribute("aria-pressed", String(index === 0));
});
searchInput.addEventListener("input", renderTasks);

deleteAllButton.addEventListener("click", () => deleteAllDialog.showModal());
document.getElementById("cancel-delete-all").addEventListener("click", () => deleteAllDialog.close());
document.getElementById("confirm-delete-all").addEventListener("click", () => {

    try {
        localStorage.setItem(storageKey, JSON.stringify([]));
        savedTasks = [];
    } catch (error) {
        alert("Les tâches n'ont pas pu être supprimées du navigateur.");
        return;
    }

    deleteAllDialog.close();
    searchInput.value = "";
    filterButtons[0].click();
});

renderTasks();

form.addEventListener("submit", (event) => {
    event.preventDefault();

    const title = form.elements.title.value.trim();
    if (!title) {
        form.elements.title.focus();
        return;
    }

    const task = {
        title,
        description: form.elements.description.value.trim(),
        date: form.elements.date.value,
        priority: form.elements.priority.value,
        completed: editingIndex === null ? false : Boolean(savedTasks[editingIndex].completed)
    };

    try {
        const updatedTasks = editingIndex === null
            ? [...savedTasks, task]
            : savedTasks.map((item, index) => index === editingIndex ? task : item);
        localStorage.setItem(storageKey, JSON.stringify(updatedTasks));
        savedTasks = updatedTasks;
    } catch (error) {
        alert("La tâche n'a pas pu être enregistrée dans le navigateur.");
        return;
    }

    renderTasks();

    form.reset();
    closeDrawer();
});

