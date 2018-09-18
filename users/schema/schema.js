const graphql = require('graphql');
const _ = require('lodash');
// destructing from graphql
const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt
} = graphql;

const users = [
  {id: '23', firstName: 'Bill', age: 20},
  {id: '47', firstName: 'Ana', age: 21}
];

const UserType = new GraphQLObjectType({
  name: 'User',
  // tells to grapql all the props that user has
  fields: {
    id: {type: GraphQLString},
    firstName: {type: GraphQLString},
    age: {type: GraphQLInt}
  }
});

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    user: {
      type: UserType,
      args: {id: {
        type: GraphQLString
      }},
      resolve(parentValue, args) {

      }
    }
  }
})