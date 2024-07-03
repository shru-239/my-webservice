$(document).ready(function() {
  const socket = io();

  // Function to fetch and display user list
  function fetchUserList() {
    $.ajax({
      url: '/users',
      type: 'GET',
      success: function(users) {
        console.log('Received user list:', users);

        const tbody = $('#userTable tbody');
        tbody.empty();

        users.forEach(function(user) {
          const row = `<tr>
            <td>${user.email}</td>
            <td>${user.firstName} ${user.lastName}</td>
            <td><button class="showDetailsBtn" data-email="${user.email}">Show Details</button></td>
          </tr>`;
          tbody.append(row);
        });
      },
      error: function(error) {
        console.error('Error fetching user list:', error);
        alert('Error fetching user list. Please try again.');
      }
    });
  }

  // Initial fetch of user list when the page loads
  fetchUserList();

  // Event listener for showing user details
  $(document).on('click', '.showDetailsBtn', function() {
    const email = $(this).data('email');
    console.log('Fetching details for email:', email);

    $.ajax({
      url: `/users/${email}`,
      type: 'GET',
      success: function(user) {
        alert(`
          First Name: ${user.firstName}
          Last Name: ${user.lastName}
          Mobile No: ${user.mobileNo}
          Address: ${user.address.street}, ${user.address.city}, ${user.address.state}, ${user.address.country}
          Login ID: ${user.loginId}
        `);
      },
      error: function(error) {
        console.error('Error fetching user details:', error);
        alert('Error fetching user details. Please try again.');
      }
    });
  });

  // Socket.io event listener for updating user list
  socket.on('updateUserList', function(users) {
    console.log('Received updated user list:', users);
    const tbody = $('#userTable tbody');
    tbody.empty();

    users.forEach(function(user) {
      const row = `<tr>
        <td>${user.email}</td>
        <td>${user.name}</td>
        <td><button class="showDetailsBtn" data-email="${user.email}">Show Details</button></td>
      </tr>`;
      tbody.append(row);
    });
  });
});
