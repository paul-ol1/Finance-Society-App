import sqlite3
import json

try:
    sqliteConnection = sqlite3.connect('companies.db')  # set up database connection
    cursor = sqliteConnection.cursor()  # allows me to navigate the database
    print("Database created and Successfully Connected to SQLite")
except sqlite3.Error as error:
    print("Error while connecting to SQLite", error)

# set up a company list for reference and to be able to navigate through Python modules and the database
json_opener = open("companies.json")
companies_list = json.load(json_opener)

query = f"DROP TABLE IF EXISTS Companies;"
cursor.execute(query)
# Create new tables
companies_table = "CREATE TABLE Companies (Symbol TEXT NOT NULL, Name TEXT NOT NULL, Sector TEXT, Industry TEXT, Country TEXT, PRIMARY KEY (Symbol));"
cursor.execute(companies_table)

companies_list = set(json.dumps(obj, sort_keys=True) for obj in companies_list)
companies_list = [json.loads(json_str) for json_str in companies_list]
print(companies_list[1])
for i in companies_list:
    data_to_insert = ( i['Symbol'], i['Name'], i['Sector'],i['Industry'],i['Country'])
    print(data_to_insert)
    query = "INSERT INTO Companies(Symbol,Name,Sector,Industry,Country) VALUES(?,?,?,?,?)"
    cursor.execute(query, data_to_insert)

sqliteConnection.commit()

# Close the cursor and the connection
cursor.close()
sqliteConnection.close()

