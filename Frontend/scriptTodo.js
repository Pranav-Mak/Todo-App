const API_URL = 'http://localhost:3000';
const url = `${API_URL}/todo`; 



// Function to CREATE NEW TODO //////////////
async function createTodo() {
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


// Function to FETCH ALL TODOS //////////////////
async function fetchTodos() {
    const response = await fetch(url + '/bulk', {
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
}


// Function to EDIT A TODO /////////////////////
async function editTodo() {
    const id = document.getElementById('editTodoId').value;
    const title = document.getElementById('editTodoTitle').value;
    const description = document.getElementById('editTodoDescription').value;

    if (!id || !title || !description) {
        alert("ID, title, and description are required");
        return;
    }
    const response = await fetch(url , {
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


// Function to DELETE A TODO/////////////////
async function deleteTodo(id) {
    const response = await fetch(url + '/id', {
        method: 'DELETE',
        credentials: 'include', // Include cookies for authentication
    });
    if (response.ok) {
        alert("Todo deleted successfully");
        fetchTodos(); // Refresh the todos list
    } else {
        alert("Error deleting todo");
    }
}


// Function to handle LOGOUT////////////////////////
document.getElementById('logoutButton').addEventListener('click', async function () {
    // Clear the JWT token cookie
    document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC";
    window.location.href = 'index.html';
});
