import sqlite3
import json
import yfinance as yf
from datetime import datetime, timedelta
import math
import numpy as np

try:
    sqliteConnection = sqlite3.connect('users.db')  # set up database connection
    cursor = sqliteConnection.cursor()  # allows me to navigate the database
except sqlite3.Error as error:
    print("Error while connecting to SQLite", error)

id = 1

# Execute the query to select rows from PortfolioEntry
cursor.execute("SELECT Symbol,Quantity FROM PortfolioEntry WHERE PortfolioID=?", (id,))

# Fetch all rows from the result set
rows = cursor.fetchall()

# Close the cursor and the connection
cursor.close()
sqliteConnection.close()

# Process the fetched rows
symbol = []
quantity = []
weights = []
for row in rows:
    if row[0] in symbol:
        index = symbol.index(row[0])
        quantity[index] += row[1]
    else:
        symbol.append(row[0])
        quantity.append(row[1])

for i in quantity:
    weights.append(i/sum(quantity))

def cleanedarr(arr):
    # Create a new list to store non-NaN values
    for i in arr:
        if math.isnan(i):
            ind = arr.index(i);
            arr[ind]= 0.0
    return arr

end_date = datetime.today().strftime('%Y-%m-%d')
start_date = (datetime.today() - timedelta(days=365 * 10)).strftime('%Y-%m-%d')
data = yf.download(symbol, start=start_date, end=end_date)['Adj Close']
print(data)
broken_down_data = []
for i in range(len(symbol)):
    x = data[symbol[i]].tolist()
    broken_down_data.append(x[::-1])

returns = []
for i in broken_down_data:
    newarr = []
    for x in range(len(i)):
        if not x + 1 == len(i):
            newarr.append(math.log(i[x] / i[x + 1]))

    # Use the cleanedarr function to remove NaN values
    cleaned_arr = cleanedarr(newarr)

    returns.append(cleaned_arr)

sds = []
for i in returns:
    sds.append(np.std(i))

weights = np.array(weights)
sds = np.array(sds)

expectedreturns = []
for i in returns:
    expectedreturns.append(np.average(i)*100)
print(expectedreturns)



