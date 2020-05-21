chrome.storage.onChanged.addListener(function(changes, namespace) {
    for (var key in changes) {
      createTable(JSON.parse(changes[key].newValue));
    }
});

function buildTable() {
  chrome.storage.local.get(function(data) {
    var info = JSON.parse(data['expiringMovies']);
    createTable(info);
  });
}

function createTable(info) {
  var table = document.getElementById("info");
  var today = new Date();
  var day = today.getDate();
  var month = today.getMonth()+1;
  var index = 0;

  for (var i = 0; i < info.length; i++) {
    var item = info[i];
    var exp = extractDate(item[1]);

    // ignore past expiration dates
    if (exp.month < month || (exp.month == month && exp.day < day)) continue;

    var row = table.insertRow(index++);
    var cell1 = row.insertCell(0);
    var cell2 = row.insertCell(1);

    cell1.innerHTML = item[0];
    cell2.innerHTML = exp.month + "/" + exp.day;
    cell2.className = "date";
  }
}

const monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"];

function extractDate(date) {
  var space = date.indexOf(' ');
  var month = monthNames.indexOf(date.substring(0, space)) + 1;
  var day = date.match(/\d+/g)[0];
  return {"month": month, "day": day};
}

buildTable();




