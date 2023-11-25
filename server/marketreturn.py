# Import necessary libraries
import yfinance as yf  # Make sure you have this library installed: pip install yfinance
from datetime import datetime, timedelta
import math
import numpy as np

# Define the ticker symbol and time range
ticker_symbol = '^GSPC'

# Set end_date to today and start_date to 10 years ago
end_date = datetime.today().strftime('%Y-%m-%d')
start_date = (datetime.today() - timedelta(days=365 * 10)).strftime('%Y-%m-%d')

# Create a Ticker object for the specified symbol
ticker = yf.Ticker(ticker_symbol)

# Fetch historical data for the past 10 years at 3-month intervals
data = ticker.history(period='10y', interval='3mo')['Close'].tolist()

# Reverse the data to get it in chronological order
data = data[::-1]

# Initialize lists to store returns and processed data
returns = []
processeddata = []

# Process the data to get Annual closing prices from quarterly
for i in range(len(data)):
    if i % 4 == 0:
        processeddata.append(data[i])

# Calculate log returns and store in the returns list
for i in range(len(processeddata)):
    if not i + 1 == len(processeddata):
        returns.append(math.log(processeddata[i] / processeddata[i + 1]))

# Calculate and print the average log return in percentage
average_return_percentage = np.average(returns) * 100
print("%.3f" % round(average_return_percentage, 3))
