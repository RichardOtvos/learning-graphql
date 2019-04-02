const { ApolloServer } = require('apollo-server');

let photos = [];

const typeDefs = `
    type Query {
        totalPhotos: Int!
    }

    type Mutation{
        postPhoto(name: String! description: String): Boolean!
    }
`;

const resolvers = {
    Query: {
        totalPhotos: () => photos.length
    },
    Mutation: {
        postPhoto: (parent, args) => {
            console.log(parent);
            console.log(args);
            photos.push(args);
            return true;
        }
    }
};

const server = new ApolloServer({
    typeDefs,
    resolvers
});

server
    .listen()
    .then(({ url }) => console.log(`GraphQL Server is running at ${url}`));