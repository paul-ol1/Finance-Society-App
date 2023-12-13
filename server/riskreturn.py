# Import necessary libraries
import yfinance as yf  # Make sure you have this library installed: pip install yfinance
from datetime import datetime, timedelta
import math
import numpy as np
import sys


# Define the ticker symbol and time range
if len(sys.argv) != 2:
    print("Usage: incorrect parameters setting")
    sys.exit(1)

symbol =str(sys.argv[1])

# Set end_date to today and start_date to 10 years ago
end_date = datetime.today().strftime('%Y-%m-%d')
start_date = (datetime.today() - timedelta(days=365 * 10)).strftime('%Y-%m-%d')

# Create a Ticker object for the specified symbol
ticker = yf.Ticker(symbol)

netIncomeIndex = ticker.financials.index.get_loc('Net Income')

netincome = (ticker.financials.values[netIncomeIndex][0])
eps = netincome/ ticker.basic_info['shares']

latest_price =  ticker.basic_info['lastPrice']
pe_ratio = latest_price / eps
# Fetch historical data for the past 10 years at 3-month intervals
data = ticker.history(period='10y', interval='1mo')['Close'].tolist()

# Reverse the data to get it in chronological order
data = data[::-1]

# Initialize lists to store returns and processed data
returns = []
processeddata = []

# Process the data to get Annual closing prices from quarterly


# Calculate log returns and store in the returns list
for i in range(len(data)):
    if not i + 1 == len(data):
        returns.append(math.log(data[i] / data[i + 1]))

# Calculate and print the average log return in percentage
average_return_percentage = np.average(returns) * 100
average_return_percentage = round(average_return_percentage,3)
std = np.std(returns)*100
std = round(std, 3)
eps = round(eps,3)
pe_ratio= round(pe_ratio,3)


print(average_return_percentage, std,eps, pe_ratio)
