(function () {
  var request = new XMLHttpRequest();
  function loadData(data) {
    var table = document.createElement('table');
    var posts = JSON.parse(data.currentTarget.response);
    var nickValue = document.querySelector('#nickname').value;
    for (var i = 0, j = posts.length; i < j; i++){
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
      if (nickValue === posts[i].user){
        var cellDeleteButton = document.createElement('td');
        var deleteButton = document.createElement('BUTTON');
        deleteButton.innerText = 'Delete';
        deleteButton.style.width = '60px';
        deleteButton.style.height = '20px';
        deleteButton.id = posts[i].postid;
        deleteButton.type = 'submit';
        deleteButton.onclick = function () {
          document.querySelector('.posts').innerHTML = '';
          var deleteRequest = new XMLHttpRequest();
          var buttonID = this.id;
          deleteRequest.open('DELETE', '/api/deletepost/' + nickValue + '/' + buttonID, true);
          deleteRequest.onload = loadData;
          deleteRequest.send();
        }
        cellDeleteButton.appendChild(deleteButton);
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
