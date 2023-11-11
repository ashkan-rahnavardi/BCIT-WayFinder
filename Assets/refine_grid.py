import json
from math import floor
from time import sleep

import geopy.distance

# -------- Program Options --------
DEBUG = False
REFINEMENT_LEVEL = 1
MANUAL_MODE = False


# -------- --------------- --------

REFINEMENT_LEVELS = {0: "ROUGH", 1: "FINE", 2: "VERY FINE", 3: "EXTREME"}

if REFINEMENT_LEVEL in  REFINEMENT_LEVELS.keys():
    REFINEMENT_LEVEL = REFINEMENT_LEVELS[REFINEMENT_LEVEL]
elif REFINEMENT_LEVEL not in REFINEMENT_LEVELS.values():
    raise Exception("Refinement level specified was not in given refinement levels.")
print(" -------- Refinement --------\nREFINEMENT LEVEL =", REFINEMENT_LEVEL, "\n")

# -------- Program Start --------
f = open('nav_grid.json')

data = json.load(f)

largest_id = max(data, key=lambda x: x['id'])
end_id = largest_id["id"]
start_id = largest_id["id"] + 1

current_largest_id = start_id

if not DEBUG:
    original_json = json.dumps(data, indent=4)

    with open("nav_grid.json.old", "w") as o:
        o.write(original_json)
        o.close()


# -------- Manual Node Selection --------
def interpolate():
    global current_largest_id
    print(" -------- Manual Mode --------\nEnter 'q' or 'quit' to exit manual mode.\n")
    while True:
        i_1 = input("ID 1: ")
        if i_1.lower() in ['q', 'quit']:
            break
        i_2 = input("ID 2: ")
        if i_2.lower() in ['q', 'quit']:
            break
        if not i_1.isnumeric() or not i_2.isnumeric():
            print("\nOne or both node ID's are not numbers.")
            sleep(1)
            continue
        start_node = data[int(i_1)]
        end_node = data[int(i_2)]
        if end_node["id"] not in start_node["next"]:
            print("\nNodes are not adjacent.")
            sleep(1)
            continue
        start_node_loc = (start_node['pos']['lat'], start_node['pos']['lng'])
        end_node_loc = (end_node['pos']['lat'], end_node['pos']['lng'])

        dist = geopy.distance.distance(start_node_loc, end_node_loc).kilometers
        dist_lat = end_node['pos']['lat'] - start_node['pos']['lat']
        dist_lng = end_node['pos']['lng'] - start_node['pos']['lng']

        subdivisions = floor(dist*100)

        if subdivisions not in [0, 1]:
            start_node["next"].remove(end_node["id"])
            end_node["next"].remove(start_node["id"])
            sub_dist_lat = dist_lat / float(subdivisions)
            sub_dist_lng = dist_lng / float(subdivisions)
            current_lat = start_node['pos']['lat']
            current_lng = start_node['pos']['lng']

            for i in range(subdivisions):
                current_lat += sub_dist_lat
                current_lng += sub_dist_lng
                if i == 0:
                    data.append({'id': current_largest_id, 'pos': {'lat': current_lat, 'lng': current_lng},
                                 'next': [start_node["id"], current_largest_id + 1]})
                    start_node["next"].append(current_largest_id)
                elif i == subdivisions - 1:
                    data.append({'id': current_largest_id, 'pos': {'lat': current_lat, 'lng': current_lng},
                                 'next': [current_largest_id - 1, current_largest_id + 1]})
                    end_node["next"].append(current_largest_id)
                else:
                    data.append({'id': current_largest_id, 'pos': {'lat': current_lat, 'lng': current_lng},
                                 'next': [current_largest_id - 1, end_node["id"]]})
                current_largest_id += 1


# -------- Automatic Nav Grid Refinement --------
def auto_interpolate(start_node, end_node, refinement):
    global current_largest_id
    start_node_loc = (start_node['pos']['lat'], start_node['pos']['lng'])
    end_node_loc = (end_node['pos']['lat'], end_node['pos']['lng'])

    dist = geopy.distance.distance(start_node_loc, end_node_loc).kilometers
    dist_lat = end_node['pos']['lat'] - start_node['pos']['lat']
    dist_lng = end_node['pos']['lng'] - start_node['pos']['lng']

    subdivisions = floor(dist*refinement)

    if subdivisions > 0:
        start_node["next"].remove(end_node["id"])
        end_node["next"].remove(start_node["id"])
        sub_dist_lat = dist_lat / float(subdivisions + 1)
        sub_dist_lng = dist_lng / float(subdivisions + 1)
        current_lat = start_node['pos']['lat']
        current_lng = start_node['pos']['lng']

        if subdivisions is 1:
            current_lat += sub_dist_lat
            current_lng += sub_dist_lng
            data.append({'id': current_largest_id, 'pos': {'lat': current_lat, 'lng': current_lng},
                             'next': [start_node["id"], end_node["id"]]})
            current_largest_id += 1
            return

        for i in range(subdivisions):
            current_lat += sub_dist_lat
            current_lng += sub_dist_lng
            if i == 0:
                data.append({'id': current_largest_id, 'pos': {'lat': current_lat, 'lng': current_lng},
                             'next': [start_node["id"], current_largest_id + 1]})
                start_node["next"].append(current_largest_id)
            elif i == subdivisions - 1:
                data.append({'id': current_largest_id, 'pos': {'lat': current_lat, 'lng': current_lng},
                             'next': [end_node["id"], current_largest_id - 1]})
                end_node["next"].append(current_largest_id)
            else:
                data.append({'id': current_largest_id, 'pos': {'lat': current_lat, 'lng': current_lng},
                             'next': [current_largest_id - 1, current_largest_id + 1]})
            current_largest_id += 1
        return


def refine_nav(fineness):
    visited = []
    for i in range(len(data)):
        current_node = data[i]
        next_list = current_node["next"]
        for node_i in next_list:
            if node_i not in visited:
                next_node = data[node_i]
                auto_interpolate(current_node, next_node, fineness)
        visited.append(i)


if DEBUG:
    print(" -------- Debug Mode Enabled --------\n\nOutput will not be saved.\n")
    sleep(1)
    print(" -------- Original Data --------")
    for item in data:
        print(item)

if not MANUAL_MODE:
    if REFINEMENT_LEVEL in ["ROUGH", 0]:
        refine_nav(50)
    elif REFINEMENT_LEVEL in ["FINE", 1]:
        refine_nav(100)
    elif REFINEMENT_LEVEL in ["VERY FINE", 2]:
        refine_nav(200)
    elif REFINEMENT_LEVEL in ["EXTREME", 3]:
        refine_nav(400)
else:
    interpolate()

if DEBUG:
    sleep(1)
    print(" -------- Resulting Data --------")
    for item in data:
        print(item)
else:
    data_json = json.dumps(data, indent=4)

    with open("nav_grid.json", "w") as o:
        o.write(data_json)
        o.close()
    print(" -------- End of Script --------\n The file has been refined.")
