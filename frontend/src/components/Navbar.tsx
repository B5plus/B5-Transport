import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Car, User, LogOut, Settings, Home } from 'lucide-react';
import styled from 'styled-components';

const Nav = styled.nav`
  background: #2c3e50;
  color: white;
  padding: 1rem 0;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
`;

const NavContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Logo = styled(Link)`
  display: flex;
  align-items: center;
  font-size: 1.5rem;
  font-weight: bold;
  color: white;
  text-decoration: none;
  
  svg {
    margin-right: 10px;
    color: #3498db;
  }
`;

const NavMenu = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
`;

const NavLink = styled(Link)`
  color: white;
  text-decoration: none;
  padding: 8px 16px;
  border-radius: 4px;
  transition: background-color 0.3s;
  display: flex;
  align-items: center;
  gap: 8px;
  
  &:hover {
    background-color: #34495e;
  }
`;

const UserMenu = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
`;

const UserInfo = styled.span`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const LogoutButton = styled.button`
  background: transparent;
  border: 1px solid white;
  color: white;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s;
  
  &:hover {
    background: white;
    color: #2c3e50;
  }
`;

export const Navbar: React.FC = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <Nav>
      <NavContainer>
        <Logo to="/">
          <Car size={24} />
          B5 Transport
        </Logo>
        
        <NavMenu>
          {isAuthenticated ? (
            <>
              <NavLink to="/dashboard">
                <Home size={16} />
                Dashboard
              </NavLink>
              <NavLink to="/create-request">
                <Car size={16} />
                New Request
              </NavLink>
              <NavLink to="/my-requests">
                My Requests
              </NavLink>
              {isAdmin && (
                <>
                  <NavLink to="/admin">
                    <Settings size={16} />
                    Admin Panel
                  </NavLink>
                  <NavLink to="/admin/requests">
                    All Requests
                  </NavLink>
                </>
              )}
            </>
          ) : (
            <>
              <NavLink to="/login">Login</NavLink>
              <NavLink to="/register">Register</NavLink>
            </>
          )}
        </NavMenu>
        
        {isAuthenticated && (
          <UserMenu>
            <UserInfo>
              <User size={16} />
              {user?.name}
            </UserInfo>
            <LogoutButton onClick={handleLogout}>
              <LogOut size={16} />
              Logout
            </LogoutButton>
          </UserMenu>
        )}
      </NavContainer>
    </Nav>
  );
};
