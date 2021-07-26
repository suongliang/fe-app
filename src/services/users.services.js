export const endpoint = 'https://60f5935218254c00176dff43.mockapi.io/users/employees'
export const positionsEndPoint = 'https://60f5935218254c00176dff43.mockapi.io/users/positions'
class UserService {
  static getEmployees = () => {
    return fetch(endpoint).then((response) => {
      return response.json()
    })
      .catch(err => Promise.reject(err))
  }

  static getEmployeesByPagination = (page, limit) => {
    return fetch(`${endpoint}?page=${page}&limit=${limit}`)
      .then(response => response.json())
      .catch(err => Promise.reject(err))
  }

  static deleteEmployee = (employeeId) => {
    return fetch(`${endpoint}/${employeeId}`, {
      method: 'DELETE'
    }).then(response => response.json())
      .catch(err => Promise.reject(err))
  }

  static getPositions = () => {
    return fetch(positionsEndPoint).then(response => response.json())
      .catch(err => Promise.reject(err))
  }
}

export default UserService
