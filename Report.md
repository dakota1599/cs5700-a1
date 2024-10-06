# Assignment 1 - CS 5700

### Instructor: Dr. Nada Lachtar

### Written by Dakota Shapiro

Code: [https://github.com/dakota1599/cs5700-a1](https://github.com/dakota1599/cs5700-a1)

## 1. Introduction

This project was achieved using NodeJS and is split into two sections: the server side and the client side.

This is a web based solution with a Single Page Application Front End and a (semi) RESTful API backend. The user authentication utilizes OAuth2.0 principles to manage who has access to the system and its resources.

The server side utilizes the following packages/tools:

### Infrastructure / DevOps

-   NodeJS
-   ExpressJS
-   Cors
-   Typescript

### Encryption / Auth

-   Bycrypt
-   Jsonwebtoken

The client side utilizes the following packages/tools:

### Infrastruction / DevOps

-   ViteJS (Vite uses a lot of sub dependencies which are not listed here. For the full list, please visit the `package.json` in the client directory).
-   TailwindCSS
-   Typescript

There was a need to balance resources/time/complexity so the "database" for this project is a simple file structure. User information is stored in text files in the form of JSON (Javascript Object Notation).

## 2. User Registration

When a user wants to register with the system, they can submit their information on the homepage by clicking the "New User?" link. From there they enter their information and send it off to the server. Both the front end and the back end validate the user's information to make sure it is in line with the application's policy. Here is the policy:

-   `Name` must be at least two characters long.
-   `Username` must be at least three characters long.
-   `Password` must be at least eight characters long, contain special characters, at least one upper and lowercase letter, and a number.
-   `Security Question` must be at least five characters long.
-   `Security Answer` must be at least 15 characters long.

The server also checks to ensure that the provided username is not currently taken. If the username exists in the database, the server sends a 409 response and prompts the user to provide a different username. Should the user's information pass all checks, the user is registered in the database on the server side (with a hashed password and a hashed security answer using the `bcrypt` hashing algorithm with a salt round of 10). On the client side they are redirected back to the log in screen to use their new credentials.

## 3. User Login

A user must log in with a username and a password (both already registered within the server's database). That information is sent to the server to be validated with what is stored. The username is used to locate the correct record in the database (returning a 404 response if the user is not in the system). Once the record is found, the supplied password is hashed and compared with the stored password hash.

If the passwords do not match, a 401 response is returned. If the passwords do match, the server generates a JWT (JSON Web Token) with an expiration date of one hour after creation. This JWT will store the username and name of the user and be returned to the user on the front end to represent an authorized session.

## 4. Password Security

All passwords are stored in their hashed form. No password is stored as plain text.

Password specification policy is the following:

-   Minimum of 8 characters long.
-   Contains a special character.
-   Contains at least one a-z character.
-   Contains at least one A-Z character.
-   Contains at least one 0-9 number.

## 5. Password Reset

It should be noted that the strategy for resetting passwords is to use a security question. The reason for this strategy as opposed to the strategy of sending the user a reset email (or reset text message) is the time, complexity, and resources of such a strategy. In order to send an email or a text message, the project would require a SMTP (Simple Mail Transfer Protocol) server or SMPP (Short Message Peer-to-Peer Protocol) server.

To acquire those servers (either locally or in the cloud) would likely require money, but most importantly, would require a larger span of time to set up, test, and deploy the full password reset strategy/solution. This project recognizes the security flaws and potential dangers of the security question approach.

The security question strategy is applied by allowing the user to click the "Forgot Password?" link on the sign in screen. They must fist enter their username. The front end then sends that username to the server for getting the security question. If it can't find that user, a 404 response is returned. Otherwise, the security question is sent. The user then has to enter their security answer and their new password twice.

The new information is validated on the front end, and if it passes there, is sent to the server to be validated and applied. A 400 response is returned from the server if validation fails there.

## 6. Session Management

Remember that JWT that is sent to the front end when a user is authenticated? That JWT is then stored within their browser's local storage to be used to remember the authenticated session. This persists sessions from tab to tab and browser instance to browser instance. Every time a user accesses the application, the front end checks the browser's storage for the JWT.

If the JWT is not in local storage, the user is forced to log in. If the JWT is there but is invalid (sent to the server and fails authentication), the user is forced to log in. Otherwise, if the JWT is in local storage and passes authentication on the server, the user is given access to the application's resources.

## 7. Security Considerations

There is a log in attempt limit of three attempts per user. If a user attempts to log in more than three times, on the fourth time, they are prompted to reach out to their system administrator to unlock their account. This message is just to mock of what should happen if they pass their attempt threshold. The attempt count is stored on the user's database record and is reset to zero should the user successfully log in.

## 8. What can the user do?

Once a user is logged into their account, they can do the following:

-   Log out
-   View all users and their usernames on the system.
-   Reset their Security Question/Answer.

There is clearly not a lot that a user can do once they are logged in. The primary objective was to demonstrate one of the many strategies for authentication, access control (sort of), and cryptography.
