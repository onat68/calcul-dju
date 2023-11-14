import csv
import os
from supabase import create_client, Client

url: str = "https://nmxyqirvwoiefdrlliri.supabase.co"
key: str = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5teHlxaXJ2d29pZWZkcmxsaXJpIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTM3NjA0OTUsImV4cCI6MjAwOTMzNjQ5NX0.X1-4DmC8LZAyjHNA-GwP-kxuGqoZUo4yRR8agbmqXl4"
supabase: Client = create_client(url, key)
# response = supabase.table('hey').select("salut").execute()
# print(supabase)


files_path = []

for root, dirs, files in os.walk('C:/Users/onatr/OneDrive/Documents/Ada/CalculDJU/dataStations'):
    for name in files:
        if name.endswith((".csv")):
            files_path.append(name)

def extractTemperatures(stationName) :
    sorted_temperature = {}
    path = "./dataStations/{station}"
    path = path.format(station=stationName)
    with open(path, newline='') as csvfile:
        csvParsed = csv.reader(csvfile, delimiter=';', quotechar='|')
        result = list(csvParsed)
        index_of_temperature = result[0].index('temperature')
        index_of_date = result[0].index('date')
        result.remove(result[0])

        for row in result:

            date = row[index_of_date].split('T')[0]
            if not date.split('-')[0]=='2023' and row[index_of_temperature]:
                
                temperature = round(float(row[index_of_temperature].strip("'")), 3)

                if not date in sorted_temperature: 
                    sorted_temperature[date] = {'date': date, 'tmin': temperature, 'tmax': temperature, 'station_name': file.split('data')[1].split('.')[0]}

                elif temperature < sorted_temperature[date]['tmin']:
                    sorted_temperature[date]['tmin']= temperature

                elif temperature > sorted_temperature[date]['tmax']:
                    sorted_temperature[date]['tmax']= temperature
    dataToInsert = []

    for e in sorted_temperature:
        dataToInsert.append(sorted_temperature[e])
        
    data, count = supabase.table('dataStation').insert(dataToInsert).execute()
    print(data, count)

    # createEntriesSupabase(stationName, dataToInsert)
    # print(sorted_temperature)

# def createEntriesSupabase(stationName, array_temperature):
#     for i in array_temperature:


for file in files_path:
    extractTemperatures(file)

