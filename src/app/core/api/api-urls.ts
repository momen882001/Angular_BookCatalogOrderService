export const URLs = {
  apiBaseUrl: 'http://localhost:8000/api/',

  // auth
  login: 'auth/login',
  register: 'auth/register',

  // books
  getAllBooks: 'book',
  createBook: 'book',
  updateBook: 'book/:id',

  // users
  getAllUsers: 'user',

  // orders
  getAllOrders: 'order',
  placeOrder: 'order',
  cancelOrder: 'order/:id/cancel',
};
