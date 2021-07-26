import React, { useState } from 'react'

export default function Counter() {
  const [state, setState] = useState({ counter: 0 })

  const _resetCounter = () => {
    setState({ counter: 0 })
  }

  const _increaseCounter = () => {
    setState(prevState => {
      return {
        counter: prevState.counter + 1
      }
    })
  }

  return (
    <div className="counter">
      <div>Counter : { state.counter }</div>
      <button onClick={_resetCounter} className="btn-default btn-warning text-white">Reset Counter</button>
      <button onClick={_increaseCounter} className="btn-success text-white">Increase counter by 1</button>
    </div>
  )
}
