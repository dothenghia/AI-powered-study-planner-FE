import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Button, Layout as AntLayout, Menu } from 'antd';
import { useNavigate } from "react-router-dom";
import useAuthStore from "../stores/authStore";

const { Header, Content } = AntLayout;

const Layout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, email } = useAuthStore();

  // If the current route is login or register, only render the Outlet
  if (location.pathname === '/login' || location.pathname === '/register') {
    return <Outlet />;
  }

  return (
    <AntLayout className="min-h-screen">
      <Header style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: '52px',
        lineHeight: '52px',
        padding: '0 20px'
      }}>
        <Menu
          theme="dark"
          mode="horizontal"
          selectedKeys={[location.pathname]}
          style={{ flex: 1, height: '52px', lineHeight: '52px' }}
          items={[
            {
              key: '/task',
              label: <Link to="/task">Task Manangement</Link>
            },
            {
              key: '/view',
              label: <Link to="/view">Calendar View</Link>
            },
          ]}
        />
        <div>
          <span className='mr-4 text-white/80'>Welcome, {email}</span>
          <Button
            onClick={() => {
              logout();
              navigate("/login");
            }}
          >Logout</Button>
        </div>
      </Header>
      <Content style={{ height: 'calc(100vh - 52px)', overflow: 'auto' }}>
        <Outlet />
      </Content>
    </AntLayout>
  );
};

export default Layout;
