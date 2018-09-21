const graphql = require('graphql');
const _ = require('lodash');
const axios = require('axios');
// destructing from graphql
const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLSchema,
  GraphQLList,
  GraphQLNonNull
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
        // GraphQLNotNull: when someone provides a mutation they must add firstName,age
        firstName: {type: new GraphQLNonNull(GraphQLString)},
        age: {type: new GraphQLNonNull(GraphQLInt)},
        companyId: {type: GraphQLString}
      },
      resolve(parentValue, {firstName, age}) {
        return axios.post(`http://localhost:3000/users`, {firstName, age})
          .then(response => response.data);
      }
    },
    deleteUser: {
      type: UserType,
      args: {
        // don't call mutation if the id doesn't exist
        id: {type: new GraphQLNonNull(GraphQLString)}
      },
      resolve(parentValue, {id}) {
        return axios.delete(`http://localhost:3000/users/${id}`)
          .then(response => response.data);
      }
    },
    editUser: {
      type: UserType,
      // arguments that we pass in resolve func
      args: {
        id: {type: new GraphQLNonNull(GraphQLString)},
        firstName: {type: GraphQLString},
        age: {type: GraphQLInt},
        companyId: {type: GraphQLString}
      },
      resolve(parentValue, args) {
        return axios.patch(`http://localhost:3000/users/${args.id}`, args)
          .then(response => response.data);
      }
    }
  }
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation
});

