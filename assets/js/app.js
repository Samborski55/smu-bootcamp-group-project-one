//Global Variables
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
var dailyChangePercentageEl = document.querySelector("#daily-change");
var tickerSymbolEl = document.querySelector("#tickerSymbol")
var companyNameEl = document.querySelector("#companyName")
var sharesOutstandingEl = document.querySelector("#sharesOutstanding")
var sharesShortEl = document.querySelector("#sharesShort")
var sharesShortPrevMonthEl = document.querySelector("#sharesShortPrevMonth")
var apiKey = "gApT0eMTmmV7JFtKP2TjPCOFsxH7d2lBKwuPhEi5";
var searchHistory = JSON.parse(localStorage.getItem("search")) || [];
var uniqueSearchReg = searchHistory.filter((e, i) => searchHistory.indexOf(e) === i);
var uniqueSearch = uniqueSearchReg.reverse();

// function to get daily high and low from stockdata api and save searchedStock in local storage
var stockData = function (searchedStockEl) {
    var apiUrl = "https://api.stockdata.org/v1/data/quote?symbols=" + searchedStockEl + "&api_token=" + apiKey;

    fetch(apiUrl)
    .then(function(response) {
        if(response.ok) {
            response.json().then(function(data) {
                var dailyHigh = "Daily High: $" + data.data[0].day_high;
                var dailyLow = "Daily Low: $" + data.data[0].day_low;
                dailyHighEl.append(dailyHigh);
                dailyLowEl.append(dailyLow);
                displaySearchHistory();
            });
        };
    });
};

// function to get 52 week high and low from yahoo finance
var yearStockData = function (searchedStockEl) {
    var options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Host': 'yh-finance.p.rapidapi.com',
		    'X-RapidAPI-Key': '057567cd18mshd1157073f98bd53p13b433jsn1f9b6a4df973'
        }
    };
    fetch('https://yh-finance.p.rapidapi.com/market/v2/get-quotes?region=US&symbols=' + searchedStockEl, options)
        .then(function(response) {
            if(response.ok) {
                response.json().then(function(data) {
                    var tickerSymbol = "Ticker Symbol: " + data.quoteResponse.result[0].symbol;
                    var companyName = "Company Name: " + data.quoteResponse.result[0].shortName;
                    searchHistory.push(searchedStockEl);
                    localStorage.setItem("search", JSON.stringify(searchHistory));
                    var yearlyHigh = "52 Week High: $" + data.quoteResponse.result[0].fiftyTwoWeekHigh;
                    var yearlyLow = "52 Week Low: $" + data.quoteResponse.result[0].fiftyTwoWeekLow;
                    var dailyChangePercentage = "Gain/Loss Since Open: " + data.quoteResponse.result[0].regularMarketChangePercent + "%";
                    var sharesOutstanding = "Shares Outstanding: " + data.quoteResponse.result[0].sharesOutstanding + " shares.";
                    var sharesShort = "Shorted Amount: " + data.quoteResponse.result[0].sharesShort + " shares.";
                    var sharesShortPrevMonth = "Shorted Amount Last Month: " + data.quoteResponse.result[0].sharesShortPrevMonth + " shares.";
                    tickerSymbolEl.append(tickerSymbol);
                    companyNameEl.append(companyName);
                    yearHighEl.append(yearlyHigh);
                    yearLowEl.append(yearlyLow);
                    dailyChangePercentageEl.append(dailyChangePercentage);
                    sharesOutstandingEl.append(sharesOutstanding);
                    sharesShortEl.append(sharesShort);
                    sharesShortPrevMonthEl.append(sharesShortPrevMonth);
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
                        var rank = data.results[i].rank;
                        var yesterdaysRank = data.results[i].rank_24h_ago;
                        var parseYesterday = Number(yesterdaysRank);
                        var redditStockName = document.createElement("button");
                        var linebreak = document.createElement("br");
                        nameOfStocks[i] = data.results[i].ticker;
                        redditStockName.setAttribute("id", nameOfStocks[i]);
                        redditStockName.setAttribute("value", nameOfStocks[i]);
                        var mentions = document.createElement("p");
                        mentions.textContent = "Weekly Mentions: " + data.results[i].mentions;
                        var ticker = document.createElement("p");
                        ticker.textContent = "Stock Name: " + data.results[i].ticker + " ";
                        
                        trendingStockEl.append(redditStockName);
                         if (rank < parseYesterday) {
                             redditStockName.style.backgroundColor= "green";
                             var dailyChange = document.createElement("p");
                             dailyChange.textContent = "Increased ranking by " + (parseYesterday - rank) + " during past 24/hr."
                         }
                         else if (rank > parseYesterday) {
                             redditStockName.style.backgroundColor= "red";
                             var dailyChange = document.createElement("p");
                             dailyChange.textContent = "Decreased ranking by " + (rank - parseYesterday) + " during past 24/hr."
                         }
                         else {
                             redditStockName.style.backgroundColor= "grey";
                             var dailyChange = document.createElement("p");
                             dailyChange.textContent = "Hasn't changed ranking in past 24/hr."
                         }
                        redditStockName.appendChild(ticker);
                        redditStockName.appendChild(mentions);
                        redditStockName.appendChild(dailyChange);
                        trendingStockEl.append(linebreak);
                        redditStockName.addEventListener("click", function() {
                            stockData(this.value);
                            yearStockData(this.value);
                            clearData();
                        });
                        };          
                    });
                };
            });
        };

