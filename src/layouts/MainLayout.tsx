import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { Layout, Menu, Button } from 'antd';
import { useAuthStore } from '../stores';

const { Header, Content } = Layout;

const MainLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, email } = useAuthStore();

  const isAuthPage = ['/login', '/register'].includes(location.pathname);
  
  if (isAuthPage) {
    return <Outlet />;
  }

  const menuItems = [
    {
      key: '/task',
      label: <Link to="/task">Task Management</Link>
    },
    {
      key: '/view',
      label: <Link to="/view">Calendar View</Link>
    },
  ];

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <Layout className="min-h-screen">
      <Header className="flex justify-between items-center h-[52px] px-5">
        <Menu
          theme="dark"
          mode="horizontal"
          selectedKeys={[location.pathname]}
          className="flex-1 h-[52px]"
          items={menuItems}
        />
        <div className="flex items-center">
          <span className="mr-4 text-white/80">Welcome, {email}</span>
          <Button onClick={handleLogout}>Logout</Button>
        </div>
      </Header>
      <Content className="h-[calc(100vh-52px)] overflow-auto">
        <Outlet />
      </Content>
    </Layout>
  );
};

export default MainLayout; 