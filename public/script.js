$(document).ready(function() {
  const socket = io();

  // Form submission
  $('#userForm').submit(function(event) {
      event.preventDefault();

      const formData = {
          firstName: $('#firstName').val(),
          lastName: $('#lastName').val(),
          mobileNo: $('#mobileNo').val(),
          emailId: $('#emailId').val(),
          address: {
              street: $('#street').val(),
              city: $('#city').val(),
              state: $('#state').val(),
              country: $('#country').val()
          },
          loginId: $('#loginId').val(),
          password: $('#password').val()
      };

      $.ajax({
          url: '/api/users',
          type: 'POST',
          contentType: 'application/json',
          data: JSON.stringify(formData),
          success: function(response) {
              console.log('User created:', response);
              localStorage.setItem('userData', JSON.stringify(response));
                $('#userForm').trigger('reset');
                alert("User Created successfully")
                window.location.href = 'user-list.html'; 
            },
            error: function(error) {
                console.error('Error creating user:', error);
                alert("Error creating user")
            }
        });
    });

    // Receive live user updates
    socket.on('updateLiveUsers', (users) => {
        const userDisplay = $('#userDisplay');
        userDisplay.empty(); 

        // Create the table structure
        const table = $('<table>').addClass("table table-striped table-bordered");
        const headerRow = $('<tr>');
        headerRow.append($('<th>').text('Name'));
        headerRow.append($('<th>').text('Email'));
        headerRow.append($('<th>').text('Socket ID')); 
        table.append(headerRow);

        users.forEach(user => {
            const row = $('<tr>');
            const nameCell = $('<td>').text(`${user.firstName} ${user.lastName}`);
            const emailCell = $('<td>').text(user.emailId);
            const socketIdCell = $('<td>').text(user.socketId); 

            // Click event to fetch user details
            row.on('click', () => {
                $.ajax({
                    url: `/api/users/${user.emailId}`, 
                    type: 'GET',
                    success: function(userData) {
                        showUserPopup(userData); 
                    },
                    error: function(error) {
                        console.error('Error fetching user details:', error);
                        alert("Error fetching user details")
                    }
                });
            });

            row.append(nameCell, emailCell, socketIdCell); 
            table.append(row); 
        });

        userDisplay.append(table); 
    });

    // Function to display user details in a popup
    function showUserPopup(userData) {
        const modal = $('#userModal');
        const modalBody = $('#modalBody');
        modalBody.empty();

        // Create elements to display user details
        for (const key in userData) {
            if (userData.hasOwnProperty(key) && key !== '_id' && key !== '__v' && key !== 'password' && key !== 'socketId' ) {
                if (key == 'address') {
                    const addressDetails = userData[key];
                    for (const addressKey in addressDetails) {
                        if (addressDetails.hasOwnProperty(addressKey)) {
                            modalBody.append($('<p>').text(`${addressKey}: ${addressDetails[addressKey]}`));
                        }
                    }
                }
                else {
                    modalBody.append($('<p>').text(`${key}: ${userData[key]}`));
                }
            }
        }

        modal.show(); // Show the modal
    
        // Close button functionality
        $('.close-button').click(function() {
            modal.hide();
        });
    }

    // Disconnect button click handler (on live_users.html)
    $('#disconnectButton').click(function() {
        socket.emit('disconnectUser'); 
        window.location.href = 'index.html'; 
    });


    // Reconnect user after page load (on live_users.html)
    socket.on('connect', () => {
        const storedUserData = JSON.parse(localStorage.getItem('userData'));
        if (storedUserData && window.location.pathname === '/user-list.html') {
            socket.emit('reconnectUser', storedUserData); 
            localStorage.removeItem('userData');
        }
    });


    function showUserPopup(userData) {
        // ... Create and display a modal or popup with userData ...
        alert(JSON.stringify(userData, null, 4)) // This is to just give an idea, you will have to create modal here
    }


    // Initial fetch of users
    if (window.location.pathname === '/user-list.html') {
        fetchAndDisplayUsers(); 
    }
});
  