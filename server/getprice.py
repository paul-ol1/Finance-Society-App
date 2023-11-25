import sqlite3
import yfinance as yf
import pandas as pd
import sys
from yahoofinancials import YahooFinancials

# Check if the correct number of arguments is provided

if len(sys.argv) != 2:
    print("Usage: incorrect parameters setting")
    sys.exit(1)


symbol =str(sys.argv[1])
ticker= yf.Ticker(symbol)
currentshares= ticker.basic_info['shares']
currentprice = ticker.basic_info['lastPrice']

currentprice= "%.2f" % round(currentprice, 2)
yahoo_financials = YahooFinancials(symbol)
beta = yahoo_financials.get_beta()
print(currentprice,currentshares,beta)
