import React, { useState } from 'react'
import { BarChartOutlined, PieChartOutlined, LineChartOutlined, MenuUnfoldOutlined, MenuFoldOutlined } from '@ant-design/icons'
import { Menu, Button } from 'antd'
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
    label: <Link to="/options3">Options 3</Link>,
  },
]

const AppMenu = () => {
  const [collapsed, setCollapsed] = useState(false)

  const toggleCollapsed = () => {
    setCollapsed(!collapsed)
  }

  return (
    <div className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      <Button onClick={toggleCollapsed} className="menu-toggle-button">
        {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
      </Button>
      <Menu
        defaultSelectedKeys={['1']}
        mode="inline"
        theme="dark"
        items={items}
        inlineCollapsed={collapsed}
        style={{ backgroundColor: 'var(--dark-background)' }}
      />
    </div>
  )
}

export default AppMenu