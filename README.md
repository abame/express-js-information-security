# Information Security with HelmetJS

This app showcases a `Node.js` application with `Express`, `Helmet` and `Bcrypt` on how to handle the Information Security.

The application is a simple voting system with only one route that 
    1. Receives a poll ID as a query string.
    2. Checks in a MongoDB if there is a vote object created for that poll and creates one it none is found.
    3. Checks if the IP attached to the request has voted or not, IP is encrypted with `Bcrypt` in compliance with GDPR rules.
    4. If IP hasn't voted, the votes property is incremented and the IP is added to the list of IPs that have voted.
    5. Return the vote as a response.