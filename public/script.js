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
    if (!user.loginId) {
      $('#loginIdError').text('Login ID is required.');
      hasError = true;
    }
    if (!user.password) {
      $('#passwordError').text('Password is required.');
      hasError = true;
    }

    if (hasError) {
      return;
    }

    // Submit form data to the server
    $.ajax({
      url: '/users',
      type: 'POST',
      contentType: 'application/json',
      data: JSON.stringify(user),
      success: function(response) {
        // Redirect to user list page upon successful registration
        window.location.href = '/user-list.html';
      },
      error: function(xhr, status, error) {
        const errorMessage = xhr.responseText || 'An error occurred. Please try again.';
        alert(errorMessage);
      }
    });
  });
});
