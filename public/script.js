$(document).ready(function() {
  const socket = io();

  $('#userForm').submit(function(event) {
    event.preventDefault();

    // Clear previous errors
    $('.error').text('');

    const user = {
      firstName: $('#firstName').val(),
      lastName: $('#lastName').val(),
      mobileNo: $('#mobileNo').val(),
      email: $('#email').val(),
      address: {
        street: $('#street').val(),
        city: $('#city').val(),
        state: $('#state').val(),
        country: $('#country').val()
      },
      loginId: $('#loginId').val(),
      password: $('#password').val()
    };

    let hasError = false;

    // Validation
    if (!user.firstName) {
      $('#firstNameError').text('First name is required.');
      hasError = true;
    }
    if (!user.lastName) {
      $('#lastNameError').text('Last name is required.');
      hasError = true;
    }
    if (!user.mobileNo.match(/^\d{10}$/)) {
      $('#mobileNoError').text('Mobile number must be 10 digits.');
      hasError = true;
    }
    if (!user.email.match(/^\S+@\S+\.\S+$/)) {
      $('#emailError').text('Invalid email address.');
      hasError = true;
    }
    if (!user.address.street) {
      $('#streetError').text('Street is required.');
      hasError = true;
    }
    if (!user.address.city) {
      $('#cityError').text('City is required.');
      hasError = true;
    }
    if (!user.address.state) {
      $('#stateError').text('State is required.');
      hasError = true;
    }
    if (!user.address.country) {
      $('#countryError').text('Country is required.');
      hasError = true;
    }
    if (!user.loginId.match(/^[a-zA-Z0-9]{8}$/)) {
      $('#loginIdError').text('Login ID must be 8 alphanumeric characters.');
      hasError = true;
    }
    if (!user.password.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\W).{6,}$/)) {
      $('#passwordError').text('Password must be at least 6 characters, include 1 uppercase letter, 1 lowercase letter, and 1 special character.');
      hasError = true;
    }

    if (!hasError) {
      $.ajax({
        url: '/users',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(user),
        success: function(response) {
          console.log('User saved successfully:', response);
          alert('User saved successfully!');
          socket.emit('joinRoom', { email: user.email, name: `${user.firstName} ${user.lastName}` });
          // socket.emit('joinRoom', { email: user.email, name: user.firstName + ' ' + user.lastName });
          $('#userForm')[0].reset(); // Reset form after successful submission
        },
        error: function(error) {
          console.error('Error saving user:', error);
          alert('Error saving user: ' + error.responseText);
        }
      });
    }
  });
});