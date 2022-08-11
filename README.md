*OUR FINAL SUBMISSION IS IN THE MAIN BRANCH!

# I-LOVE-ICICS

Whenever we learn a new language, most tools only teach new learners about basic sentence structure and vocabulary however, as language learners ourselves, we found that some problems that we often run into are the coloquialisms, slang, and uses of words or phrases in special circumstances that aren't normally taught by instructors or courses. As such, our aim is to develop a tool for users to both contribute and reap the benefits of being apart of a language learning community to learn the ins and outs that are commonly only known to native speakers. Through our web application, users will be able to search and filter words and phrases and have our search algorithm return not only matching results but also results in other tenses. Additionally, we included the ability for users to have our algorithm fill in blanks with nouns, verbs, and adjectives based on the users needs. Our end product will include a table with instructions on how to efficiently use the filters included with our search algorithm.

## Minimal requirements:

- Account creation page [complete]
- Login page [complete]
- User home page with all saved and submitted sentences [complete]
- Ability to add sentences [complete]

## Standard Requirements:

- Login feature [complete]
- Explore page including drop down with filters [complete]
- Editing user profile [incomplete]
- Ability to comment on sentences [complete]
- Add sentence features [complete]
- Instructions on how to filter sentences with our search algorithm [complete]

## Stretch Requirements:

- Ability to highlight parts of sentence to make them "important" in the search [complete]
- Liking and adding sentences to a user's saved section [complete]
- Ability to sort explore page by trending in last 24h, week, month [complete]
- Ability to filter by parts of speech [complete]

## Technologies Used: 

Unit 1 – HTML, CSS, JS: The tech from Unit 1 was really used as the backbone of our application. HTML was used to structure the layout of our frontend UI, and CSS was used to add styling and character to the HTML structure. Finally, JS is used as the main language for this project and therefore was used to facilitate the technologies in all the units that followed including this one.

Unit 2 – React & Redux: React was used in our project to quickly get our front-end up and running with complex javascript functionality, and also allow us access to many npm packages that were critical in the development of our project such as material-ui, parts of speech tagging, text highlighting from indices, etc. We also used Redux to house the resulting sentences, allowing me to access them from different components which was crucial to creating a smooth rendering process.

Unit 3 – Node & Express: Express was used in our project to quickly set up an http server for the frontend to access. With express, I was also able to use mongoose which allowed convenient and easy access to our database, and also quickly set up endpoints that the frontend used to communicate with. Our core functionality including sentence searching and browsing was all done using endpoints in express

Unit 4 – NoSQL with MongoDB: Being an ODM, we used MongoDB to store both data from users and any data we may want to preload to the application. Using this technology, we created custom schemas to store our main data types such as Sentences, Comments, and Users. Additionally, we also used it to store the dates of sentence creation and upvotes by users which allowed us to create our Trending and Recent filters based on certain time intervals.

Unit 5 – Release Engineering: For release engineering, we mainly used this tech as a facilitator to build and deploy our application. In the case of our project, we used Heroku’s deployment platform and set it up to automatically deploy whenever there is an update to main. Unfortunately, although we initially intended to setup a GitHub workflow to validate and build our pull-requests before auto deployments we were unable to, however it is definitely something we will implement as next steps to prevent any errors.

## Above and Beyond:

For our above and beyond functionality, we think that it would really have to do with the abundance of flexibility and customizability in our search engine. In particular, it is definitely the ability of our search to consider placeholder words or parts of speech (POS). This filtering was all done using regex, and we had to be able to code it in such a way that the database finds variable length words/strings, and if POS is included, then the POS pattern also have to account for case such as POS, empty, actual word convoluted because we needed to take into account edge cases, such as spaces, periods, apostrophes, exclamations, beginning/end of string, etc. We needed to code regex to find position of the text, and pinpoint start/end indices also needed to consider all the edge cases noted also variable end index because of the placeholder word functionality, also because of contractions/expansions could have multiple matches in the string, but not all satisfy the POS pattern, we need to find the first one that satisfies the pattern.

## Next Steps:

For next steps, I believe we’d first like to polish up some of the edges on the frontend UI such as layout and to make it accessible to mobile users by having adaptive scaling based on screen size. Additionally, we were unable to complete some user functionalities such as searching for users and allowing users to edit their account information, so we’d like to finish that as well. Another goal of ours initially was also to include multiple language functionality by including some of our language interests like Japanese and French however due to time constraints, we settled on focusing on English and would eventually like to add on multilingual support.

## Contributions:

•	Roy Chen: The most significant area in which Roy contributed would have to be related to the search functionality. Because we created our own custom search engine and logic, Roy spent a large portion of his time creating, polishing, and testing the different customizable components of searching, in particular, Roy focused a lot on optimizing filtering (especially with the Parts of Speech filter) and fine tuning our regex. Additionally, he also focused on our functionality to add sentences, in particular the ability to highlight parts of sentences to mark them as ‘important’

•	Ethan Ly: The most significant area in which Ethan contributed would be the Explore page as well as the incorporation of comments, users, and sentences. Ethan managed a lot of the backend routing/endpoints for our server and also structured many of the schemas deciding on how our main data points (Sentences, Comments, Users) would be stored in the database. Additionally, he also worked on a large portion of the styling and layout for the web application’s front-end UI.

•	Ian Cheng: The most significant area in which Ian contributed would be related to the user functionality. Ian managed many user pages such as account creation, and login encryption. He also worked on the layout and functionalities of the user profile page. Additionally, he also worked on the pages to edit user profiles and search for other users however due to time constraints and merge conflicts, we were unable to polish these functions enough to finish it in our final submission.



