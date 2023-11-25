import requests

api_key = 'ONZL2S0UFNCWRG63'
symbols = ['AAPL', 'GOOGL', 'MSFT']

for symbol in symbols:
    endpoint = f'https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol={symbol}&apikey={api_key}'
    response = requests.get(endpoint)

    if response.status_code == 200:
        data = response.json()
        print(f"Stock symbol: {symbol}")
        print(data['Time Series (Daily)'])
    else:
        print(f"Error for {symbol}: {response.status_code}, {response.text}")
