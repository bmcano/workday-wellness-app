from pymongo import MongoClient
import json

# Connect to database and drop old users collection to not have duplicated data
print("Connecting...")
client = MongoClient('mongodb://localhost:27017')
db = client['wellness-app']
db.drop_collection('users')
user_collection = db['users']

with open('db/stub_data/users.json', 'r') as file:
    user_stubs = json.load(file)

for user in user_stubs:
    user_collection.insert_one(user)

print("Schema created")
