var EXP_NETFLIX_URL = 'https://www.whats-on-netflix.com/leaving-soon/';
var TIMEOUT = 3000;

// already instantiated in contentScript
if (!expiringMovies) var expiringMovies = new Map();
const monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"];

function getQueryUrl(skip=0){
  var today = new Date();
  var year = today.getFullYear();
  var month = monthNames[(today.getMonth()+parseInt(skip))%12];

  var query_url = EXP_NETFLIX_URL + 'titles-leaving-netflix-in-' + month + '-' + year + '/';
  return query_url;
}

function refreshTitles() {
  var mainView = document.querySelector(".mainView");
  if (mainView) checkCurrentTitles(mainView, true);
}

function updateLocalStorage(data) {
  var expData = JSON.stringify([...data]);
  chrome.storage.local.set({"expiringMovies": expData}, function() {
    console.log('Local storage is set to ' + expData);
  });
}

for (val in [0, 1]){
  chrome.runtime.sendMessage({contentScriptQuery: "queryExpDates", queryURL: getQueryUrl(val)},
    function(response) {
      expiringMovies = new Map(function*() {
        yield* expiringMovies; yield* parseResponse(response);
      }());
      updateLocalStorage(expiringMovies);
      refreshTitles();
  });
}
