import yfinance as yf
import sqlite3
import json

try:
    connection = sqlite3.connect('Companies.db')
    cursor = connection.cursor()
except sqlite3.Error as err:
    print(err)

cursor.execute('SELECT company_id,symbol FROM Companies')
array=[]
rows = cursor.fetchall()
for row in rows:
    array.append(row)

for element in array:
    ind = array.index(element)
    ticker = yf.Ticker(element[1])
    dividends = ticker.dividends
    if len(dividends)>0:
        for dividend_date, dividend_amount in zip(dividends.index, dividends):

            dtobj = dividend_date.to_pydatetime()
            formatted_date = dtobj.strftime('%d-%m-%Y')
            cursor.execute('INSERT INTO Dividends(company_id,date,amount) VALUES (?,?,?)',(element[0],formatted_date,dividend_amount))
    else:
        print(f'{element[1]} pays no dividends')
    print(f' {ind} completed out of {len(array)}')
    connection.commit()

