import { getAll, getById, create, update, remove } from '../models/users.model';
import { validate as uuidValidate } from 'uuid';
import { INewUser } from '../types/users.type';

export const getUsers = () => {
  return getAll();
};

export const getUser = (userId: string) => {
  if (!uuidValidate(userId)) {
    return { status: 400, message: 'Invalid userId' };
  }

  const user = getById(userId);

  if (!user) {
    return { status: 404, message: 'User not found' };
  }

  return { status: 200, data: user };
};

export const createUser = (body: any) => {
  const { username, age, hobbies } = body;

  if (!username || !age || !hobbies) {
    return { status: 400, message: 'Missing required fields' };
  }

  const newUser: INewUser = { username, age, hobbies };
  const createdUser = create(newUser);
  return { status: 201, data: createdUser };
};

export const updateUser = (userId: string, body: any) => {
  if (!uuidValidate(userId)) {
    return { status: 400, message: 'Invalid userId' };
  }

  const { username, age, hobbies } = body;

  if (!username || !age || !hobbies) {
    return { status: 400, message: 'Missing required fields' };
  }

  const updatedUser: INewUser = { username, age, hobbies };
  const user = update(userId, updatedUser);

  if (!user) {
    return { status: 404, message: 'User not found' };
  }

  return { status: 200, data: user };
};

export const deleteUser = (userId: string) => {
  if (!uuidValidate(userId)) {
    return { status: 400, message: 'Invalid userId' };
  }

  const deleted = remove(userId);

  if (!deleted) {
    return { status: 404, message: 'User not found' };
  }

  return { status: 204 };
};