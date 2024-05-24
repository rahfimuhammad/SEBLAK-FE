import React from 'react'
import { LoadingOutlined } from '@ant-design/icons'

const Spinner = ({size}) => {
  return (
    <LoadingOutlined
      style={{fontSize: size}}
    />
  )
}

export default Spinner