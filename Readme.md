# daptours

Tour planner website with API.
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

### starting steps

1. npm init for package.json
2. npm i express@4
3. app.js be default express code is written in app.js convention
4. npm i nodemon
5. package.json --> "scripts" { "start": "nodemon app.js"}
6. \_\_dirname --> locate current folder (daptours)
7. fs.readFileSync() --> method, we can read files in a synchronous way
