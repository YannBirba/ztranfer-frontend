import { gql } from "@apollo/client";

export const getTransferByLinkToken = gql`
  query GetTransferByLinkToken($token: String!) {
    getTransferByLinkToken(token: $token) {
      id
      name
      description
      isPrivate
      createdBy {
        name
        email
      }
      createdAt
      updatedAt
      files {
        id
        name
        fileName
        size
        type
        signature
        createdAt
        updatedAt
      }
      link {
        startDate
        endDate
      }
    }
  }
`;
