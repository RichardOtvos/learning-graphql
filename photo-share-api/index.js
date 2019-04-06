const { ApolloServer } = require('apollo-server');

var _id = 0;
//sample data
var users = [
    { "githubLogin": "mHattrup", "name": "Mike Hattrup" },
    { "githubLogin": "gPlake", "name": "Glen Plake" },
    { "githubLogin": "sSchmidt", "name": "Scot Schmidt" }
]

var photos = [
    {
        "id": "1",
        "name": "Dropping the Heart Chute",
        "description": "The heart chute is one of my favorite chutes",
        "category": "ACTION",
        "githubUser": "gPlake"
    },
    {
        "id": "2",
        "name": "Enjoying the sunshine",
        "category": "SELFIE",
        "githubUser": "sSchmidt"
    },
    {
        id: "3",
        "name": "Gunbarrel 25",
        "description": "25 laps on gunbarrel today",
        "category": "LANDSCAPE",
        "githubUser": "sSchmidt"
    }
]

var tags = [
    { "photoID": "1", "userID": "gPlake" },
    { "photoID": "2", "userID": "sSchmidt" },
    { "photoID": "2", "userID": "mHattrup" },
    { "photoID": "2", "userID": "gPlake" }
]

//schema def
const typeDefs = `
    enum PhotoCategory{
        SELFIE
        PORTRAIT
        ACTION
        LANDSCAPE
        GRAPHIC
    }

    type Photo {
        id: ID!
        url: String!
        name: String!
        description: String
        category: PhotoCategory!
        postedBy: User!
        taggedUsers: [User!]!
    }

    type User {
        githubLogin: ID!
        name: String
        avatar: String
        postedPhotos: [Photo!]!
        inPhotos: [Photo!]!
    }
    
    type Query {
        totalPhotos: Int!
        allPhotos: [Photo!]!
    }

    input PostPhotoInput {
        name: String!
        category: PhotoCategory=PORTRAIT
        description: String
    }

    type Mutation{
        postPhoto(input: PostPhotoInput!): Photo!
    }
`;

const resolvers = {
    Query: {
        totalPhotos: () => photos.length,
        allPhotos: () => photos
    },
    Mutation: {
        postPhoto: (parent, { input: photoInput }) => {
            const newPhoto = {
                id: _id,
                ...photoInput
            }

            _id += 1;
            photos.push(newPhoto);
            return newPhoto;
        }
    },
    Photo: {
        url: (parent) => `http://foobarsite.com/img/img-${parent.id}.webp`,
        postedBy: (parent) => {
            return users.find(user => user.githubLogin === parent.githubUser)
        },
        taggedUsers: (parent) => tags.filter(tag => tag.photoID === parent.id)
            .map(tag => tag.userID)
            .map(userID => users.find(u => u.githubLogin === userID))
    },
    User: {
        postedPhotos: (parent) => {
            return photos.filter(photo => photo.githubUser === parent.githubLogin)
        },
        inPhotos: (parent) => tags.filter(tag => tag.userID === parent.id)
            .map(tag => tag.photoID)
            .map(photoID => photos.find(p => p.id === photoId))
    }
};

const server = new ApolloServer({
    typeDefs,
    resolvers
});

server
    .listen()
    .then(({ url }) => console.log(`GraphQL Server is running at ${url}`));