<div align="center">
  
  <img src="https://github.com/Elekekic/Uberly/assets/157897660/da7c7785-97f8-4249-b7ec-abc75deb1608" alt="Uberly logo" width="700px"> 

<br>

<br> 

   ![Static Badge](https://img.shields.io/badge/Deployed-%23FC7E0F?logo=Vercel&label=Vercel&labelColor=%23000000)  ![Static Badge](https://img.shields.io/badge/Deployed-%23F5E7C6?logo=Koyeb&label=Koyeb&labelColor=%23000000) ![Static Badge](https://img.shields.io/badge/Refactoring-%23FAF3E1?logo=htmx&label=code&labelColor=black)

</div>

> [!NOTE]
> This project is currently in **refactoring**. I am planning to incorporate additional features, so the current state of the project reflects the progress made within one month.


> [!CAUTION]
> Since the database is currently deployed on Koyeb and it's on a free plan, I have to reset it every 50 hours. If you see an error reflecting the server not responding, it's probably caused by that.


<br> 


<h1 id="table-of-contents"> 🧾 Table of contents </h1> 

- [🛠 Technologies](#technologies)  
- [🧩 Features](#features)  
- [📝 How It Works](#how-it-works)  
- [📂 Videos](#videos)  
- [💡 Improvements](#improvements)  
- [:shipit: Issues and their status](#issues-and-their-status)  

---

<br>

<h1 id="technologies">🛠️ Technologies</h1>

> [!IMPORTANT]
> The dependency for the websocket has been implemented in the back-end, but hasn't been used yet

_**Front-end**_: `Angular`, `GSAP`[^1], `Bootstrap`, `Typescript`, `RxJS`, `jquery`, `@auth0/angular-jwt`  
- Front deploy : `Vercel`

_**Back-end**_: `Java`, `SpringBoot`, `Maven`, `PostGreSQL`, `JWT`, `Cloudinary`, `Email sender`, `Lombok`, `Spring Security`  
- Back deploy : `Koyeb`  

_**Others**_: `Postman`  

<br>

<h1 id="features">🧩 Features</h1>

Uberly offers various features tailored to three essential roles within the application: **Admin, Driver, and Rider**. Each role has specific capabilities designed to meet their needs and responsibilities.

### 1. Admin

  - `Full Access`: Ability to manage and oversee all aspects of the platform.
  - `User Management`: Create, edit, and delete users posts, comments, replies and pictures.
  - `Content Moderation`: Review and manage posts, pictures & feedbacks from Drivers and Riders.
  - `System Configuration`: Adjusting configurations for the application as needed.

---

### 2. Driver

 - `Create Posts`: Ability to create posts to seek riders to go in journeys. 
 - `Add Pictures`: Upload pictures visible in their profile and in the explore page for other users.
 - `Submit Feedback` : Provide feedbacks to other users in their profiles.

---

### 3. Rider

  - `Add Pictures`: Upload pictures visible in their profile and in the explore page for other users.
  - `Submit Feedback`: Provide feedbacks to other users in their profiles.

<br> 

<h1 id="how-it-works">📝 How It Works</h1>

> [!TIP]
> if you want to see the website deployed, click to [this link](https://uberly-app.vercel.app/) and enjoy it!

##  DEVELOPMENT IN LOCAL ⚙

> [!WARNING]
> Ensure that you complete the back-end setup before starting the application firstly. Only after the back-end server is running, you will be able to get the URL from the console.
> This step is crucial for the front-end to communicate correctly with the back-end.


 ### BACK-END

1. In the back-end, you should change the PostgreSQL variables with your credentials:

```sh
SPRING_DATASOURCE_URL=*url*
SPRING_DATASOURCE_USERNAME=*username*
SPRING_DATASOURCE_PASSWORD=*password*
```

Once it's all set up, start the application in the back-end!


<br> 


### FRONT-END 

1. After setting up the back-end server, you will see the Tomcat localhost URL (e.g., http://localhost:8080). Copy this URL and update the apiURL in your front-end code to make API calls to your local back-end server. Here’s an example:

```sh
apiURL = 'http://localhost:8080/api'
```

> [!TIP]
> In the various services, I've left a comment with the same example I've provided here, so it's easier to switch between local and deployed versions.


2. To set up the project in local, run the following commands in the terminal:
```sh
npm i
npm install gsap
npm install jquery & npm install --save-dev @types/jquery
npm install @auth0/angular-jwt
```

Next, simply run the command `ng s -o` to start the front-end and you're done!


<br> 


<h1 id="videos">📂 Videos</h1>

[Landing page video](https://github.com/user-attachments/assets/830e5dab-cc0e-44dd-a673-5853c317a9de)

[Community page video](https://github.com/user-attachments/assets/d63d8022-2f09-4421-8090-a52f1db03abc)

[Forms video](https://github.com/user-attachments/assets/c3577451-df85-445a-bceb-8be2d13000f1)

[Home page video](https://github.com/user-attachments/assets/66cb4931-bc62-4f92-bd62-1bc0e7e1b5e5)

[Profile page video](https://github.com/user-attachments/assets/4e97d8e3-ba3e-4a8f-b83c-7253c177eeec)


[Another User's Profile video](https://github.com/user-attachments/assets/4b1cd730-5986-46d0-bfb4-9f8a4e6fba79)

[Explore page video](https://github.com/user-attachments/assets/9c90e452-0a09-4159-ad72-7a017c7ad01f)

[404 page video](https://github.com/user-attachments/assets/35460992-bcfb-440a-a9b6-40270920ee0d)


<br> 


<h1 id="improvements">💡 Improvements</h1>

<strong> Text Messaging: </strong>
Introduce a messaging feature that allows users to text each other and create group chats.

<strong> Google Maps API: </strong>
Embed a Google Maps overview in posts to show the location where the driver wants to go.

<strong> Custom Status: </strong>
Allow users to set a custom status with emojis on their profile, such as "💤 Sleeping" or "🧭 Traveling".

<strong> More Reactions: </strong>
Enhance user experience by adding more reaction options to posts.

<strong> Settings Page Redesign: </strong>
Revamp the settings page to improve its UX and UI for a more user-friendly experience.


<br>


<h1 id="issues-and-their-status">:shipit: Issues and their status</h1>

<strong> Responsiveness: </strong>
Currently, only the landing, community, and login/signup pages are responsive. (Resolving)

<strong> Warning for Large File Sizes: </strong>
Implement a warning system to notify users if a picture is too large to post. (Untouched)

<strong> Filtering and Toggles: </strong>
Fix an issue on the explore page where post menus stop working after applying and removing filters. (Untouched)

<br>

[Back to top](#table-of-contents)

[^1]: GreenSock Animation Platform. A JavaScript library for creating high-performance animations.
