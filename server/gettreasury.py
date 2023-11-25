import sqlite3
import yfinance as yf
import pandas as pd
import sys


ticker= yf.Ticker("^FNX")
currentprice = ticker.basic_info['lastPrice']
print("%.2f" % round(currentprice, 2))
