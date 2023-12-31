import { gql } from "@apollo/client";

export const getCurrentUserTransferFiles = gql`
  query GetCurrentUserTransferFiles($getCurrentUserTransferFilesId: ID!) {
    getCurrentUserTransferFiles(id: $getCurrentUserTransferFilesId) {
      id
      name
      fileName
      size
      type
      signature
      createdAt
      updatedAt
    }
  }
`;