//display savedStock as an input to the page and clear daily and yearly high and low elements
var displaySearchHistory = function() {
    savedStockEl.innerHTML = "";
    if (uniqueSearchReg.length > 0 && uniqueSearchReg.length < 10) {
        for (var i = 0; i < uniqueSearchReg.length; i++) {
            var savedStock = document.createElement("input");
            savedStock.setAttribute("class", "input");
            savedStock.setAttribute("type", "text");
            savedStock.setAttribute("id", uniqueSearchReg[i]); 
            savedStock.setAttribute("value", uniqueSearchReg[i]);
            savedStock.textContent = uniqueSearchReg[i];
            savedStock.addEventListener("click", function() {
                stockData(this.textContent); 
                yearStockData(this.textContent);
                clearData();
            });   
             savedStockEl.appendChild(savedStock);
        };
    }
    else if (uniqueSearchReg.length > 10) {
        for (var i = 0; i < 10; i++) {
            var savedStock = document.createElement("input");
            savedStock.setAttribute("class", "input");
            savedStock.setAttribute("type", "text");
            savedStock.setAttribute("id", uniqueSearchReg[i]); 
            savedStock.setAttribute("value", uniqueSearchReg[i]);
            savedStock.textContent = uniqueSearchReg[i];
            savedStock.addEventListener("click", function() {
                stockData(this.textContent); 
                yearStockData(this.textContent);
                clearData();
            });   
             savedStockEl.appendChild(savedStock);
        };
    }
    else {
        var emptyHistory = document.createElement("p");
        emptyHistory.textContent = "Search History is Empty"
        savedStockEl.appendChild(emptyHistory);
    }
};

var clearData = function() {
    tickerSymbolEl.textContent="";
    companyNameEl.textContent="";
    dailyHighEl.textContent="";
    dailyLowEl.textContent="";
    yearHighEl.textContent="";
    yearLowEl.textContent="";
    dailyChangePercentageEl.textContent="";
    sharesOutstandingEl.textContent="";
    sharesShortEl.textContent="";
    sharesShortPrevMonthEl.textContent="";
};

//function for what to do when search button is clicked
var buttonClickHandler = function(event) {
    clearData();
    var searchedStock = searchedStockEl.value.toUpperCase().trim();
    stockData(searchedStock);
    yearStockData(searchedStock);
};

var refreshPage = function() {
   console.log(uniqueSearch);
   console.log(uniqueSearchReg);
};

// var refreshPage = function() {
//     window.parent.location = window.parent.location.href;    
// };

searchButtonEl.addEventListener("click", buttonClickHandler);


//Display Search History to page on load
displaySearchHistory();

//Display Reddit trending stocks on page load
getReddit();
