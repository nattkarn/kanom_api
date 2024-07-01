// utils/mock.model.ts
export type MockType<T> = {
    [P in keyof T]?: jest.Mock<{}>;
  };
  
  export const mockModel = () => ({
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    remove: jest.fn(),
    save: jest.fn(),
    exec: jest.fn(),
  });
  