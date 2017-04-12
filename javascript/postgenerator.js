(function () {
  var request = new XMLHttpRequest();
  function loadData(data) {
    window.postownia = {};
    document.querySelector('.posts').innerHTML = '';
    document.querySelector('.editpost').innerHTML = '';
    var adminPermission = 'admin';
    var table = document.createElement('table');
    var posts = JSON.parse(data.currentTarget.response);
    var nickValue = document.querySelector('#nickname').value;
    var permissionsRequest = new XMLHttpRequest();
    permissionsRequest.open('GET', '/permissions', false);
    permissionsRequest.onload = function (data) {
      var permissions = JSON.parse(data.currentTarget.response);
      window.postownia.userPermission = permissions[nickValue];
      console.log('User permission in onload: ' + window.postownia.userPermission);
    }
    permissionsRequest.send();
    console.log('User permission out of function: ' + window.postownia.userPermission);
    console.log(adminPermission);
    for (var i = 0, j = posts.length; i < j; i++) {
      var row = document.createElement('tr');
      var cellUser = document.createElement('td');
      cellUser.innerText = posts[i].user;
      row.appendChild(cellUser);
      var cellPostDate = document.createElement('td');
      cellPostDate.innerText = posts[i].postdate;
      row.appendChild(cellPostDate);
      var cellContent = document.createElement('td');
      cellContent.innerText = posts[i].content;
      row.appendChild(cellContent);
      if (nickValue === posts[i].user || window.postownia.userPermission === adminPermission) {
        var cellDeleteButton = document.createElement('td');
        var deleteButton = document.createElement('BUTTON');
        deleteButton.innerText = 'Delete';
        deleteButton.style.width = '60px';
        deleteButton.style.height = '20px';
        deleteButton.id = posts[i].postid;
        deleteButton.type = 'submit';
        cellDeleteButton.appendChild(deleteButton);
        deleteButton.onclick = function () {
          var deleteRequest = new XMLHttpRequest();
          var buttonID = this.id;
          deleteRequest.open('DELETE', '/api/deletepost/' + nickValue + '/' + buttonID, true);
          deleteRequest.onload = loadData;
          deleteRequest.send();
        }
      }
      if (nickValue === posts[i].user) {
        var cellEditButton = document.createElement('td');
        var editButton = document.createElement('BUTTON');
        editButton.innerText = 'Edit';
        editButton.style.width = '60px';
        editButton.style.height = '20px';
        editButton.id = posts[i].postid;
        editButton.type = 'submit';
        editButton.onclick = function () {
          var editTextArea = document.createElement('textarea');
          editTextArea.rows = 4;
          editTextArea.cols = 50;
          editTextArea.name = 'editComment';
          document.querySelector('.editpost').appendChild(editTextArea);
          var loadEditCommentRequest = new XMLHttpRequest();
          var editCommentID = this.id;
          var submitEditButton = document.createElement('BUTTON');
          loadEditCommentRequest.open('GET', '/api/loadeditcomment/' + nickValue + '/' + editCommentID);
          loadEditCommentRequest.onload = function (data) {
            response = JSON.parse(data.currentTarget.response);
            editTextArea.innerText = response.comment;
            submitEditButton.id = response.postID;
          }
          loadEditCommentRequest.send();
          submitEditButton.innerText = 'Send';
          submitEditButton.style.width = '60px';
          submitEditButton.style.height = '20px';
          submitEditButton.type = 'submit';
          submitEditButton.onclick = function () {
            var editRequest = new XMLHttpRequest();
            var editID = this.id;
            var editedPost = editTextArea.value;
            editRequest.open('POST', '/api/editpost/' + nickValue + '/' + editID + '/' + editedPost);
            editRequest.onload = loadData;
            editRequest.send();
          }
          document.querySelector('.editpost').appendChild(submitEditButton);
        }
        cellEditButton.appendChild(editButton);
      }
      if (nickValue === posts[i].user) {
        row.appendChild(cellEditButton);
      } else {
        var emptyCell = document.createElement('td');
        row.appendChild(emptyCell);
      }
      if (nickValue === posts[i].user || window.postownia.userPermission === adminPermission) {
        row.appendChild(cellDeleteButton);
      }

      table.appendChild(row);
    }
    document.querySelector('.posts').appendChild(table);
  };
  request.onload = loadData;
  request.open('GET', '/api/posts', true);
  request.send();
})();
