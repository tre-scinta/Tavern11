    # Tavern11

## Description

Tavern11 is a web application designed to assist game masters in organizing tabletop game sessions, such as Dungeons and Dragons. It provides a platform for tracking attendance, and sending SMS invitations with just a click. The frontend is built with React, and the backend is developed using TypeScript and Express.

## Features

- **Player Management:** Add new players and edit their information seamlessly.
- **Attendance Tracking:** Easily mark players as attending or not attending.
- **SMS Invitations:** (Coming Soon) Send game session invitations directly to players via SMS, powered by Twilio API.

## Getting Started

To run Tavern11 locally, you will need to start both the client and the server. This requires opening two separate terminal windows or tabs.

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

3. Start the app on port 3001:
    run: "PORT=3001 npm start"

4. To view the app, open a web browser and go to http://localhost:3001 


Data Storage
The app reads from and writes data to a file named `players.json` located in `server/api/`.

Upcoming Features
•Delete Players: Ability to remove players from the list.
•SMS Functionality: Integration with the Twilio API to enable sending SMS invitations.

Contributing
Contributions to Tavern11 are welcome! Please refer to the contributing guidelines for more information.

License

Acknowledgments

•Contributors and supporters of Tavern11