export interface Account {
  id: string;
  username: string;
  displayName: string;
  passwordHash: string;
  createdAt: string;
}

export interface PublicAccount {
  id: string;
  username: string;
  displayName: string;
  createdAt: string;
}

export interface Session {
  token: string;
  accountId: string;
  createdAt: string;
}
