# tic-tac-toe

## Docker
`cd server`<br>
`docker build -t tic_server .`<br>
`docker run -d -p 4000:4000 tic_server`<br>
`cd ../client`<br>
`docker build -t tic_front .`<br>
`docker run -d -p 8080:80 tic_front`<br>
`enjoy http://localhost:8080`


## Locally
1. clone this repoisitory
2. cd server, npm install the dependecies
3. run npm run dev
4. open a new terminal,
5. cd client, npm install the dependecies
6. run npm start // if it fails because of ""Error: digital envelope routines::unsupported"" then run export NODE_OPTIONS=--openssl-legacy-provider in git bash terminal and then run npm start again
7. have fun

### support multiple games simultaneously
