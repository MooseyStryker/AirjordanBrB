// backend/routes/api/index.js
const router = require('express').Router();

router.post('/test', function(req, res) {
    res.json({ requestBody: req.body });
  });
  /*
Replace the <value of XSRF-TOKEN cookie> with the value of the XSRF-TOKEN cookie. If you don't have the XSRF-TOKEN cookie anymore, access the http://localhost:8000/api/csrf/restore route to add the cookie back.

After the response returns to the browser, parse the JSON response body and print it out.

  fetch('/api/test', {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "XSRF-TOKEN": `<value of XSRF-TOKEN cookie>`             // this is the token you enter from going to the url
  },
  body: JSON.stringify({ hello: 'world' })                  // Parse JSON response body

}).then(res => res.json()).then(data => console.log(data)); // Prints the response body


*/

module.exports = router;
