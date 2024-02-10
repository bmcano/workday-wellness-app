from pymongo import MongoClient
import json

# Connect to database and drop old users collection to not have duplicated data
print("Connecting...")
client = MongoClient('mongodb://localhost:27017')
db = client['wellness-app']
user_collection = db['users']
user_collection.delete_many({})
exercise_collection = db['exercises']
exercise_collection.delete_many({})

with open('stub_data/users.json', 'r') as file:
    user_stubs = json.load(file)

with open('stub_data/exercises.json', 'r') as file:
    exercise_stubs = json.load(file)

for user in user_stubs:
    user['exercises'] = exercise_stubs[0]
    user_collection.insert_one(user)

print("Schema created")
