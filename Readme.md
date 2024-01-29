# daptours

using MERN stack <br>
Tour planner website with API(https://documenter.getpostman.com/view/31106866/2s9YymJR44). <br>
_JWT_EXPIRES_IN 90 DAYS_

## npm packages

1. express version 4
2. nodemon
3. morgan --> 3rd party middleware
4. dotenv --> for environment variables
5. eslint
   prettier
   eslint-config-prettier
   eslint-plugin-prettier
   eslint-config-airbnb
   eslint-plugin-node
   eslint-plugin-import
   eslint-plugin-jsx-a11y
   eslint-plugin-react
6. Slugify
7. Validator
8. NDB --> ndoe debugger in chromium -- npm run debug
9. bcrpyt --> encryption of password
10. jsonwebtoken --> to create JWT for authentication
11. nodemailer --> send email thorugh node
12. express-rate-limit --> for implementing rate limiting (API limiting).
13. express-mongo-sanitize --> Data sanitization
14. hpp --> for preventing parameter pollution
15. xss-clean --> data sanitization against XSS
16. pug --> express template engine for rendering pages
17. axios --> fetching API
18. cookie-parser --> parse cookie in browser
19. @babel/ployfill
20. parcel-bundler --> making file bundles
21. multer --> uploading files
22. sharp --> to resize the images

## starting steps

1. npm init for package.json
2. npm i express@4
3. app.js be default express code is written in app.js convention
4. npm i nodemon
5. package.json --> "scripts" { "start": "nodemon app.js"}
6. \_\_dirname --> locate current folder (daptours)
7. fs.readFileSync() --> method, we can read files in a synchronous way
8. node ./dev-data/data/import-dev-data.js --delete --> to delete existing demo data
9. node ./dev-data/data/import-dev-data.js --import --> to import new json file data

### Postman

ADVANCE postman setup ->
Setting UP environment in postman

1. Two environments - Dev: Daptours
   Prod: Daptours
2. setting variable - URL : http://127.0.0.1:3000/
   current variable to - http://127.0.0.1:3000/
3. TESTS in requests - pm.environment.set("jwt", pm.response.json().token);
   to save JSONwebToekn in environment.
4. Authorization in GET allTours - Bearer Token > {{jwt}}

### Mailtrap

EMAIL Testing with https://mailtrap.io <br>
Sends Dummy mails to check the functionality of modemailer and resetToken.<br>
Sending email nodemailer.

### Parcel- bundler

package.json -- "watch:js": "parcel watch ./public/js/index.js --out-dir ./public/js --out-file bundle.js",
"build:js": "parcel watch ./public/js/index.js --out-dir ./public/js --out-file bundle.js"
terminal -- npm run watch:js 1. to create bundle of files 2.
