export interface UserType {
  _id?: string;
  name: string;
  email: string;
  emailVerified?: boolean;
  hashedPassword?: string;
  image?: string;
  publicImageId?: string;
  createdAt: Date;
  updatedAt: Date;
}
