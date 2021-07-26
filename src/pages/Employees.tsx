import React, { useCallback, useEffect, useState } from 'react'
import ReactPaginate from 'react-paginate'
import ListOfEmployees from '../components/employees/ListOfEmployees'
import { Models } from '../models/employee.model'
import UserService from '../services/users.services'

interface StateModel {
  employees: Array<Models.Employee>,
  positions: Array<Models.Position>,
  chunkEmployees: Array<Array<Models.Employee>>,
  pageIndex: number,
  pageCount: number,
  isLoadingData: boolean,
  localData: Array<Models.Employee>
}
export default function Employees() {
  const initState: StateModel = {
    employees: [],
    chunkEmployees: [[]],
    positions: [],
    pageIndex: 0,
    pageCount: 0,
    isLoadingData: true,
    localData: []
  }
  const [state, setState] = useState(initState)

  const _chunkingEmployees = (data: Array<Models.Employee>) => {
    const chunks = []
    let i = 0

    while (i < data.length) {
      chunks.push(data.slice(i, i += 5))
    }

    return chunks
  }

  useEffect(() => {
    async function getEmployeesAndPositions() {
      const data = await Promise.all([UserService.getEmployees(), UserService.getPositions()])
      const getEmployeesTempData = localStorage.getItem('newEmployees')
      if (data) {
        const chunkEmployees = _chunkingEmployees(data[0])
        if (getEmployeesTempData) {
          chunkEmployees[chunkEmployees.length - 1] = chunkEmployees[chunkEmployees.length - 1].concat(JSON.parse(getEmployeesTempData))
        }
        setState({
          ...state, employees: data, chunkEmployees, positions: data[1], pageCount: Math.ceil(data[0].length / 5), isLoadingData: false
        })
      }
    }

    getEmployeesAndPositions()
  }, [])

  const _addNewEmployee = (employee: Models.Employee) => {
    const getEmployeesTempData = localStorage.getItem('newEmployees')
    let array = []
    if (getEmployeesTempData) {
      array = JSON.parse(getEmployeesTempData)
    }
    array.push(employee)
    localStorage.setItem('newEmployees', JSON.stringify(array))
  }

  const refetchEmployeesList = useCallback(async () => {
    const employees = await UserService.getEmployees()
    if (employees) {
      const chunkEmployees = _chunkingEmployees(employees)
      setState({ ...state, chunkEmployees })
    }
  }, [])

  const _getLocalStorageData = (): Array<Models.Employee> | [] => {
    const getEmployeesTempData = localStorage.getItem('newEmployees')
    if (getEmployeesTempData) {
      return JSON.parse(getEmployeesTempData)
    }
    return []
  }

  const _setLocalStorageData = (array: Array<Models.Employee>) => {
    const getEmployeesTempData = localStorage.getItem('newEmployees')
    if (getEmployeesTempData) {
      localStorage.setItem('newEmployees', JSON.stringify(array))
    }
  }

  const _deleteEmployee = (employeeId: number) => {
    if (employeeId) {
      const isEmployeeExisted = state.employees.findIndex(employee => employee.id === employeeId) > -1
      if (isEmployeeExisted) {
        return UserService.deleteEmployee(employeeId).then(() => refetchEmployeesList())
      } else {
        const localStorageData = _getLocalStorageData()
        const employeeIndex = localStorageData.length > 0 ? localStorageData.findIndex(employee => employee.id === employeeId) : -1
        if (employeeIndex > -1) {
          const modifiedData = localStorageData.splice(employeeIndex, 1)
          _setLocalStorageData(modifiedData)
        }
      }
    }
  }

  const _handlePageClick = async ({ selected }: any) => {
    setState({
      ...state,
      pageIndex: selected
    })
  }

  return (
    <section className="employees container">
      <ListOfEmployees {...{
        employees: state.chunkEmployees,
        pageIndex: state.pageIndex,
        isLoadingData: state.isLoadingData,
        pageCount: state.pageCount,
        positions: state.positions,
        addNewEmployee: _addNewEmployee,
        deleteEmployee: _deleteEmployee
      }} />
      {!state.isLoadingData && state.pageCount > 1 &&
        <ReactPaginate
          previousLabel={'previous'}
          nextLabel={'next'}
          breakLabel={'...'}
          pageCount={state.pageCount}
          marginPagesDisplayed={2}
          pageRangeDisplayed={5}
          onPageChange={_handlePageClick}
          containerClassName={'pagination'}
          activeClassName={'active'}
        />
      }
    </section>
  )
}