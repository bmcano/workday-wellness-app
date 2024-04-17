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

ABOUT = "About"
CALENDAR = "Calendar"
CREATE_ACCOUNT = "CreateAccount"
EDIT_EXERCISES = "EditExercises"
EDIT_PROFILE = "EditProfile"
EXERCISES = "Exercises"
FORGOT_PASSWORD = "ForgotPassword"
FRIENDS = "Friends"
HOME = "Home"
LEADERBOARD = "Leaderboard"
LIFETIME_STATS = "LifetimeStatistics"
LOGIN = "Login"
NOTIFICATIONS = "Notifications"
PRIVACY = "Privacy"
PROFILE = "Profile"
RESET_PASSWORD = "ResetPassword"
SETTINGS = "Settings"
USER_PROFILE = "UserProfile"
USER_SEARCH = "UserSearch"

EMAIL = "Email"
EXTERNAL_LINK = "ExternalLink"
LOGOUT = "Logout"
NAVBAR = "Navbar"


# from the src/pages directory, add in alphabetical order
pages = [
    ABOUT,
    CALENDAR,
    CREATE_ACCOUNT, 
    EDIT_EXERCISES,
    EDIT_PROFILE, 
    EXERCISES,
    FORGOT_PASSWORD,
    FRIENDS, 
    HOME,
    LEADERBOARD,
    LIFETIME_STATS,
    LOGIN,
    NOTIFICATIONS, 
    PRIVACY,
    PROFILE,
    RESET_PASSWORD,
    SETTINGS, 
    USER_PROFILE,
    USER_SEARCH,
]

# Will add extra action items that simplify graph view
actions = [
    EMAIL,
    EXTERNAL_LINK,
    LOGOUT,
    NAVBAR,
]

# Includes items that have not been implemented yet, but will be eventually, unsure items are commented out
# NOTE: Everything other than login related items links back to the navbar
navigations = [
    # Login items
    Navigation(LOGIN, HOME),
    Navigation(LOGIN, FORGOT_PASSWORD),
    Navigation(LOGIN, CREATE_ACCOUNT),
    Navigation(CREATE_ACCOUNT, LOGIN),
    Navigation(CREATE_ACCOUNT, FORGOT_PASSWORD),
    Navigation(FORGOT_PASSWORD, LOGIN),
    Navigation(FORGOT_PASSWORD, CREATE_ACCOUNT),
    Navigation(EMAIL, RESET_PASSWORD),
    Navigation(RESET_PASSWORD, LOGIN),
    # Navbar items
    Navigation(NAVBAR, HOME),
    Navigation(NAVBAR, EXERCISES),
    Navigation(NAVBAR, CALENDAR),
    Navigation(NAVBAR, NOTIFICATIONS),
    Navigation(NAVBAR, PROFILE),
    Navigation(NAVBAR, SETTINGS),
    Navigation(NAVBAR, USER_SEARCH),
    Navigation(NAVBAR, LOGOUT),
    Navigation(NAVBAR, LEADERBOARD),
    Navigation(LOGOUT, LOGIN),
    # App navigation
    Navigation(EXERCISES, EDIT_EXERCISES),
    Navigation(EDIT_EXERCISES, EXERCISES),
    Navigation(EXERCISES, EXTERNAL_LINK),
    Navigation(PROFILE, EDIT_PROFILE),
    Navigation(PROFILE, EXTERNAL_LINK),
    Navigation(PROFILE, FRIENDS),
    Navigation(USER_SEARCH, USER_PROFILE),
    Navigation(SETTINGS, EDIT_PROFILE),
    Navigation(SETTINGS, FRIENDS),
    Navigation(SETTINGS, EDIT_EXERCISES),
    Navigation(SETTINGS, LIFETIME_STATS),
    Navigation(SETTINGS, PRIVACY),
    Navigation(SETTINGS, ABOUT),
    Navigation(FRIENDS, USER_PROFILE),
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
