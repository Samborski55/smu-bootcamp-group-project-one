
var searchedStockEl = document.querySelector("#searched-stock");
var trendingStockEl = document.querySelector("#trending-stock");
var searchButtonEl = document.querySelector("#search-btn");
var savedStockEl = document.querySelector("#saved-stock");
var savedStockButton = document.getElementById("#btn");
var stockInfoEl = document.querySelector("#stock-info");
var dailyHighEl = document.querySelector("#daily-high");
var dailyLowEl = document.querySelector("#daily-low");
var yearHighEl = document.querySelector("#year-high");
var yearLowEl = document.querySelector("#year-low");
var apiKey = "gApT0eMTmmV7JFtKP2TjPCOFsxH7d2lBKwuPhEi5";
var searchHistory = JSON.parse(localStorage.getItem("search")) || [];

var stockData = function (searchedStockEl) {
    var apiUrl = "https://api.stockdata.org/v1/data/quote?symbols=" + searchedStockEl + "&api_token=" + apiKey;

    fetch(apiUrl)
    .then(function(response) {
        if(response.ok) {
            response.json().then(function(data) {
                searchHistory.push(searchedStockEl);
                localStorage.setItem("search", JSON.stringify(searchHistory));
                var dailyHigh = "Daily High: " + data.data[0].day_high;
                var dailyLow = "Daily Low: " + data.data[0].day_low;
                dailyHighEl.append(dailyHigh);
                dailyLowEl.append(dailyLow);
                displaySearchHistory();
            });
        };
    });
};

var yearStockData = function (searchedStockEl) {
    var options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Host': 'yh-finance.p.rapidapi.com',
		    'X-RapidAPI-Key': 'febae9e70dmshf9e7e9305b18ebap18ce14jsn3c2ef979b41e'
        }
    };
    fetch('https://yh-finance.p.rapidapi.com/market/v2/get-quotes?region=US&symbols=' + searchedStockEl, options)
        .then(function(response) {
            if(response.ok) {
                response.json().then(function(data) {
                    var yearlyHigh = "52 Week High: " + data.quoteResponse.result[0].fiftyTwoWeekHigh;
                    var yearlyLow = "52 Week Low: " + data.quoteResponse.result[0].fiftyTwoWeekLow;
                    yearHighEl.append(yearlyHigh);
                    yearLowEl.append(yearlyLow);
                })
            }
        })
}
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
                            redditStockName.setAttribute("id", nameOfStocks[i]);
                            redditStockName.setAttribute("value", nameOfStocks[i]);
                        var mentions = document.createElement("span");
                        mentions.textContent = "Weekly Mentions: " + data.results[i].mentions;
                        var ticker = document.createElement("span");
                        ticker.textContent = "Stock Name: " + data.results[i].ticker + " ";
                        trendingStockEl.append(redditStockName);
                        redditStockName.appendChild(ticker);
                        redditStockName.appendChild(mentions);
                        trendingStockEl.append(linebreak);
                        redditStockName.addEventListener("click", function() {
                            stockData(this.value);
                            yearStockData(this.value);
                            dailyHighEl.textContent="";
                            dailyLowEl.textContent="";
                            yearHighEl.textContent="";
                            yearLowEl.textContent="";
                        });
                        };          
                    });
                };
            });
        };

var displaySearchHistory = function() {
    savedStockEl.innerHTML = "";
    for (var i=0; i < searchHistory.length; i++) {
        var savedStock = document.createElement("input");
        savedStock.setAttribute("class", "input");
        savedStock.setAttribute("type", "text");
        savedStock.setAttribute("id", searchHistory[i]); 
        savedStock.setAttribute("value", searchHistory[i]);
        savedStock.textContent = searchHistory[i];
        savedStock.addEventListener("click", function() {
            stockData(this.textContent);
            yearStockData(this.textContent);
            dailyHighEl.textContent="";
            dailyLowEl.textContent="";
            yearHighEl.textContent="";
            yearLowEl.textContent=""

        });
           
        savedStockEl.appendChild(savedStock);
    };
};

var buttonClickHandler = function(event) {
    dailyHighEl.textContent = "";
    dailyLowEl.textContent = "";
    yearHighEl.textContent = "";
    yearLowEl.textContent = "";
    var searchedStock = searchedStockEl.value.toUpperCase().trim();
    stockData(searchedStock);
    yearStockData(searchedStock);
};

searchButtonEl.addEventListener("click", buttonClickHandler);

 getReddit();

 displaySearchHistory();