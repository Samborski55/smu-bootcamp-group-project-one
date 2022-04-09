
// var searchedStockEl = document.getElementById("#searched-stock");
searchedStockEl = document.querySelector("#searched-stock");
var trendingStockEl = document.querySelector("#trending-stock");
var searchButtonEl = document.querySelector("#search-btn");
var apiKey = "gApT0eMTmmV7JFtKP2TjPCOFsxH7d2lBKwuPhEi5"

var stockData = function (searchedStockEl) {
    var apiUrl = "https://api.stockdata.org/v1/data/quote?symbols=" + searchedStockEl + "&api_token=" + apiKey;

    fetch(apiUrl)
    .then(function(response) {
        if(response.ok) {
            response.json().then(function(data) {
                console.log(data);
            });
        };
    });
};
//Pull top 25 stocks by weekly mentions
var getReddit = function() {
    var options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Host': 'wallstreetbets.p.rapidapi.com',
            'X-RapidAPI-Key': 'febae9e70dmshf9e7e9305b18ebap18ce14jsn3c2ef979b41e'
        }
    };
    fetch('https://wallstreetbets.p.rapidapi.com/?date=this_week&page=1', options)
        .then(function(response) {
            if(response.ok) {
                response.json().then(function(data) {
                    for (var i = 0; i < 26; i++) {
                        var redditStockName = document.createElement("li");
                        var mentions = document.createElement("span");
                        mentions.textContent = "Weekly Mentions: " + data.wsb_stocks[i].mentions;
                        var ticker = document.createElement("span");
                        ticker.textContent = "Stock Name: " + data.wsb_stocks[i].ticker + " ";
                        trendingStockEl.append(redditStockName);
                        redditStockName.appendChild(ticker);
                        redditStockName.appendChild(mentions);
                    }
                });
            };
        });
};

var buttonClickHandler = function(event) {
    var searchedStock = searchedStockEl.value.trim();
    stockData(searchedStock);
};

searchButtonEl.addEventListener("click", buttonClickHandler);

//Need to make links for trending stocks searchable

getReddit();