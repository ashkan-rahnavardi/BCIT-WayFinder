"""
This script converts the BCIT buildings excel file into a json format usable by the app.
Not all columns are used. Any row with null values in relevant rows will be discarded.
The file will output to the current directory. You will need to move it manually to the
relevant location. Make sure not to lose any data when overwriting. Some of the info in
the existing json file was entered manually.
"""

import pandas as pd

FILE_PATH = './Building Coordinates w Names.xls'
OUTPUT_FILE = './locations.json'

excel_data: pd.DataFrame = pd.read_excel(
    FILE_PATH, sheet_name='Building Coordinates')[['Xcord', 'Ycord', 'Building Name']]\
    .rename(columns={'Xcord': 'lng', 'Ycord': 'lat', 'Building Name': 'title'})\
    .dropna()
excel_data['id'] = excel_data.index + 1
# Default icon type. Set this manually later.
excel_data['type'] = 'building'
# This field needs to be set manually as well
excel_data['info'] = None

json_data = excel_data.to_json(orient='records', indent=4)
with open(OUTPUT_FILE, 'w') as f:
    f.write(json_data + '\n')
