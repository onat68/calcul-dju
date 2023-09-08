sorted_temperature = []
import csv
with open('./dataStations/dataAbbeville.csv', newline='') as csvfile:
    csvParsed = csv.reader(csvfile, delimiter=';', quotechar='|')
    for row in csvParsed:
        