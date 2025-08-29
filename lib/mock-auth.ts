export const mockUsers = [
  {
    id: "1",
    email: "admin@test.com",
    password: "123456",
    name: "Admin Usuario",
    firstName: "Admin",
    lastName: "Usuario"
  }
]

export function findUser(email: string) {
  return mockUsers.find(u => u.email === email)
}

export function createUser(userData: any) {
  const newUser = {
    id: String(Date.now()),
    ...userData,
    name: `${userData.firstName} ${userData.lastName}`
  }
  mockUsers.push(newUser)
  return newUser
}

export function validatePassword(password: string, userPassword: string) {
  return password === userPassword // En mock, comparación simple
}
