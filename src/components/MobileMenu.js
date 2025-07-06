import React from 'react'
import { Menu } from 'antd'
import { PieChartOutlined, LineChartOutlined } from '@ant-design/icons'
import { Link, useLocation } from 'react-router-dom'

const items = [
  {
    key: '1',
    icon: <PieChartOutlined />,
    label: <Link to="/orcamento">Orçamento</Link>
  },
  {
    key: '2',
    icon: <LineChartOutlined />,
    label: <Link to="/media-mensal">Média Mensal</Link>
  }
]

const MobileMenu = () => {
  const location = useLocation()
  const selectedKey = location.pathname.includes('media-mensal') ? '2' : '1'

  return (
    <div className="mobile-menu">
      <Menu mode="horizontal" selectedKeys={[selectedKey]} items={items} />
    </div>
  )
}

export default MobileMenu
