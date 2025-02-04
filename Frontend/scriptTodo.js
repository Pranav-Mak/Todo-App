const API_URL = 'http://localhost:3000';
const url = `${API_URL}/todo`; 

// Check if the user is logged in by checking the presence of the token in cookies
function checkAuth() {
    const token = document.cookie.split(';').find(row => row.trim().startsWith('token='));
    if (!token) {
        window.location.href = 'index.html'; // If no token, redirect to login
    }
}

// Function to fetch all todos
/*async function fetchTodos() {
    checkAuth(); // Check if the user is authenticated

    const response = await fetch(API_URL + '/todo/bulk', {
        method: 'GET',
        credentials: 'include', // Include cookies for authentication
    });

    if (response.ok) {
        const todos = await response.json();
        displayTodos(todos);
    } else {
        alert("Error fetching todos");
    }
}

// Function to display all todos
function displayTodos(todos) {
    const todosListDiv = document.getElementById('todosList');
    todosListDiv.innerHTML = ''; // Clear the list before displaying

    todos.forEach(todo => {
        const todoDiv = document.createElement('div');
        todoDiv.classList.add('todo-item');
        todoDiv.innerHTML = `
            <strong>${todo.title}</strong><br>
            ${todo.description}
            <button onclick="deleteTodo(${todo.id})">Delete</button>
        `;
        todosListDiv.appendChild(todoDiv);
    });
}*/

// Function to create a new todo
async function createTodo() {
    //checkAuth(); // Check if the user is authenticated

    const title = document.getElementById('todoTitle').value;
    const description = document.getElementById('todoDescription').value;
    console.log('Cookies:', document.cookie);  // Check if the token is there


    if (!title || !description) {
        alert("Title and description are required");
        return;
    }

    const todoData = { title, description };

    console.log("Sending data to the server:", todoData); // Log the data you're sending to the server

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',// Include cookies for authentication
        body: JSON.stringify(todoData)
        
    });

    try {
        if (response.ok) {
            alert("Todo created successfully");
            //fetchTodos(); // Refresh the todos list
        } else {
            const errorResponse = await response.json();  // Try to parse JSON
            console.log("Error response from server:", errorResponse);
            alert(`Error creating todo: ${errorResponse.error || 'Unknown error'}`);
        }
    } catch (error) {
        alert("An error occurred while creating the todo: " + error.message);
    }
}


// Function to edit an existing todo
/*async function editTodo() {
    checkAuth(); // Check if the user is authenticated

    const id = document.getElementById('editTodoId').value;
    const title = document.getElementById('editTodoTitle').value;
    const description = document.getElementById('editTodoDescription').value;

    if (!id || !title || !description) {
        alert("ID, title, and description are required");
        return;
    }

    const response = await fetch(API_URL, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include', // Include cookies for authentication
        body: JSON.stringify({ id, title, description })
    });

    if (response.ok) {
        alert("Todo updated successfully");
        fetchTodos(); // Refresh the todos list
    } else {
        alert("Error updating todo");
    }
}

// Function to delete a todo
async function deleteTodo(id) {
    checkAuth(); // Check if the user is authenticated

    const response = await fetch(API_URL + id, {
        method: 'DELETE',
        credentials: 'include', // Include cookies for authentication
    });

    if (response.ok) {
        alert("Todo deleted successfully");
        fetchTodos(); // Refresh the todos list
    } else {
        alert("Error deleting todo");
    }
}*/

// Function to handle logout
document.getElementById('logoutButton').addEventListener('click', async function () {
    // Clear the JWT token cookie
    document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC"; // Remove the token cookie

    // Redirect to the login page (index.html)
    window.location.href = 'index.html';
});

// Initial fetch of todos
//fetchTodos();
