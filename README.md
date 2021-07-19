# FriendsBook

## Table of contents
* [General info](#general-info)
* [Technologies](#technologies)
* [Setup](#setup)

## General info

### 1. Background
Friends Book is a popular social networking web application that allows registered users to connect
with friends. Users can send requests, write posts, and share pictures among friends.
This web application is a regular stop for millions of users. Since it is designed using traditional web
development methodologies, navigating to different page of the application resulted in reloading the
entire page. With the increase in web traffic the website load time increased significantly which in
turn, impacted the speed and performance of the website. Also, the website could not adapt to
different resolutions and device screens.
All these challenges led to unsatisfied user experience. So, the company decided to upgrade their
website using Angular Framework to focus on building responsive and customer-oriented single page
web application.

### 2. Goal
The objective is to develop a RESTful web application that can be easily adopted by usersto engage them
in social activities with a faster and safer web environment. The framework will be built in a way that
ensures maximum re-usability.

### 3. Use Cases:
The application is designed to provide user-specific functionality. We will have two users for this
application:

#### 1. Admin:
An admin will be able to:
    ✓ Block the account of any user
    ✓ Change and reset the password
    ✓ Post any message or advertisement
    ✓ Manage profile details
    ✓ Hide the post of any user
#### 2. User:
User’s will be able to:
    ✓ Register themselves as a user
    ✓ Change and reset their password
    ✓ Post any message, article or upload picture
    ✓ Send, accept or reject friend requests
    ✓ Manage their profile details
    ✓ Hide their own post
    ✓ See posts from all the users
    
Other than the above functionality, application will have authorization/authentication based on JSON
web token (JWT). 
	
## Technologies
Project is created with:
* [Angular CLI](https://github.com/angular/angular-cli) version 12.1.1.
* Angular framework, HTML, CSS, VS Code, NodeJS and MongoDB (Used Node.js API which will fetch the data stored in MongoDB database)
	
## Setup
To run this project, install it locally using npm:

```
$ cd ../FriendsBook
$ npm install
$ npm start
```

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
