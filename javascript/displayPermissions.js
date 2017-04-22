(function () {
  var request = new XMLHttpRequest();
  function loadPermissions(data){
    document.querySelector('.permissionsarea').innerHTML = '';
    var table = document.createElement('table');
    var permissions = JSON.parse(data.currentTarget.response);
    var nickValue = document.getElementById('nickname').getAttribute('value');
    for (var key in permissions) {
      var row = document.createElement('tr');
      var cellUser = document.createElement('td');
      cellUser.innerText = key;
      row.appendChild(cellUser);
      var cellPermission = document.createElement('td');
      cellPermission.innerText = permissions[key];
      row.appendChild(cellPermission);
      if (nickValue !== key) {
        var cellButton = document.createElement('td');
        var changeButton = document.createElement('BUTTON');
        changeButton.innerText = 'Change';
        changeButton.style.width = '60px';
        changeButton.style.height = '20px';
        changeButton.id = key;
        changeButton.type = 'submit';
        changeButton.onclick = function () {
          var changePermissionsRequest = new XMLHttpRequest();
          var changeButtonName = this.id;
          changePermissionsRequest.open('POST', '/changepermissions/' + changeButtonName + '/' + nickValue, true);
          changePermissionsRequest.onload = loadPermissions;
          changePermissionsRequest.send();
        }
        cellButton.appendChild(changeButton);
        row.appendChild(cellButton);
      }
      table.appendChild(row);
    }
    document.querySelector('.permissionsarea').appendChild(table);
  }
  request.onload = loadPermissions;
  request.open('GET', '/permissions', true);
  request.send();
})();
