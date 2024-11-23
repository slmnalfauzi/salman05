// Simulasi database dengan JSON sederhana
const database = {
    users: JSON.parse(localStorage.getItem("users")) || [],
    tasks: JSON.parse(localStorage.getItem("tasks")) || []
};

// Register User
document.getElementById("register-form")?.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = document.getElementById("register-name").value;
    const email = document.getElementById("register-email").value;
    const password = document.getElementById("register-password").value;

    const existingUser = database.users.find(user => user.email === email);
    if (existingUser) {
        alert("Email sudah terdaftar!");
        return;
    }

    database.users.push({ name, email, password });
    localStorage.setItem("users", JSON.stringify(database.users));
    alert("Pendaftaran berhasil!");
    window.location.href = "login.html";
});

// Login User
document.getElementById("login-form")?.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = document.getElementById("login-email").value;
    const password = document.getElementById("login-password").value;

    const user = database.users.find(user => user.email === email && user.password === password);
    if (!user) {
        alert("Email atau password salah!");
        return;
    }

    localStorage.setItem("currentUser", JSON.stringify(user));
    alert("Login berhasil!");
    window.location.href = "dashboard.html";
});

// Load Current User Info
const currentUser = JSON.parse(localStorage.getItem("currentUser"));
if (currentUser && document.getElementById("user-info")) {
    document.getElementById("user-info").innerHTML = `Logged in as: ${currentUser.name}`;
}

// Fitur Jam
function updateClock() {
    const clockElement = document.getElementById("clock");
    if (clockElement) {
        const now = new Date();
        const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        clockElement.textContent = `Time: ${timeString}`;
    }
}
setInterval(updateClock, 1000); // Update setiap detik

// To-Do List CRUD
const taskForm = document.getElementById("task-form");
const taskList = document.getElementById("task-list");

function renderTasks() {
    taskList.innerHTML = "";
    database.tasks.forEach((task, index) => {
        taskList.innerHTML += `
            <tr>
                <td>${index + 1}</td>
                <td>${task.title}</td>
                <td>${task.description}</td>
                <td>${task.date}</td>
                <td>
                    <button onclick="editTask(${index})">Edit</button>
                    <button onclick="deleteTask(${index})">Delete</button>
                </td>
            </tr>
        `;
    });
}

taskForm?.addEventListener("submit", (e) => {
    e.preventDefault();
    const title = document.getElementById("task-title").value;
    const desc = document.getElementById("task-desc").value;
    const date = document.getElementById("task-date").value;

    database.tasks.push({ title, description: desc, date });
    localStorage.setItem("tasks", JSON.stringify(database.tasks));
    renderTasks();

    taskForm.reset();
});

function deleteTask(index) {
    database.tasks.splice(index, 1);
    localStorage.setItem("tasks", JSON.stringify(database.tasks));
    renderTasks();
}

function editTask(index) {
    const task = database.tasks[index];
    document.getElementById("task-title").value = task.title;
    document.getElementById("task-desc").value = task.description;
    document.getElementById("task-date").value = task.date;

    // Update task on form submission
    taskForm.onsubmit = (e) => {
        e.preventDefault();
        task.title = document.getElementById("task-title").value;
        task.description = document.getElementById("task-desc").value;
        task.date = document.getElementById("task-date").value;

        localStorage.setItem("tasks", JSON.stringify(database.tasks));
        renderTasks();

        taskForm.reset();
        taskForm.onsubmit = addTaskHandler; // Reset to default handler
    };
}

// Default handler to add a task
const addTaskHandler = (e) => {
    e.preventDefault();
    const title = document.getElementById("task-title").value;
    const desc = document.getElementById("task-desc").value;
    const date = document.getElementById("task-date").value;

    database.tasks.push({ title, description: desc, date });
    localStorage.setItem("tasks", JSON.stringify(database.tasks));
    renderTasks();

    taskForm.reset();
};
if (taskForm) taskForm.onsubmit = addTaskHandler;

// Initial Render
if (taskList) renderTasks();
