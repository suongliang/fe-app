import React, { useEffect, useMemo, useState } from 'react'
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
        if (getEmployeesTempData) {
          data[0] = data[0].concat(JSON.parse(getEmployeesTempData))
        }
        const chunkEmployees = _chunkingEmployees(data[0])
        setState({
          ...state, employees: data[0], chunkEmployees, positions: data[1], pageCount: Math.ceil(data[0].length / 5), isLoadingData: false
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
    const newData = [...state.employees]
    newData.push(employee)
    const newChunks = _chunkingEmployees(newData)
    setState({ ...state, chunkEmployees: newChunks, employees: newData, pageCount: Math.ceil(newData.length / 5) })
  }

  const _setChunkingList = (totalEmployees: Array<Models.Employee>, isDeleteOperation?: boolean) => {
    setState({ ...state, isLoadingData: true })
    let newData = [...totalEmployees]
    if (!isDeleteOperation) {
      const getEmployeesTempData = localStorage.getItem('newEmployees')
      let array = []
      if (getEmployeesTempData) {
        array = JSON.parse(getEmployeesTempData)
      }
      newData = newData.concat(array)
    }
    const newChunks = _chunkingEmployees(newData)
    setState({ ...state, chunkEmployees: newChunks, isLoadingData: false, employees: newData, pageCount: Math.ceil(newData.length / 5) })
  }

  const refetchEmployeesList = async () => {
    setState({ ...state, isLoadingData: true })
    const employees = await UserService.getEmployees()
    if (employees) {
      _setChunkingList(employees)
    }
  }

  const _getLocalStorageData = (): Array<Models.Employee> | [] => {
    const getEmployeesTempData = localStorage.getItem('newEmployees')
    if (getEmployeesTempData) {
      return JSON.parse(getEmployeesTempData)
    }
    return []
  }

  const _setLocalStorageData = (array: Array<Models.Employee>) => {
    localStorage.setItem('newEmployees', JSON.stringify(array))
  }

  const _deleteEmployee = (employeeId: number) => {
    if (employeeId) {
      const isEmployeeExisted = state.employees.findIndex(employee => employee.id === employeeId)
      const localStorageData = _getLocalStorageData()
      const localDataIndex = localStorageData.length > 0 ? localStorageData.findIndex(employee => employee.id === employeeId) : -1
      if (localDataIndex <= -1) {
        if (isEmployeeExisted) UserService.deleteEmployee(employeeId).then(() => refetchEmployeesList())
      } else {
        localStorageData.splice(localDataIndex, 1)
        _setLocalStorageData(localStorageData)
        const newData = [...state.employees]
        const recordIndex = newData.findIndex(x => x.id === employeeId)
        newData.splice(recordIndex, 1)
        _setChunkingList(newData, true)
      }
    }
  }

  const _handlePageClick = async ({ selected }: any) => {
    setState({
      ...state,
      pageIndex: selected
    })
  }

  const activePageIndex = useMemo(() => state.pageIndex, [state.employees])

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
          initialPage={activePageIndex}
          onPageChange={_handlePageClick}
          containerClassName={'pagination'}
          activeClassName={'active'}
        />
      }
    </section>
  )
}