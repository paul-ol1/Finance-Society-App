import sqlite3
import yfinance as yf
import pandas as pd
import threading
import json
from datetime import datetime

lock = threading.Lock()
def create_connection(db):
    try:
        conn = sqlite3.connect(db)
        cursor = conn.cursor()
        print("Database created successfully")
        return conn, cursor

    except sqlite3.Error as err:
        print("Error while connecting to SQLite",err)
    return conn

def close_connection(conn, cursor):
    cursor.close()
    conn.close()

def getall(curs,query):
    array=[]
    curs.execute(query)
    rows = curs.fetchall()
    for row in rows:
        array.append(row)
    return array

def insertcontent(curs,query,data):
    curs.execute(query, data)


def updatecontent(curs,query,data):
    curs.execute(query, data)
    conn.commit()



conn,cursor= create_connection('companies.db');
allcomp = getall(cursor, 'SELECT company_id,symbol FROM Companies')

ticker = yf.Ticker('AAPL')

stock_data =ticker.history(period='1y',interval='1wk')

# Calculate daily returns for the stock and the market (using a market index, e.g., S&P 500)
stock_returns = stock_data['Close'].pct_change().dropna()
#print(stock_returns.index.tolist())
# Get 10-year Treasury yield
"""treasury_10y = yf.Ticker("^TNX")
treasury_10y_data = treasury_10y.history(period="1d",interval='1d')['Close'].values[0]
treasury_10y_date= treasury_10y.history(period="1d",interval='1d')['Close'].index[0].timestamp()
dtobj = datetime.fromtimestamp(treasury_10y_date)
formatted_date = dtobj.strftime('%Y-%m-%d')
print(formatted_date)
insertcontent(cursor,'INSERT INTO TenYearTreasury(symbol, date, rate) VALUES(?,?,?)',("^TNX",formatted_date,treasury_10y_data))"""

for i in allcomp:
    ticker = yf.Ticker(i[1])
    companyid = i[0]
    ci = allcomp.index(i)

    bs = ticker.balance_sheet
    incs = ticker.income_stmt
    cfs = ticker.cashflow

    for year in bs.columns.get_level_values(0):
        current_year_data = bs[year]
        dtobj = current_year_data.name.to_pydatetime()
        formatted_date = dtobj.strftime('%y-%m-%d')
        current_values= json.dumps(current_year_data.values.tolist())
        current_index= json.dumps(current_year_data.index.tolist())
        insertcontent(cursor,'INSERT INTO FinancialStatement(company_id,date,type,accounts,"values") VALUES(?,?,?,?,?)', (companyid,formatted_date,'Balance Sheet',current_index,current_values))

    for year in incs.columns.get_level_values(0):
        current_year_data = incs[year]
        dtobj = current_year_data.name.to_pydatetime()
        formatted_date = dtobj.strftime('%y-%m-%d')
        current_values= json.dumps(current_year_data.values.tolist())
        current_index= json.dumps(current_year_data.index.tolist())
        insertcontent(cursor,'INSERT INTO FinancialStatement(company_id,date,type,accounts,"values") VALUES(?,?,?,?,?)', (companyid,formatted_date,'Income Statement',current_index,current_values))


    for year in cfs.columns.get_level_values(0):
        current_year_data = cfs[year]
        dtobj = current_year_data.name.to_pydatetime()
        formatted_date = dtobj.strftime('%y-%m-%d')
        current_values= json.dumps(current_year_data.values.tolist())
        current_index= json.dumps(current_year_data.index.tolist())
        insertcontent(cursor,'INSERT INTO FinancialStatement(company_id,date,type,accounts,"values") VALUES(?,?,?,?,?)', (companyid,formatted_date,'Cashflow',current_index,current_values))

    print(f'{ci} done in {len(allcomp)}')
    conn.commit()

"""
for i in allcomp:
    ticker = yf.Ticker(allcomp[8][1])
    companyid = i[0]
    ci = allcomp.index(i)
    if len(ticker.dividends)>0:
        currindex = ticker.dividends.index
        currvalue = ticker.dividends.values
        for x,y in zip(currindex,currvalue):
            dtobj = x.to_pydatetime()
            formatted_date = dtobj.strftime('%Y-%m-%d')
            insertcontent(cursor,'INSERT INTO Dividends(company_id,ex_date,amount) VALUES(?,?,?)',(companyid,formatted_date,y))
        print(f'{ci} done in {len(allcomp)}')
    conn.commit()"""


"""allfs = getall(cursor,'SELECT * from FinancialStatement')
for i in allfs:
    symb = (getall(cursor,f'SELECT symbol from Companies where company_id={i[1]}')[0][0])
    ticker = yf.Ticker(symb)
    bs_years = ticker.balance_sheet.columns.tolist()
    yearsarr =[]
    for y in bs_years:
        yearsarr.append(str(y.year))
    currindex= yearsarr.index(i[2])
    if i[3] == 'Income Statement':
        incs_index = ticker.income_stmt.index.tolist()
        incs_value = ticker.income_stmt.values.tolist()
        for j in range(len(incs_index)):
            if 0 <= currindex < len(incs_value[j]):
                print(f"j: {j}, currindex: {currindex}, len(incs_value): {len(incs_value)}")
                insertcontent(cursor, 'INSERT INTO FinancialEntry(statement_id,account,value) VALUES(?,?,?)', (i[0], incs_index[j], incs_value[j][currindex]))
            else:
                print("Invalid index or range")

    if i[3] == 'Balance Sheet':
        bs_index = ticker.balance_sheet.index.tolist()
        bs_value = ticker.balance_sheet.values.tolist()
        for j in range(len(bs_index)):
            if 0 <= currindex < len(bs_value[j]):
                insertcontent(cursor, 'INSERT INTO FinancialEntry(statement_id,account,value) VALUES(?,?,?)', (i[0], bs_index[j], bs_value[j][currindex]))
            else:
                print("Invalid index or range")

    if i[3] == 'Cashflow':
        cfs_index = ticker.cashflow.index.tolist()
        cfs_value = ticker.cashflow.values.tolist()
        for j in range(len(cfs_index)):
            if 0 <= currindex < len(cfs_value[j]):
                insertcontent(cursor, 'INSERT INTO FinancialEntry(statement_id,account,value) VALUES(?,?,?)', (i[0], cfs_index[j], cfs_value[j][currindex]))
            else:
                print("Invalid index or range")

#print(allfs)"""
#print(bs_years)
#ticker_object = yf.Ticker('TSLA')
#print(ticker_object.history(period='max'))

'''
newBS_index = ticker_object.balance_sheet.index.tolist()
    newBS_data = ticker_object.balance_sheet.values.tolist()
    newIS_index = ticker_object.income_stmt.index.tolist()
    newIS_data = ticker_object.income_stmt.values.tolist()
    newCF_index = ticker_object.cash_flow.index.tolist()
    newCF_data = ticker_object.cash_flow.values.tolist()
start_date = '2018-01-01'
end_date = '2023-10-10'

stock_data = yf.download(allcomp[0], start=start_date, end=end_date)

# Print the historical data
print(stock_data)'''