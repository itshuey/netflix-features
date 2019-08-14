var EXP_NETFLIX_URL = 'https://www.whats-on-netflix.com/leaving-soon/';
var TIMEOUT = 3000;

var expiringMovies = new Map();

function getQueryUrl(skip=0){
  const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  var today = new Date();
  var year = today.getFullYear();
  var month = monthNames[(today.getMonth()+parseInt(skip))%12];
  var current_url = EXP_NETFLIX_URL + 'titles-leaving-netflix-in-' + month + '-' + year + '/';
  var query_url = month + '-' + year + '/';

  return query_url;
}

function refreshTitles(){
  var mainView = document.querySelector(".mainView");
  if (mainView) checkCurrentTitles(mainView, true);
}

for (val in [0, 1]){
  chrome.runtime.sendMessage({contentScriptQuery: "queryExpDates", queryDate: getQueryUrl(val)},
    function(response) {
      expiringMovies = new Map(function*() {
        yield* expiringMovies; yield* parseResponse(response);
      }());
      refreshTitles();
  });
}
