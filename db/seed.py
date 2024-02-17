from pymongo import MongoClient
import json

# Connect to database and drop old users collection to not have duplicated data
print("Connecting...")
client = MongoClient('mongodb://localhost:27017')
db = client['wellness-app']
user_collection = db['users']
user_collection.delete_many({})

with open('stub_data/users.json', 'r') as file:
    user_stubs = json.load(file)

for user in user_stubs:
    exercise_file = user['exercises']
    with open(exercise_file, 'r') as file:
        user['exercises'] = json.load(file)[0]
    calendar_file = user['calendar']
    with open(calendar_file, 'r') as file:
        user['calendar'] = json.load(file)
    user_collection.insert_one(user)

print("Schema created")