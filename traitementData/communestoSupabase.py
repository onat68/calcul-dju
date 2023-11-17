import json
from supabase import create_client, Client

url: str = "https://nmxyqirvwoiefdrlliri.supabase.co"
key: str = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5teHlxaXJ2d29pZWZkcmxsaXJpIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTM3NjA0OTUsImV4cCI6MjAwOTMzNjQ5NX0.X1-4DmC8LZAyjHNA-GwP-kxuGqoZUo4yRR8agbmqXl4"
supabase: Client = create_client(url, key)

f = open("c:/Users/onatr/OneDrive/Documents/Ada/CalculDJU/traitementData/geoCommunes.json")
dataCommunes = json.load(f)
dataCommunes = {frozenset(item.items()):item for item in dataCommunes}.values() # remove duplicates values
dataToInsert = []

for commune in dataCommunes:
    newCommune = {"name": commune["name"], "postal": commune["postal"], "closestStation": commune["closestStation"]}
    dataToInsert.append(newCommune)
    

data, count = supabase.table('communes').insert(dataToInsert).execute()
print(data, count)