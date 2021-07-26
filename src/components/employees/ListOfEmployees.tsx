import React, { ReactElement, useEffect, useState } from 'react'
import { Models } from '../../models/employee.model'
import IdGenerator from './../../helpers/IdGenerator'

interface Props {
  employees: Array<Array<Models.Employee>>,
  isLoadingData: boolean,
  pageIndex: number,
  pageCount: number,
  positions: Array<Models.Position>
  addNewEmployee: Function,
  deleteEmployee: Function
}
interface IState {
  name: string,
  email: string,
  position: string,
  isAddNew: boolean,
  error: boolean,
  nameValidationErrorMsg: string,
  emailValidationErrorMsg: string,
  positionErrorMsg: string
}
export default function ListOfEmployees({ employees, isLoadingData, pageIndex, pageCount, positions, addNewEmployee, deleteEmployee }: Props): ReactElement {
  const initState: IState = {
    name: "",
    email: "",
    position: "",
    isAddNew: false,
    error: false,
    nameValidationErrorMsg: "",
    emailValidationErrorMsg: "",
    positionErrorMsg: ""
  }
  const [state, setState] = useState(initState)

  const _toggleDisplayRowInput = () => {
    setState(prevState => {
      return {
        ...state,
        isAddNew: !prevState.isAddNew
      }
    })
  }

  const _setData = (e: any) => {
    if (e.target.value) {
      console.log(e.target.value)

      setState({
        ...state,
        [e.target.name]: e.target.value
      })
    }
  }

  const _checkEmailValid = (value: string) => {
    const emailRegex = /^[a-zA-Z0-9.]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
    return emailRegex.test(value)
  }

  const _checkNameValid = (value: string) => {
    const nameRegex = /^[a-zA-Z\s]+/
    return nameRegex.test(value)
  }

  const _setValidationMessage = (messageKeyName: string, value: string) => {
    setState({
      ...state,
      error: value !== "",
      [messageKeyName]: value
    })
  }

  useEffect(() => {
    if (state.email) {
      if (!_checkEmailValid(state.email)) {
        _setValidationMessage("emailValidationErrorMsg", "Email is not valid")
      } else {
        _setValidationMessage("emailValidationErrorMsg", "")
      }
    }
  }, [state.email])

  useEffect(() => {
    if (state.name) {
      console.log(state.name, _checkNameValid(state.name))
      if (!_checkNameValid(state.name)) {
        _setValidationMessage("nameValidationErrorMsg", "Name is not valid")
      }
    }
  }, [state.name])

  const _addNewEmployee = () => {
    if (!state.error && (state.name && state.email && state.position)) {
      const lastChunkArray = employees[pageCount - 1]
      const newId = IdGenerator.generateNextId(+lastChunkArray[lastChunkArray.length - 1].id) || Math.random()
      const newEmployee: Models.Employee = new Models.Employee(newId, state.name, state.email, new Date(), state.position)
      addNewEmployee(newEmployee)
    }
  }

  const _renderTableData = () => {
    const rowErrorCssClass = state.error ? 'error' : ''
    if (employees.length > 0) {
      return <table cellSpacing={0} cellPadding={0} >
        <thead>
          <tr>
            <th>Employee name</th>
            <th>Email</th>
            <th>Position</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {employees[pageIndex].map((employee, index) => {
            return (
              <tr key={index}>
                <td>{employee.name}</td>
                <td>{employee.email}</td>
                <td>{employee.position}</td>
                <td>
                  <button className="btn-danger" onClick={() => deleteEmployee(employee.id)}>Remove</button></td>
              </tr>
            )
          })}
          <tr className={`row-input ${rowErrorCssClass}`} style={{ display: state.isAddNew ? "table-row" : "none" }}>
            <td>
              <input type="text" onChange={_setData} placeholder="Name" name="name" id="name" />
            </td>
            <td>
              <input type="text" onChange={_setData} placeholder="Email" name="email" id="email" />
            </td>
            <td>
              <select name="position" id="position" onChange={_setData}>
                {positions.length > 0 && positions.map((position) => (<option key={position.id} value={position.name}>{position.name}</option>))}
              </select>
            </td>
            <td><button className="btn-success" onClick={_addNewEmployee} disabled={state.error || (!state.name && !state.email && !state.position)}>Add to list</button></td>
          </tr>
          <tr className="row-input row-validation" style={{ display: state.isAddNew ? "table-row" : "none" }}>
            <td className="py-0"><div className="error-msg">{state.nameValidationErrorMsg}</div></td>
            <td className="py-0"> <div className="error-msg">{state.emailValidationErrorMsg}</div></td>
            <td className="py-0"><div className="error-msg">{state.positionErrorMsg}</div></td>
            <td style={{ paddingTop: "1rem" }}><button className="btn-warning" onClick={() => {
              _toggleDisplayRowInput()
              setState(initState)
            }}>Cancel</button></td>
          </tr>
          <tr className="action" style={{ display: pageIndex === (employees.length - 1) && !state.isAddNew ? "table-row" : "none" }}>
            <td colSpan={4} className="text-right" style={{ paddingRight: '2.5rem' }}>
              <button type="button" className="btn-success" onClick={_toggleDisplayRowInput}>Add new</button>
            </td>
          </tr>
        </tbody>
      </table >
    }
    return <div>Employee list is empty.</div>
  }

  return (
    <div>
      {isLoadingData ? <span>Loading ...</span> : _renderTableData()}
    </div>
  )
}
