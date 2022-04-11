
var searchedStockEl = document.querySelector("#searched-stock");
var trendingStockEl = document.querySelector("#trending-stock");
var searchButtonEl = document.querySelector("#search-btn");
var stockInfoEl = document.querySelector("#stock-info");
var dailyHighEl = document.querySelector("#daily-high");
var dailyLowEl = document.querySelector("#daily-low");
var apiKey = "gApT0eMTmmV7JFtKP2TjPCOFsxH7d2lBKwuPhEi5";
var searchHistory = JSON.parse(localStorage.getItem("search")) || [];

var stockData = function (searchedStockEl) {
    var apiUrl = "https://api.stockdata.org/v1/data/quote?symbols=" + searchedStockEl + "&api_token=" + apiKey;

    fetch(apiUrl)
    .then(function(response) {
        if(response.ok) {
            response.json().then(function(data) {
                console.log(data);
                searchHistory.push(searchedStockEl);
                localStorage.setItem("search", JSON.stringify(searchHistory));
                var dailyHigh = "Daily High: " + data.data[0].day_high;
                var dailyLow = "Daily Low: " + data.data[0].day_low;
                dailyHighEl.append(dailyHigh);
                dailyLowEl.append(dailyLow);
            });
        };
    });
};
//Pull top 25 stocks by weekly mentions
var getReddit = function() {
    var options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Host': 'reddit-stock-and-crypto-sentiment-tracker.p.rapidapi.com',
            'X-RapidAPI-Key': 'febae9e70dmshf9e7e9305b18ebap18ce14jsn3c2ef979b41e'
        }
    };
    fetch('https://reddit-stock-and-crypto-sentiment-tracker.p.rapidapi.com/filter/all-stocks/page/1', options)
        .then(function(response) {
            if(response.ok) {
                response.json().then(function(data) {
                    var nameOfStocks = [];
                    for (var i = 0; i < 25; i++) {
                        var redditStockName = document.createElement("button");
                        var linebreak = document.createElement("br");
                        nameOfStocks[i] = data.results[i].ticker;
                        console.log(nameOfStocks[i]);
                            redditStockName.setAttribute("value", nameOfStocks[i]);
                            // redditStockName.addEventListener("click", function () {
                            //     console.log(redditStockName.value);
                            //  });
                        // searchHistory.push(redditStockName.value);
                        // localStorage.setItem("search", JSON.stringify(searchHistory));
                        var mentions = document.createElement("span");
                        mentions.textContent = "Weekly Mentions: " + data.results[i].mentions;
                        var ticker = document.createElement("span");
                        ticker.textContent = "Stock Name: " + data.results[i].ticker + " ";
                        trendingStockEl.append(redditStockName);
                        redditStockName.appendChild(ticker);
                        redditStockName.appendChild(mentions);
                        trendingStockEl.append(linebreak);
                        };          
                    });
                };
            });
        };

var buttonClickHandler = function(event) {
    dailyHighEl.textContent = "";
    dailyLowEl.textContent = "";
    var searchedStock = searchedStockEl.value.toUpperCase().trim();
    stockData(searchedStock);
};

searchButtonEl.addEventListener("click", buttonClickHandler);

//Need to make links for trending stocks searchable

 getReddit();