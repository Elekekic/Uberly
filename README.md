<div align="center">
  
  <img src="https://github.com/Elekekic/Uberly/assets/157897660/da7c7785-97f8-4249-b7ec-abc75deb1608" alt="Uberly logo" width="700px"> 

<br>

<br> 

   ![Static Badge](https://img.shields.io/badge/Deployed-%23FC7E0F?logo=Vercel&label=Vercel&labelColor=%23000000)  ![Static Badge](https://img.shields.io/badge/Deployed-%23F5E7C6?logo=Koyeb&label=Koyeb&labelColor=%23000000) ![Static Badge](https://img.shields.io/badge/Refactoring-%23FAF3E1?logo=htmx&label=code&labelColor=black)

</div>

> [!NOTE]
> This project is currently in **refactoring**. I am planning to incorporate additional features, so the current state of the project reflects the progress made within one month.

<br>

---

<h1 id="table-of-contents"> 🧾 Table of contents </h1> 

- [🛠 Technologies](#technologies)  
- [🧩 Features](#features)  
- [📝 How It Works](#how-it-works)  
- [📂 Video](#video)  
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

<h1 id="video">📂 Video</h1>



<h1 id="improvements">💡 Improvements</h1>

<h2 id="issues-and-their-status">:shipit: Issues and their status</h2>
- <strong>[RESOLVING]</strong> Only the landing, community login/signup pages are responsive <br> 
- <strong>[UNTOUCHED]</strong> Need to warn the users that if a picture is too big in its size, it won't post <br>
- <strong>[UNTOUCHED]</strong> In the explore page, if you filter a post and then remove the filter, the menus of the post don't work anymore  <br>

<br>

[Back to top](#table-of-contents)

[^1]: GreenSock Animation Platform. A JavaScript library for creating high-performance animations.
