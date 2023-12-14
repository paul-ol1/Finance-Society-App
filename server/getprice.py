import sqlite3
import yfinance as yf
import pandas as pd
import sys

from datetime import datetime, timedelta

# Check if the correct number of arguments is provided

if len(sys.argv) != 2:
    print("Usage: incorrect parameters setting")
    sys.exit(1)


symbol =str(sys.argv[1])
ticker= yf.Ticker(symbol)
currentshares= ticker.basic_info['shares']
currentprice = ticker.basic_info['lastPrice']

currentprice= "%.2f" % round(currentprice, 2)


# Define start and end dates
end_date = datetime.today().strftime('%Y-%m-%d')
start_date = (datetime.today() - timedelta(days=365 * 5)).strftime('%Y-%m-%d')

# Download historical stock data
data = yf.download([symbol, '^GSPC'], interval='1mo', start=start_date, end=end_date,  progress=False)

# Extract the 'Adj Close' prices
adj_close = data['Adj Close']

# Calculate the percentage change
percentage_change = adj_close.pct_change()

# Drop NA values
percentage_change = percentage_change.dropna()

# Separate the data into stock and market index
stock_returns = percentage_change[symbol]
market_returns = percentage_change['^GSPC']

# Calculate beta
covariance = stock_returns.cov(market_returns)
variance = market_returns.var()
beta = covariance / variance




print(currentprice,currentshares,round(beta, 2))
