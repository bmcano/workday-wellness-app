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

# from the src/pages directory, add in alphabetical order
pages = [
    "Calendar", 
    "Chat", 
    "CreateAccount", 
    "EditProfile", 
    "Exercises", 
    "Friends", 
    "FriendsProfile", 
    "Home", 
    "Login", 
    "Notifications", 
    "Profile", 
    "Settings", 
    "UserSearch",
]

navigations = [
    Navigation("Calendar", ""),
    Navigation("Chat", ""),
    Navigation("CreateAccount", "Login"),
    Navigation("EditProfile", ""),
    Navigation("Exercises", ""),
    Navigation("Friends", ""),
    Navigation("FriendsProfile", ""),
    Navigation("Home", ""),
    Navigation("Login", "Home"),
    Navigation("Login", "CreateAccount"),
    Navigation("Notifications", ""),
    Navigation("Profile", ""),
    Navigation("Settings", ""),
    Navigation("UserSearch",""),
]

if __name__ == "__main__":
    dot = graphviz.Digraph(comment = 'Navigation')

    # add all the pages as nodes
    for page in pages:
        dot.node(page, page, shape="rectangle")
    # add all ways to navigate to and from each page
    for nav in navigations:
        dot.edge(nav.source, nav.destination)

    # displays left to right, rather than up to down
    dot.attr(rankdir='LR')
    dot.attr(layout='dot')
    print(dot.source)
    dot.render(f'static/navigation/navigation.gv', view = False)