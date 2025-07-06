import React from 'react'
import { Progress } from 'antd'

const CategoryProgressBar = ({ total, goal }) => {
  const percent = goal > 0 ? Math.min((total / goal) * 100, 100) : 0
  const status = total > goal ? 'exception' : 'active'
  return <Progress percent={Math.round(percent)} status={status} />
}

export default CategoryProgressBar
