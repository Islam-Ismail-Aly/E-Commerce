// Assuming you have included SweetAlert in your project

function validateLogin() {
    
    var usernameInput = document.getElementById('username');
    var passwordInput = document.getElementById('password');
    var username = usernameInput.value;
    var password = passwordInput.value;

   // Simple validation, replace with your authentication logic
   if (username === 'islam' && password === 'is123456') 
   {
       swal({
           title: "Login Successful!",
           text: "Redirecting to the index page...",
           icon: "success",
           timer: 2000,  // Adjust the timer as needed
           buttons: false
       });

       // Redirect to another page or perform additional actions
       setTimeout(function () {
           window.location.href = 'index.html';
       }, 2000);  // Adjust the delay as needed
   } 
   else {
       swal({
           title: "Invalid Login",
           text: "Please try again with correct username and password.",
           icon: "error",
           timer: 2000,
           buttons: false
       });
       usernameInput.value = '';
       passwordInput.value = '';
   }
}
