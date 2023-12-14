import yfinance as yf
import pandas as pd
from datetime import datetime, timedelta

# Define start and end dates
end_date = datetime.today().strftime('%Y-%m-%d')
start_date = (datetime.today() - timedelta(days=365 * 3)).strftime('%Y-%m-%d')

# Download historical stock data
data = yf.download(['AAPL', '^GSPC'], interval='1mo', start=start_date, end=end_date)
print(data);

# Extract the 'Adj Close' prices
adj_close = data['Adj Close']

# Calculate the percentage change
percentage_change = adj_close.pct_change()

# Drop NA values
percentage_change = percentage_change.dropna()

# Separate the data into stock and market index
stock_returns = percentage_change['AAPL']
market_returns = percentage_change['^GSPC']

# Calculate beta
covariance = stock_returns.cov(market_returns)
variance = market_returns.var()
beta = covariance / variance



