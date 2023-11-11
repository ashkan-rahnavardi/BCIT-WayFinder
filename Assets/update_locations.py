import json

locations = {}

with open('../client/src/locations.json') as file:
    locations = json.load(file)


for loc in locations:
    loc["desc"] = ""
    loc["label"] = loc["id"]

print(locations)

with open('.locations.json', 'w') as file:
    json.dump(locations, file, indent=4)