import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { vehicleAPI } from '../services/api';
import { VehicleRequest } from '../types';
import { Car, Plus, Calendar, MapPin, Clock, Eye } from 'lucide-react';
import { toast } from 'react-toastify';
import styled from 'styled-components';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 40px;
  flex-wrap: wrap;
  gap: 20px;
`;

const Title = styled.h1`
  color: #2c3e50;
`;

const NewRequestButton = styled(Link)`
  background: #3498db;
  color: white;
  padding: 12px 24px;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s;
  
  &:hover {
    background: #2980b9;
    transform: translateY(-2px);
  }
`;

const RequestsContainer = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  overflow: hidden;
`;

const RequestsHeader = styled.div`
  padding: 20px 30px;
  border-bottom: 1px solid #ecf0f1;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const RequestsTitle = styled.h2`
  color: #2c3e50;
  margin: 0;
`;

const RefreshButton = styled.button`
  background: #95a5a6;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.3s;
  
  &:hover {
    background: #7f8c8d;
  }
`;

const RequestsGrid = styled.div`
  display: grid;
  gap: 20px;
  padding: 30px;
  
  @media (min-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  }
`;

const RequestCard = styled.div`
  border: 1px solid #ecf0f1;
  border-radius: 8px;
  padding: 20px;
  transition: all 0.3s;
  
  &:hover {
    box-shadow: 0 4px 8px rgba(0,0,0,0.1);
    transform: translateY(-2px);
  }
`;

const RequestHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 15px;
`;

const RequestNumber = styled.h3`
  color: #2c3e50;
  margin: 0;
  font-size: 1.1rem;
`;

const StatusBadge = styled.span<{ status: string }>`
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  
  ${props => props.status === 'pending' && `
    background: #fff3cd;
    color: #856404;
  `}
  
  ${props => props.status === 'returned' && `
    background: #d4edda;
    color: #155724;
  `}
`;

const RequestDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 15px;
`;

const DetailRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: #7f8c8d;
  font-size: 14px;
`;

const DetailIcon = styled.div`
  color: #3498db;
`;

const RequestActions = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 15px;
`;

const ActionButton = styled.button`
  background: #3498db;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 12px;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: background-color 0.3s;
  
  &:hover {
    background: #2980b9;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 60px 30px;
  color: #7f8c8d;
`;

const EmptyIcon = styled.div`
  margin-bottom: 20px;
`;

const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 60px;
`;

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  padding: 20px 30px;
  border-top: 1px solid #ecf0f1;
`;

const PaginationButton = styled.button<{ active?: boolean }>`
  padding: 8px 12px;
  border: 1px solid #ddd;
  background: ${props => props.active ? '#3498db' : 'white'};
  color: ${props => props.active ? 'white' : '#333'};
  border-radius: 4px;
  cursor: pointer;
  
  &:hover:not(:disabled) {
    background: ${props => props.active ? '#2980b9' : '#f8f9fa'};
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const MyRequests: React.FC = () => {
  const [requests, setRequests] = useState<VehicleRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    loadRequests();
  }, [currentPage]);

  const loadRequests = async () => {
    try {
      setLoading(true);
      const response = await vehicleAPI.getMyRequests(currentPage, 10);
      setRequests(response.requests);
      setTotalPages(response.totalPages);
    } catch (error) {
      toast.error('Failed to load requests');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatTime = (timeString: string) => {
    return timeString.substring(0, 5); // HH:MM format
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const renderPagination = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(
        <PaginationButton
          key={i}
          active={i === currentPage}
          onClick={() => handlePageChange(i)}
        >
          {i}
        </PaginationButton>
      );
    }
    return pages;
  };

  return (
    <Container>
      <Header>
        <Title>My Vehicle Requests</Title>
        <NewRequestButton to="/create-request">
          <Plus size={16} />
          New Request
        </NewRequestButton>
      </Header>

      <RequestsContainer>
        <RequestsHeader>
          <RequestsTitle>All Requests</RequestsTitle>
          <RefreshButton onClick={loadRequests}>
            Refresh
          </RefreshButton>
        </RequestsHeader>

        {loading ? (
          <LoadingSpinner>
            <div>Loading requests...</div>
          </LoadingSpinner>
        ) : requests.length > 0 ? (
          <>
            <RequestsGrid>
              {requests.map((request) => (
                <RequestCard key={request.id}>
                  <RequestHeader>
                    <RequestNumber>{request.request_number}</RequestNumber>
                    <StatusBadge status={request.status}>
                      {request.status}
                    </StatusBadge>
                  </RequestHeader>

                  <RequestDetails>
                    <DetailRow>
                      <DetailIcon>
                        <Calendar size={14} />
                      </DetailIcon>
                      {formatDate(request.request_date)}
                    </DetailRow>
                    
                    <DetailRow>
                      <DetailIcon>
                        <Car size={14} />
                      </DetailIcon>
                      {request.vehicle_type} - {request.vehicle_number}
                    </DetailRow>
                    
                    <DetailRow>
                      <DetailIcon>
                        <MapPin size={14} />
                      </DetailIcon>
                      {request.location}
                    </DetailRow>
                    
                    <DetailRow>
                      <DetailIcon>
                        <Clock size={14} />
                      </DetailIcon>
                      {formatTime(request.taken_time)} ({formatTime(request.estimated_usage)} duration)
                    </DetailRow>
                  </RequestDetails>

                  <div style={{ fontSize: '14px', color: '#7f8c8d', marginBottom: '10px' }}>
                    <strong>Purpose:</strong> {request.remarks.substring(0, 100)}
                    {request.remarks.length > 100 && '...'}
                  </div>

                  {request.returned_at && (
                    <DetailRow>
                      <DetailIcon>
                        <Clock size={14} />
                      </DetailIcon>
                      Returned: {formatDate(request.returned_at)}
                    </DetailRow>
                  )}
                </RequestCard>
              ))}
            </RequestsGrid>

            {totalPages > 1 && (
              <Pagination>
                <PaginationButton
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  Previous
                </PaginationButton>
                {renderPagination()}
                <PaginationButton
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Next
                </PaginationButton>
              </Pagination>
            )}
          </>
        ) : (
          <EmptyState>
            <EmptyIcon>
              <Car size={48} color="#bdc3c7" />
            </EmptyIcon>
            <h3>No requests found</h3>
            <p>You haven't made any vehicle requests yet.</p>
            <Link to="/create-request">Create your first request</Link>
          </EmptyState>
        )}
      </RequestsContainer>
    </Container>
  );
};
