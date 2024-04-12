from pymongo import MongoClient
import json
import datetime

"""
Calendar generation functions for seeding purposes
"""
WEEKLY_SCHEDULED_EVENTS = {
    "Monday": [
        ["Meeting 1", "14:00:00.000Z", "14:15:00.000Z"],
        ["Meeting 2", "17:00:00.000Z", "18:00:00.000Z"],
        ["Meeting 3", "20:30:00.000Z", "21:00:00.000Z"],
    ], 
    "Tuesday": [
        ["Meeting 4", "14:00:00.000Z", "14:15:00.000Z"],
        ["Meeting 5", "18:30:00.000Z", "20:00:00.000Z"],
    ], 
    "Wednesday": [
        ["Meeting 6", "14:00:00.000Z", "14:15:00.000Z"],
        ["Meeting 7", "16:00:00.000Z", "16:45:00.000Z"],
    ], 
    "Thursday": [
        ["Meeting 8", "14:00:00.000Z", "14:15:00.000Z"],
        ["Meeting 9", "16:00:00.000Z", "16:30:00.000Z"],
        ["Meeting 10", "17:00:00.000Z", "18:00:00.000Z"],
        ["Meeting 11", "20:00:00.000Z", "21:00:00.000Z"],
        ["Meeting 12", "21:00:00.000Z", "22:00:00.000Z"],
    ], 
    "Friday": [
        ["Meeting 13", "16:00:00.000Z", "16:30:00.000Z"],
    ]
}

def generateCurrentMonthJsonEvents(file):
    now = datetime.datetime.now()
    year = now.year
    month = now.month
    # collects all the dates for weekdays
    weekdays = {"Monday": [], "Tuesday": [], "Wednesday": [], "Thursday": [], "Friday": []}
    for weekday in weekdays:
        start_date = datetime.datetime(year, month, 1)
        while start_date.month == month:
            if start_date.strftime("%A") == weekday:
                weekdays[weekday].append(start_date.strftime("%Y-%m-%d"))
            start_date += datetime.timedelta(days=1)

    events = []
    for key in weekdays.keys():
        for date in weekdays[key]:
            for event in WEEKLY_SCHEDULED_EVENTS[key]:
                events.append(
                    {
                        "title": f"{event[0]}",
                        "start": f"{date}T{event[1]}",
                        "end": f"{date}T{event[2]}"
                    },
                )

    # Write the data to a JSON file
    with open(file, "w") as outfile:
        json.dump(events, outfile, indent=2)

if __name__ == "__main__":
    # Connect to database and drop old users collection to not have duplicated data
    print("Connecting...")
    client = MongoClient('mongodb://localhost:27017')
    db = client['wellness-app']
    user_collection = db['users']
    user_collection.delete_many({})
    statistics_collection = db['statistics']
    statistics_collection.delete_many({})
    notifications_collection = db['notifications']
    notifications_collection.delete_many({})
    privacy_collection = db['privacies']
    privacy_collection.delete_many({})
    status_collection = db['status']
    status_collection.delete_many({})
    schedule_collection = db['schedules']
    schedule_collection.delete_many({})

    # open and load all data for the Users table
    with open('stub_data/users.json', 'r') as file:
        user_stubs = json.load(file)

    # create calendar events for calendars_01.json, will eventually add more options
    generateCurrentMonthJsonEvents("..\\db\\stub_data\\calendars\\calendars_01.json")

    for user in user_stubs:
        friends_file = user['friends']
        with open(friends_file, 'r') as file:
            user['friends'] = json.load(file)
        exercise_file = user['exercises']
        with open(exercise_file, 'r') as file:
            user['exercises'] = json.load(file)[0]
        calendar_file = user['calendar']
        with open(calendar_file, 'r') as file:
            user['calendar'] = json.load(file)
        user_collection.insert_one(user)

    # open and load all data for the Statistics table
    with open('stub_data/statistics.json', 'r') as file:
        statistics_stubs = json.load(file)
    
    for stat in statistics_stubs:
        statistics_file = stat['completed']
        with open(statistics_file, 'r') as file:
            stat['completed'] = json.load(file)
        statistics_collection.insert_one(stat)

    # open and load all data for the Schedules table
    with open('stub_data/schedules.json', 'r') as file:
        schedule_stubs = json.load(file)

    for schedule in schedule_stubs:
        schedule_collection.insert_one(schedule)

    with open('stub_data/status.json', 'r') as file:
        status_stubs = json.load(file)

    for status in status_stubs:
        status_collection.insert_one(status)

    print("Schema created")