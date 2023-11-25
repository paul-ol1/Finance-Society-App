import yfinance as yf
import pandas as pd
from datetime import date, timedelta

ticker = 'TSLA'
t= yf.Ticker(ticker)

print(t.cashflow)


ticker = yf.Ticker('AAPL')

stock_data =ticker.history(period='1y',interval='1wk')

# Calculate daily returns for the stock and the market (using a market index, e.g., S&P 500)
stock_returns = stock_data['Close'].pct_change().dropna()