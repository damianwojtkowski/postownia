(function () {
  var request = new XMLHttpRequest();
  request.onload = function (data) {
    var table = document.createElement('table');
    var posts = JSON.parse(data.currentTarget.response).posts;
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
      table.appendChild(row);
    }
    document.body.appendChild(table);
  };
  request.open('GET', '/api/posts', true);
  request.send();
})();
