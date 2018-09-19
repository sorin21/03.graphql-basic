const express = require('express');
const expressGraphQL = require('express-graphql');
const schema = require('./schema/schema');
const app = express();

app.use('/graphql', expressGraphQL({
  // es6 schema: schema
  schema,
  // a tool that allows to make queries
  graphiql: true
}))
app.listen(4000, () => {
  console.log("Listening");
})