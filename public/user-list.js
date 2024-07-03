$(document).ready(function() {
  const socket = io();

  socket.on('connect', function() {
    console.log('Connected to server');
  });

  socket.on('updateUserList', function(users) {
    console.log('Received user list:', users);

    const tbody = $('#userTable tbody');
    tbody.empty();
    users.forEach(function(user) {
      const row = `<tr>
        <td class="clickable" data-email="${user.email}">${user.email}</td>
        <td>${user.name}</td>
        <td>${user.socketId}</td>
      </tr>`;
      tbody.append(row);
    });

    $('.clickable').click(function() {
      const email = $(this).data('email');
      $.ajax({
        url: '/users/' + email,
        type: 'GET',
        success: function(user) {
          alert(`
            First Name: ${user.firstName}
            Last Name: ${user.lastName}
            Mobile No: ${user.mobileNo}
            Email: ${user.email}
            Address: ${user.address.street}, ${user.address.city}, ${user.address.state}, ${user.address.country}
            Login ID: ${user.loginId}
            Creation Time: ${new Date(user.creationTime).toLocaleString()}
            Last Updated On: ${new Date(user.lastUpdatedOn).toLocaleString()}
          `);
        },
        error: function(error) {
          alert('Error fetching user details: ' + error.responseText);
        }
      });
    });
  });
});


  // $(document).ready(function() {
  //   const socket = io();

  //   socket.on('updateUserList', (users) => {
  //     console.log('Received user list:', users); // Log received user list

  //     const tbody = $('#userTable tbody');
  //     tbody.empty();
  //     users.forEach((user) => {
  //       const row = `<tr>
  //         <td class="clickable" onclick="showUserInfo('${user.email}')">${user.email}</td>
  //         <td>${user.name}</td>
  //         <td>${user.socketId}</td>
  //       </tr>`;
  //       tbody.append(row);
  //     });
  //   });

  //   function showUserInfo(email) {
  //     $.ajax({
  //       url: `/users/${email}`,
  //       type: 'GET',
  //       success: function(user) {
  //         alert(`
  //           First Name: ${user.firstName}
  //           Last Name: ${user.lastName}
  //           Mobile No: ${user.mobileNo}
  //           Email: ${user.email}
  //           Address: ${user.address.street}, ${user.address.city}, ${user.address.state}, ${user.address.country}
  //           Login ID: ${user.loginId}
  //           Creation Time: ${new Date(user.creationTime).toLocaleString()}
  //           Last Updated On: ${new Date(user.lastUpdatedOn).toLocaleString()}
  //         `);
  //       },
  //       error: function(error) {
  //         alert('Error fetching user info: ' + error.responseText);
  //       }
  //     });
  //   }
  // })