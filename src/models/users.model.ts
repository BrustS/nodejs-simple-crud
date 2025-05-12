import { v4 as uuidv4 } from 'uuid';
import { IUser, INewUser } from '../types/users.type';

const users: IUser[] = [];

export const getAll = (): IUser[] => users;

export const getById = (id: string): IUser | undefined => users.find(user => user.id === id);

export const create = (newUser: INewUser): IUser => {
  const user: IUser = { id: uuidv4(), ...newUser };
  users.push(user);
  return user;
};

export const update = (id: string, updatedUser: INewUser): IUser | undefined => {
  const index = users.findIndex(user => user.id === id);
  if (index !== -1) {
    users[index] = { id: id, ...updatedUser };
    return users[index];
  }
  return undefined;
};

export const remove = (id: string): boolean => {
  const index = users.findIndex(user => user.id === id);
  if (index !== -1) {
    users.splice(index, 1);
    return true;
  }
  return false;
};