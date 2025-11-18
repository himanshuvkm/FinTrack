import React from 'react'

function Authlayout({children}:{children:React.ReactNode}) {
  return (
    <div className="flex justify-center mt-30">{children}</div>
  )
}

export default Authlayout