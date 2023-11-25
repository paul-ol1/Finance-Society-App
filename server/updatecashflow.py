import sqlite3
import yfinance as yf
import pandas as pd
import threading
import json
from datetime import datetime

def create_connection(db):
    try:
        conn = sqlite3.connect(db)
        cursor = conn.cursor()
        print("Database created successfully")
        return conn, cursor

    except sqlite3.Error as err:
        print("Error while connecting to SQLite",err)
    return conn
def getall(curs,query):
    array=[]
    curs.execute(query)
    rows = curs.fetchall()
    for row in rows:
        array.append(row)
    return array

def close_connection(conn, cursor):
    cursor.close()
    conn.close()

def updatecontent(curs,query,data):
    curs.execute(query, data)

conn,cursor= create_connection('companies.db');
allcomp = getall(cursor, 'SELECT company_id,symbol FROM Companies')

for i in allcomp:
    ticker= yf.Ticker(i[1])
    cfs = ticker.cashflow
    ci = allcomp.index(i)

    for year in cfs.columns.get_level_values(0):
        current_year_data= cfs[year]
        dtobj = current_year_data.name.to_pydatetime()
        formatted_date = dtobj.strftime('%y-%m-%d')
        current_values= json.dumps(current_year_data.values.tolist())
        current_index= json.dumps(current_year_data.index.tolist())
        updatecontent(cursor,"UPDATE FinancialStatement SET 'values' = ?, accounts = ? WHERE company_id = ? AND date = ? AND type = ?", (current_values,current_index,i[0],formatted_date,'Cashflow'))
    print(f'{ci} done in {len(allcomp)}')
    conn.commit()