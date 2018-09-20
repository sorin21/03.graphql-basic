const graphql = require('graphql');
const _ = require('lodash');
const axios = require('axios');
// destructing from graphql
const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLSchema,
  GraphQLList
} = graphql;

// const users = [
//   {id: '23', firstName: 'Bill', age: 20},
//   {id: '47', firstName: 'Ana', age: 21}
// ];

const CompanyType = new GraphQLObjectType({
  name: 'Company',
  fields: () => ({
    id: {type: GraphQLString},
    name: {type: GraphQLString},
    description: {type: GraphQLString},
    users: {
      type: new GraphQLList(UserType),
      // parentValue is the current company that we work with
      resolve(parentValue, args) {
        // parentValue.id for the curent company id
        // get all user asociates with this company
        return axios.get(`http://localhost:3000/companies/${parentValue.id}/users`)
        .then(response => response.data);
      }
    }
  })
})

const UserType = new GraphQLObjectType({
  name: 'User',
  // tells to grapql all the props that user has
  fields: () => ({
    id: {type: GraphQLString},
    firstName: {type: GraphQLString},
    age: {type: GraphQLInt},
    company: {
      type: CompanyType,
      resolve(parentValue, args) {
        return axios.get(`http://localhost:3000/companies/${parentValue.companyId}`)
        .then(response => response.data);
      }
    }
  })
});

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    user: {
      type: UserType,
      args: {
        id: {
          type: GraphQLString
        }
      },
      resolve(parentValue, args) {
        // return _.find(users, {id: args.id});
        // return users.find(user => user.id === args.id);
        return axios.get(`http://localhost:3000/users/${args.id}`)
          .then(response => response.data);
      }
    },
    company: {
      type: CompanyType,
      args: {
        id: {
          type: GraphQLString
        }
      },
      resolve(parentValue, args) {
        // return _.find(users, {id: args.id});
        // return users.find(user => user.id === args.id);
        return axios.get(`http://localhost:3000/companies/${args.id}`)
          .then(response => response.data);
      }
    }
  }
});


const mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    // add user to our users colection
    addUser: {
      type: UserType,
      // arguments that we pass in resolve func
      args: {
        firstName: {type: GraphQLString},
        age: {type: GraphQLInt},
        companyId: {type: GraphQLString}
      },
      resolve() {

      }
    }
  }
});

module.exports = new GraphQLSchema({
  query: RootQuery
});