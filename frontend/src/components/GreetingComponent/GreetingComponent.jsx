import React from 'react'

function GreetingComponent({username}) {

  return (
    <div>
        <span className="text-2xl font-bold text-white rounded-md font-mono p-2">
            Welcome, {username}!
          </span>
    </div>
  )
}

export default GreetingComponent