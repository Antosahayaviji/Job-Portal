function handleLogin(event) {
    event.preventDefault(); // Prevent form submission
    
    // Get the username and password values
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Show login successful alert
    alert('Login successful!');

    // Ask to save credentials
    const saveCredentials = confirm('Do you want to save your username and password?');
    
    if (saveCredentials) {
        // Save to localStorage (this is just for demonstration - not secure for real passwords)
        localStorage.setItem('savedUsername', username);
        localStorage.setItem('savedPassword', password);
        alert('Credentials saved successfully!');
    }

    return false; // Prevent form submission
}

// Function to clear the form
function clearForm() {
    document.getElementById('username').value = '';
    document.getElementById('password').value = '';
}

// Function to show forgot password modal
function showForgotPassword() {
    const modal = document.getElementById('forgotPasswordModal');
    modal.style.display = 'block';
}

// Function to close forgot password modal
function closeForgotPassword() {
    const modal = document.getElementById('forgotPasswordModal');
    modal.style.display = 'none';
}

// Function to handle password reset
function handleResetPassword(event) {
    event.preventDefault();
    const email = document.getElementById('resetEmail').value;
    const newPassword = document.getElementById('newPassword').value;
    
    // Here you would typically make an API call to handle the password reset
    alert('Password reset link has been sent to your email: ' + email);
    
    // Clear the form and close the modal
    document.getElementById('resetEmail').value = '';
    document.getElementById('newPassword').value = '';
    closeForgotPassword();
    
    return false;
}