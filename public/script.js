// Load all users from database
function loadUsers() {
    fetch("/users")
        .then(res => res.json())
        .then(users => {
            const table = document.getElementById("userTable");
            table.innerHTML = "";

            users.forEach((u, index) => {
                table.innerHTML += `
                <tr>
                    <td>${index + 1}</td>   <!-- Serial Number -->
                    <td>${u.name}</td>
                    <td>${u.email}</td>
                    <td>
                        <button class="btn btn-warning btn-sm me-4"
                        onclick="editUser(${u.id}, '${u.name}', '${u.email}')">
                            Edit
                        </button>
                        <button class="btn btn-danger btn-sm"
                        onclick="deleteUser(${u.id})">
                            Delete
                        </button>
                    </td>
                </tr>`;
            });
        });
}

// Create or Update user
function saveUser() {
    const id = document.getElementById("userId").value;
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;

    if (!name || !email) {
        alert("Please fill all fields");
        return;
    }

    const method = id ? "PUT" : "POST";
    const url = id ? `/users/${id}` : "/users";

    fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email })
    }).then(() => {
        document.getElementById("userId").value = "";
        document.getElementById("name").value = "";
        document.getElementById("email").value = "";
        loadUsers();
    });
}

// Fill form for editing
function editUser(id, name, email) {
    document.getElementById("userId").value = id;
    document.getElementById("name").value = name;
    document.getElementById("email").value = email;
}

// Delete single user
function deleteUser(id) {
    if (confirm("Delete this user?")) {
        fetch(`/users/${id}`, { method: "DELETE" })
            .then(() => loadUsers());
    }
}

// Delete all users
function deleteAllUsers() {
    if (confirm("Are you sure you want to delete ALL users?")) {
        fetch("/users", { method: "DELETE" })
            .then(() => loadUsers());
    }
}

// Load users on page load
loadUsers();
