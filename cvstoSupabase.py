import csv
import os
from supabase import create_client, Client
connexion_string = os.environ.get('user=postgres host=db.nmxyqirvwoiefdrlliri.supabase.co port=5432 database=postgres')

# url: str = os.environ.get("SUPABASE_URL")
# key: str = os.environ.get("SUPABASE_KEY")
supabase: Client = create_client(connexion_string)


files_path = []

for root, dirs, files in os.walk('C:/Users/onatr/OneDrive/Documents/Ada/CalculDJU/calcul-dju/dataStations'):
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
        print(stationName,result[0])
        index_of_temperature = result[0].index('temperature')
        index_of_date = result[0].index('date')
        result.remove(result[0])

        for row in result:

            date = row[index_of_date].split('T')[0]
            if not date.split('-')[0]=='2023' and row[index_of_temperature]:
                
                temperature = round(float(row[index_of_temperature].strip("'")), 3)

                if not date in sorted_temperature: 
                    sorted_temperature[date] = {'date': date, 'tmin': temperature, 'tmax': temperature}

                elif temperature < sorted_temperature[date]['tmin']:
                    sorted_temperature[date]['tmin']= temperature

                elif temperature > sorted_temperature[date]['tmax']:
                    sorted_temperature[date]['tmax']= temperature

    # print(sorted_temperature)


# for file in files_path:
#     extractTemperatures(file)
