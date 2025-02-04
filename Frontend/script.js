const API_URL = 'http://localhost:3000'; // Update this with your backend API URL

// Handle login
document.getElementById('loginForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;

    const response = await fetch(API_URL + '/user/sigin', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ username, password }),
    });

    if (response.ok) {
        const data = await response.json();
        document.cookie = `token=${data.token}; path=/;`; // Store the JWT token in cookies
        console.log("Token saved in cookies:", document.cookie);
        alert('Login successful!');
        window.location.href = 'indexTodo.html'; // Redirect to the Todo page
    } else {
        alert('Invalid credentials!');
    }
});

// Handle signup
document.getElementById('signupForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const username = document.getElementById('signupUsername').value;
    const password = document.getElementById('signupPassword').value;
    const firstname = document.getElementById('signupfirstname').value;
    const lastname = document.getElementById('signuplastname').value;

    const response = await fetch(API_URL + '/user/signup', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password, firstname, lastname }),
    });

    if (response.ok) {
        alert('Signup successful! Please log in.');
    } else {
        alert('Signup failed!');
    }
});

// Handle logout
document.getElementById('logoutButton').addEventListener('click', async function () {
    document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC"; // Remove the JWT token
    window.location.href = 'index.html'; // Redirect to login page
    
});
