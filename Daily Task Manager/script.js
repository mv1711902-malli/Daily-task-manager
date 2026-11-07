
// ======================================
// TO-DO LIST APPLICATION
// ======================================

// Get HTML elements
const todoForm = document.getElementById("todo-form");
const taskInput = document.getElementById("task-input");
const taskList = document.getElementById("task-list");
const taskCount = document.getElementById("task-count");
const totalCount = document.getElementById("total-count");
const emptyMessage = document.getElementById("empty-message");
const clearCompletedBtn = document.getElementById("clear-completed");
const filterButtons = document.querySelectorAll(".filter");

// Application state
let tasks = JSON.parse(localStorage.getItem("myTasks")) || [];
let currentFilter = "all";

// ======================================
// SAVE TASKS TO LOCAL STORAGE
// ======================================

function saveTasks() {
    localStorage.setItem("myTasks", JSON.stringify(tasks));
}

// ======================================
// ADD NEW TASK (CREATE)
// ======================================

todoForm.addEventListener("submit", function(event) {

    event.preventDefault();

    const taskText = taskInput.value.trim();

    if (taskText === "") {
        return;
    }

    const newTask = {
        id: Date.now().toString(),
        text: taskText,
        completed: false
    };

    tasks.push(newTask);

    saveTasks();
    renderTasks();

    taskInput.value = "";
    taskInput.focus();

});

// ======================================
// DISPLAY TASKS (READ)
// ======================================

function renderTasks() {

    taskList.innerHTML = "";

    let filteredTasks = tasks.filter(function(task) {

        if (currentFilter === "active") {
            return !task.completed;
        }

        if (currentFilter === "completed") {
            return task.completed;
        }

        return true;

    });

    filteredTasks.forEach(function(task) {

        const li = document.createElement("li");

        li.className = "task-item";

        li.dataset.id = task.id;

        if (task.completed) {
            li.classList.add("completed");
        }

        // Checkbox
        const checkbox = document.createElement("input");

        checkbox.type = "checkbox";
        checkbox.checked = task.completed;
        checkbox.dataset.action = "toggle";
        checkbox.setAttribute("aria-label", "Mark task completed");

        // Task text
        const span = document.createElement("span");

        span.className = "task-text";
        span.textContent = task.text;

        // Action buttons
        const actions = document.createElement("div");

        actions.className = "task-actions";

        const editButton = document.createElement("button");

        editButton.textContent = "Edit";
        editButton.className = "edit-btn";
        editButton.dataset.action = "edit";

        const deleteButton = document.createElement("button");

        deleteButton.textContent = "Delete";
        deleteButton.className = "delete-btn";
        deleteButton.dataset.action = "delete";

        actions.append(editButton, deleteButton);

        li.append(checkbox, span, actions);

        taskList.appendChild(li);

    });

    updateCounts();

    emptyMessage.style.display =
        filteredTasks.length === 0 ? "block" : "none";

}

// ======================================
// UPDATE TASK COUNTS
// ======================================

function updateCounts() {

    const remaining = tasks.filter(
        task => !task.completed
    ).length;

    taskCount.textContent =
        `${remaining} tasks remaining`;

    totalCount.textContent =
        `Total: ${tasks.length}`;

}

// ======================================
// UPDATE AND DELETE TASKS
// EVENT DELEGATION
// ======================================

taskList.addEventListener("click", function(event) {

    const button = event.target.closest("button");

    if (!button) return;

    const li = button.closest(".task-item");

    if (!li) return;

    const taskId = li.dataset.id;

    const action = button.dataset.action;

    if (action === "edit") {

        editTask(taskId);

    }

    if (action === "delete") {

        deleteTask(taskId);

    }

});

// ======================================
// MARK TASK AS COMPLETED
// ======================================

taskList.addEventListener("change", function(event) {

    if (event.target.dataset.action !== "toggle") {
        return;
    }

    const li = event.target.closest(".task-item");

    if (!li) return;

    const taskId = li.dataset.id;

    tasks = tasks.map(function(task) {

        if (task.id === taskId) {

            return {
                ...task,
                completed: event.target.checked
            };

        }

        return task;

    });

    saveTasks();
    renderTasks();

});

// ======================================
// EDIT TASK (UPDATE)
// ======================================

function editTask(id) {

    const task = tasks.find(
        task => task.id === id
    );

    if (!task) return;

    const updatedText = prompt(
        "Edit your task:",
        task.text
    );

    if (updatedText === null) return;

    const newText = updatedText.trim();

    if (newText === "") {
        alert("Task cannot be empty!");
        return;
    }

    tasks = tasks.map(function(item) {

        if (item.id === id) {

            return {
                ...item,
                text: newText
            };

        }

        return item;

    });

    saveTasks();
    renderTasks();

}

// ======================================
// DELETE TASK
// ======================================

function deleteTask(id) {

    const confirmDelete = confirm(
        "Are you sure you want to delete this task?"
    );

    if (!confirmDelete) return;

    tasks = tasks.filter(
        task => task.id !== id
    );

    saveTasks();
    renderTasks();

}

// ======================================
// FILTER TASKS
// ======================================

filterButtons.forEach(function(button) {

    button.addEventListener("click", function() {

        currentFilter = button.dataset.filter;

        filterButtons.forEach(function(btn) {
            btn.classList.remove("active");
        });

        button.classList.add("active");

        renderTasks();

    });

});

// ======================================
// CLEAR COMPLETED TASKS
// ======================================

clearCompletedBtn.addEventListener("click", function() {

    tasks = tasks.filter(
        task => !task.completed
    );

    saveTasks();
    renderTasks();

});

// ======================================
// INITIALIZE APPLICATION
// ======================================

renderTasks();