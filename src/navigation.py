import graphviz

"""
Job:
 - This file is just a minor tool just for the sake of the documentation aspect of this project.
 - This will create a visualzation pdf of the navigation options available for the entire app, so its more clear as to how certain pages are accessed.
Note:
 - This file must be updated manually as I could not find a good system native to JavaScript or React.
"""

class Navigation:
    def __init__(self, source, destination) -> None:
        self.source = source
        self.destination = destination

CALENDAR = "Calendar"
CHAT = "Chat"
CREATE_ACCOUNT = "CreateAccount"
EDIT_PROFILE = "EditProfile"
EXERCISES = "Exercises"
FRIENDS = "Friends"
HOME = "Home"
LOGIN = "Login"
NOTIFICATIONS = "Notifications"
PROFILE = "Profile"
SETTINGS = "Settings"
USER_PROFILE = "UserProfile"
USER_SEARCH = "UserSearch"

LOGOUT = "Logout"
NAVBAR = "Navbar"

# from the src/pages directory, add in alphabetical order
pages = [
    CALENDAR,
    CHAT, 
    CREATE_ACCOUNT, 
    EDIT_PROFILE, 
    EXERCISES, 
    FRIENDS, 
    HOME, 
    LOGIN,
    NOTIFICATIONS, 
    PROFILE, 
    SETTINGS, 
    USER_PROFILE,
    USER_SEARCH,
]

# Will add extra action items that simplify graph view
actions = [
    LOGOUT,
    NAVBAR,
]

# Includes items that have not been implemented yet, but will be eventually, unsure items are commented out
navigations = [
    Navigation(CALENDAR, NAVBAR),
    Navigation(CHAT, NAVBAR),
    Navigation(CHAT, USER_PROFILE), # NOT IMPLEMENTED YET
    Navigation(CREATE_ACCOUNT, LOGIN),
    # Navigation(CREATE_ACCOUNT, FORGOT_PASSOWRD), 
    Navigation(EDIT_PROFILE, SETTINGS),
    Navigation(EXERCISES, "EditExercises"), # NOT IMPLEMENTED YET
    Navigation(EXERCISES, NAVBAR),
    Navigation(FRIENDS, NAVBAR),
    Navigation(FRIENDS, USER_PROFILE),
    Navigation(HOME, NAVBAR),
    Navigation(LOGIN, HOME),
    Navigation(LOGIN, CREATE_ACCOUNT),
    # Navigation(LOGIN, FORGOT_PASSWORD),
    Navigation(LOGOUT, LOGIN),
    Navigation(NAVBAR, HOME),
    Navigation(NAVBAR, EXERCISES),
    Navigation(NAVBAR, CHAT),
    Navigation(NAVBAR, CALENDAR),
    Navigation(NAVBAR, NOTIFICATIONS),
    Navigation(NAVBAR, PROFILE),
    Navigation(NAVBAR, SETTINGS),
    Navigation(NAVBAR, USER_SEARCH),
    Navigation(NAVBAR, LOGOUT),
    Navigation(NOTIFICATIONS, NAVBAR),
    # Navigation(NOTIFICATIONS, {SOME_OTHER_ACTION}), # this will likely have some custom navigations depending on the notification
    Navigation(PROFILE, EDIT_PROFILE),
    Navigation(PROFILE, NAVBAR),
    Navigation(SETTINGS, EDIT_PROFILE),
    Navigation(SETTINGS, FRIENDS),
    Navigation(SETTINGS, "EditExercises"), # NOT IMPLEMENTED YET
    Navigation(SETTINGS, "Stats"), # NOT IMPLEMENTED YET
    Navigation(SETTINGS, "PrivacySettings"), # NOT IMPLEMENTED YET
    Navigation(SETTINGS, "ContactSupport"), # NOT IMPLEMENTED YET
    Navigation(USER_PROFILE, NAVBAR), 
    Navigation(USER_SEARCH, NAVBAR),
]

if __name__ == "__main__":
    dot = graphviz.Digraph(comment = "Navigation")

    # add all the pages as nodes
    for page in pages:
        dot.node(page, page, shape="rectangle")
    # add any extra action items
    for action in actions:
        dot.node(action, action, shape="diamond")
    # add all ways to navigate to and from each page
    for nav in navigations:
        dot.edge(nav.source, nav.destination)

    # displays left to right, rather than up to down
    dot.attr(rankdir='LR')
    dot.attr(layout='dot')
    print(dot.source)
    dot.render(f'static/navigation/navigation.gv', view = False)
