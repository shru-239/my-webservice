
// $(document).ready(function() {
//   const socket = io();

//   // Function to fetch and display users
//   function fetchAndDisplayUsers() {
//       $.ajax({
//           url: '/api/users',
//           type: 'GET',
//           success: function(users) {
//               const userDisplay = $('#userDisplay');
//               userDisplay.empty(); // Clear previous results

//               // Create the table structure
//               const table = $('<table>').addClass("table table-striped table-bordered");
//               const headerRow = $('<tr>');
//               headerRow.append($('<th>').text('Name'));
//               headerRow.append($('<th>').text('Email'));
//               headerRow.append($('<th>').text('Socket ID')); // Add Socket ID column
//               table.append(headerRow);

//               users.forEach(user => {
//                   const row = $('<tr>');
//                   const nameCell = $('<td>').text(`${user.firstName} ${user.lastName}`);
//                   const emailCell = $('<td>').text(user.emailId);
//                   const socketIdCell = $('<td>').text(user.socketId); // Add Socket ID cell

//                   // Click event to fetch user details
//                   emailCell.on('click', () => {
//                       $.ajax({
//                           url: `/api/users/${user.emailId}`,
//                           type: 'GET',
//                           success: function(userData) {
//                               showUserPopup(userData);
//                           },
//                           error: function(error) {
//                               console.error('Error fetching user details:', error);
//                               alert("Error fetching user details");
//                           }
//                       });
//                   });

//                   row.append(nameCell, emailCell, socketIdCell); // Append cells to the row
//                   table.append(row); // Append row to the table
//               });

//               userDisplay.append(table); // Append the table to the userDisplay div
//           },
//           error: function(error) {
//               console.error('Error fetching users:', error);
//               alert("Error fetching users");
//           }
//       });
//   }

//   // Function to display user details in a popup
//   function showUserPopup(userData) {
//       const modal = $('#userPopup');
//       const details = $('#userDetails');
//       details.text(JSON.stringify(userData, (key, value) => key === 'password' ? undefined : value, 2));
//       modal.show();
//   }

//   // Close the popup when the user clicks the close button
//   $('.close').on('click', function() {
//       $('#userPopup').hide();
//   });

//   // Initial fetch of users
//   fetchAndDisplayUsers();
  
// });

