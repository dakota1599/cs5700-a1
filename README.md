# Assignment 1 - CS 5700

### Instructor: Dr. Nada Lachtar

### Written by Dakota Shapiro

## Introduction

There are two projects within this assignment that you need to start up in order to test. The two directories are:

-   client
-   server

## Pre-requisites

-   You must have NodeJS installed on your system along with the accompanying `npm` tool. You can install NodeJS and `npm` on your machine by going to the following link and following the install instructions: [NodeJS Installation](https://nodejs.org/en).

## Starting up the Server

1. Navigate to the `server` directory in your terminal/command line tool.
2. Run the following command: `npm ci` (if that doesn't work run `npm i` or `npm install`)
    - If you are using a linux or macOS environment you may need to `sudo` this command with elevated privileges.
3. Once the dependencies have been installed, you simply need to run `npm run build` to run the server. (To close the server you must press `Cmd` + `C` or `Ctrl` + `C`).
4. The server will auto generate the "database" files for you as well as the server build. Should you wish to clean these out when you are done, run `npm run clean` to clean out the generate files (this only works on macOS/Linux).

## Starting up the Client

1. Navigate to the `client` directory in your terminal/command line tool.
2. Run the following command: `npm ci` (if that doesn't work run `npm i` or `npm install`)
    - If you are using a linux or macOS environment you may need to `sudo` this command with elevated privileges.
3. Once the dependencies have been installed, you simply need to run `npm run dev` to run the server. (To close the server you must press `Cmd` + `C` or `Ctrl` + `C`).

## Visit the Website

Once both the server and the client servers are up and running, you can open your browser and go to `http://localhost:5173/` to access the program. There you can test out all the features.
