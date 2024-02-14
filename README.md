    # Tavern11

## Description

Tavern11 is a web application designed to assist game masters in organizing tabletop game sessions, such as Dungeons and Dragons. It provides a platform for tracking attendance, and sending SMS invitations with just a click. The frontend is built with React, and the backend is developed using TypeScript and Express.

## Features

- **Player Management:** Add and remove players and edit their information seamlessly.
- **Automatic Attendance Tracking:** Attendance status is updated when a player replies to the session invite text. Allowing you to see who is attending at a glance. you can also manually change their attendance status. 
- **SMS Invitations:**  Send game session invitations directly to players via SMS, powered by Twilio API.
-**Session Management:** See your next scheduled session at a glance. When you're ready to schedule another session, cllick "Add Session", selectthe date and click save. 

## Getting Started

To run Tavern11 locally, you will need to start both the client and the server. This requires opening two separate terminal windows or tabs.

NOTE: In order to receive incoming SMS replies from players and have their statuses updated automatically based on their reply, the server needs to be tunneled to a publi-facing domain so twilio can access the server.

To do this, contact me to ensure the tunnel is active. 

### Prerequisites

- Node.js installed on your machine
- npm (Node Package Manager)

### Installation

First, clone the repository to your local machine:

https://github.com/louis-scinta/Tavern11.git

Next, navigate to the project directory in your terminal

Then, runn the Backend Server
1. Open a terminal and navigate to the `server` directory:
    run: "cd server"

2. Install the necessary dependencies:
    run: "npm install"

3. Start the server on port 3000:
    run: "npm start"

Finally, runn the Client App
1. Open a second terminal and navigate to the `client` directory:
    run: "cd ../client"

2. Install the necessary dependencies:
    run: "npm install"

3. Start the app 
    run: "npm start"
Note: The app runs on port 3001 automatically.

4. To view the app, open a web browser and go to http://localhost:3001 


Data Storage
The app reads from and writes data to a file named `players.json` located in `server/api/`.

Upcoming Features

• UI and style updates
• Add time and location to session data
• Manage multiple campaigns with distinct player sets
• Send post-game satisfaction surveys to players
• Write notes to yourself about each session (e.g., highlights, things to try next time etc)
• View your notes and an average player satisfaction score for each session to track which sessions were the most enjoyed and what kinds of things happened during that 
session

Contributing
Contributions to Tavern11 are welcome! Please refer to the contributing guidelines for more information.

License

Acknowledgments
Twilio: Powering SMS functionality

•Contributors and supporters of Tavern11