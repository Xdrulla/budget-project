import React from 'react'
import { BarChartOutlined, PieChartOutlined, LineChartOutlined } from '@ant-design/icons'
import { Menu } from 'antd'
import { Link } from 'react-router-dom'

const items = [
  {
    key: '1',
    icon: <PieChartOutlined />,
    label: <Link to="/orcamento">Orçamento</Link>,
  },
  {
    key: '2',
    icon: <LineChartOutlined />,
    label: <Link to="/media-mensal">Média Mensal</Link>,
  },
  {
    key: '3',
    icon: <BarChartOutlined />,
    label: <Link>Options 3</Link>,
  },
]

const AppMenu = () => {
  return (
    <div style={{ width: 256 }}>
      <Menu defaultSelectedKeys={['1']} mode="inline" theme="dark" items={items} />
    </div>
  )
}

export default AppMenu
