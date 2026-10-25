import React from 'react';

const UserTable = ({ users, onBlock, onUnblock }) => {
  const getStatusBadgeClass = (status) => {
    const classes = {
      pending: 'badge-pending',
      active: 'badge-active',
      rejected: 'badge-rejected',
      blocked: 'badge-rejected'
    };
    return classes[status] || 'badge-pending';
  };

  const getRoleBadgeStyle = (role) => {
    const styles = {
      worker: { background: '#dbeafe', color: '#1e40af' },
      employer: { background: '#d1fae5', color: '#065f46' },
      admin: { background: '#fef3c7', color: '#92400e' }
    };
    return styles[role] || { background: '#f3f4f6', color: '#374151' };
  };

  const handleBlock = (userId, currentStatus) => {
    const action = currentStatus === 'blocked' ? 'unblock' : 'block';
    if (window.confirm(`Are you sure you want to ${action} this user?`)) {
      if (action === 'block') {
        onBlock(userId);
      } else {
        onUnblock(userId);
      }
    }
  };

  if (!users || users.length === 0) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
        <p style={{ color: '#6b7280', fontSize: '16px' }}>No users found</p>
      </div>
    );
  }

  return (
    <div style={{ overflowX: 'auto' }}>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Mobile</th>
            <th>Role</th>
            <th>Status</th>
            <th>Registered</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id}>
              <td>
                <strong>{user.name}</strong>
                {user.companyName && (
                  <div style={{ fontSize: '12px', color: '#6b7280' }}>
                    {user.companyName}
                  </div>
                )}
              </td>
              <td>{user.email}</td>
              <td>{user.mobile}</td>
              <td>
                <span 
                  className="badge" 
                  style={getRoleBadgeStyle(user.role)}
                >
                  {user.role.toUpperCase()}
                </span>
              </td>
              <td>
                <span className={`badge ${getStatusBadgeClass(user.status)}`}>
                  {user.status.toUpperCase()}
                </span>
              </td>
              <td style={{ fontSize: '14px', color: '#6b7280' }}>
                {new Date(user.createdAt).toLocaleDateString()}
              </td>
              <td>
                {user.role !== 'admin' && (
                  <button
                    onClick={() => handleBlock(user._id, user.status)}
                    className={`btn ${user.status === 'blocked' ? 'btn-success' : 'btn-danger'}`}
                    style={{ padding: '6px 12px', fontSize: '12px' }}
                  >
                    {user.status === 'blocked' ? 'Unblock' : 'Block'}
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserTable;

