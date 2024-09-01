import express from "express";
import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";

const products = [
  {
    id: "1",
    name: "product 1",
    description: "Description A",
    price: 19.89,
  },
  {
    id: "2",
    name: "product 2",
    description: "Description B",
    price: 29.89,
  },
  {
    id: "3",
    name: "product 3",
    description: "Description C",
    price: 39.89,
  },
  {
    id: "4",
    name: "product 4",
    description: "Description D",
    price: 49.89,
  },
  {
    id: "5",
    name: "product 5",
    description: "Description E",
    price: 59.89,
  },
];

const typeDefs = `
type Product {
    id: ID!
    name: String!
    description: String
    price: Float!
}

type Query {
    getAllProducts: [Product]
    getProductById(id: ID!): Product
    getProductByName(name: String!): [Product]
}
type Mutation {
    updateProduct(id: ID!, name: String, description: String, price: Float): Product
    deleteProduct(id: ID!): String
    createProduct(name: String!, description: String, price: Float!): Product
}
    
 type Subscription {
 productUpdate: Product
}
`;

const resolvers = {
  Query: {
    getAllProducts: () => products,
    getProductById: (_, { id }) => products.find((prod) => prod.id === id),
    getProductByName: (_, { name }) =>
      products.filter((prod) => prod.name.includes(name)),
  },
  Mutation: {
    updateProduct: (_, { id, name, description, price }) => {
      const productIndex = products.findIndex((product) => product.id === id);
      if (productIndex === -1) {
        throw new Error("Product not found");
      }
      products[productIndex] = {
        ...products[productIndex],
        name,
        description,
        price,
      };
      return products[productIndex];
    },
    deleteProduct: (_, { id }) => {
      const productIndex = products.findIndex((product) => product.id === id);
      if (productIndex === -1) {
        throw new Error("Product not found");
      }
      products.splice(productIndex, 1);
      return "Product delete successfully";
    },
    createProduct: (_, { name, description, price }) => {
      const newProduct = {
        id: String(products.length + 1),
        name,
        description,
        price,
      };
      products.push(newProduct);
      return newProduct;
    },
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

const { url } = await startStandaloneServer(server, {
  listen: {
    port: 4000,
  },
});

console.log(`Server ready at ${url}`);
