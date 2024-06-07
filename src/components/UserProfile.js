import React from 'react'
import { Menu, Dropdown, Typography, Avatar } from 'antd'
import { LogoutOutlined, UserOutlined } from '@ant-design/icons'

const { Text } = Typography

const UserProfile = ({ user, onLogout }) => {
  const items = [
    {
      key: 'email',
      label: (
        <Text>Usuário: {user.email}</Text>
      )
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      label: (
        <div onClick={onLogout}>
          <LogoutOutlined style={{ marginRight: 16 }} />
          Sair
        </div>
      )
    }
  ]

  return (
    <Dropdown overlay={<Menu items={items} />} trigger={['click']} placement="bottomRight">
      <div className="user-profile">
        <Avatar style={{ backgroundColor: '#000' }} icon={<UserOutlined />} />
      </div>
    </Dropdown>
  )
}

export default UserProfile
