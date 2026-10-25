import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { adminAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import { 
  User, Mail, ShieldAlert, ShieldCheck, 
  Filter, Search, Terminal, Activity,
  ChevronRight, MoreHorizontal
} from 'lucide-react';
import Navbar from '../../components/common/Navbar';
import './Users.css';

const Users = () => {
  const { user, logout } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({ role: '', status: '' });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getAllUsers(filter);
      setUsers(response.data.users);
    } catch (error) {
      toast.error('DATABASE_SYNC_ERROR');
    } finally {
      setLoading(false);
    }
  };

  const handleBlock = async (userId, currentStatus) => {
    const block = currentStatus !== 'blocked';
    try {
      await adminAPI.blockUser(userId, block);
      toast.success(block ? 'ACCESS_REVOKED' : 'ACCESS_RESTORED');
      fetchUsers();
    } catch (error) {
      toast.error('PROTOCOL_ERROR');
    }
  };

  return (
    <div className="admin-sleek-root">
      <Navbar user={user} logout={logout} role="admin" />
      <div className="noise-bg"></div>

      <main className="container user-registry-container">
        {/* --- PAGE HUD --- */}
        <header className="sleek-hud">
          <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }}>
            <h1 className="bebas">USER_REGISTRY</h1>
            <p className="system-path"><Terminal size={12}/> ROOT / DATABASE / ENTITIES</p>
          </motion.div>
          <div className="live-counter">
             <span className="count bebas">{users.length}</span>
             <span className="label">ACTIVE_NODES</span>
          </div>
        </header>

        {/* --- TACTICAL FILTER BAR --- */}
        <section className="sleek-filter-bar">
          <div className="filter-item">
            <Filter size={16} className="orange-text" />
            <select value={filter.role} onChange={(e) => setFilter({ ...filter, role: e.target.value })}>
              <option value="">ALL_ROLES</option>
              <option value="worker">WORKERS</option>
              <option value="employer">EMPLOYERS</option>
              <option value="admin">ADMINS</option>
            </select>
          </div>
          <div className="filter-item">
            <Activity size={16} className="orange-text" />
            <select value={filter.status} onChange={(e) => setFilter({ ...filter, status: e.target.value })}>
              <option value="">ALL_STATUS</option>
              <option value="pending">PENDING</option>
              <option value="active">ACTIVE</option>
              <option value="blocked">BLOCKED</option>
            </select>
          </div>
          <button onClick={fetchUsers} className="scan-btn">
            SCAN_DATABASE <Search size={16} />
          </button>
        </section>

        {/* --- USER LIST --- */}
        <div className="registry-stream">
          {loading ? (
            <div className="sleek-loader">SCANNING_ENTITIES...</div>
          ) : (
            <AnimatePresence>
              {users.map((u, idx) => (
                <motion.div 
                  key={u._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className={`registry-row ${u.status}`}
                >
                  <div className="u-avatar">
                    {u.name.charAt(0).toUpperCase()}
                  </div>

                  <div className="u-details">
                    <div className="u-identity">
                       <h3>{u.name}</h3>
                       <span className={`role-pill ${u.role}`}>{u.role.toUpperCase()}</span>
                    </div>
                    <div className="u-meta">
                      <Mail size={12}/> <span>{u.email}</span>
                    </div>
                  </div>

                  <div className="u-status-section">
                    <div className={`status-micro ${u.status}`}>
                      <span className="dot"></span> {u.status.toUpperCase()}
                    </div>
                  </div>

                  <div className="u-actions">
                    {u.role !== 'admin' && (
                      <button 
                        onClick={() => handleBlock(u._id, u.status)} 
                        className={`tactical-btn ${u.status === 'blocked' ? 'restore' : 'block'}`}
                      >
                        {u.status === 'blocked' ? <ShieldCheck size={16}/> : <ShieldAlert size={16}/>}
                        <span>{u.status === 'blocked' ? 'RESTORE' : 'REVOKE'}</span>
                      </button>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>
      </main>
    </div>
  );
};

export default Users;