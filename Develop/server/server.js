const express = require("express");
const path = require("path");
// const routes = require("./routes");
const { authMiddleware } = require("./utils/auth");

// import apollo server
const { ApolloServer } = require("apollo-server-express");
// importing typeDefs and resolvers
const { typeDefs, resolvers } = require("./schemas");
const db = require("./config/connection");

const app = express();
const PORT = process.env.PORT || 3001;

const startServer = async () => {
  // create a new apollo server & pass in schema data
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: authMiddleware,
  });
  // start apollo server
  await server.start();
  // integrate Apollo server with the Express application as middleware
  server.applyMiddleware({ app });
  // log where we can go to test GQL API
  console.log(`Use GraphQL at http://localhost: ${PORT}${server.graphqlPath}`);
};
// initialize the Apollo server
startServer();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// db.once("open", () => {
//   app.listen(PORT, () => {
//     console.log(`API server running on port ${PORT}!`);
//   });
// });

// if we're in production, serve client/build as static assets
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../client/build")));
}

// app.use(routes);

db.once("open", () => {
  app.listen(PORT, () => console.log(`🌍 Now listening on localhost:${PORT}`));
});
