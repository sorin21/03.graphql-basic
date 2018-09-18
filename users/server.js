const express = require('express');
const expressGraphQL = require('express-graphql');
const app = express();

app.use('/graphql', expressGraphQL({
  // a tool that allows to make queries
  graphiql: true
}))
app.listen(4000, () => {
  console.log("Listening");
})