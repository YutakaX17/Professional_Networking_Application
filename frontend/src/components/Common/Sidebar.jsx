import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useGetCurrentRole } from "../../utils/roleUtils";
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Collapse,
  Typography,
  Divider,
  IconButton
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Person as ProfileIcon,
  Work as JobIcon,
  People as NetworkIcon,
  Settings as SettingsIcon,
  SupervisorAccount as AdminIcon,
  Message as MessageIcon,
  Notifications as NotificationsIcon,
  Logout as LogoutIcon,
  ExpandLess,
  ExpandMore,
  Description as DescriptionIcon,
  BarChart as BarChartIcon,
  Business as BusinessIcon,
  Assignment as AssignmentIcon,
  Analytics as AnalyticsIcon,
  Group as GroupIcon,
  Article as ArticleIcon,
  Search as SearchIcon,
  Build as BuildIcon,
  ChevronLeft as ChevronLeftIcon,
  Menu as MenuIcon
} from '@mui/icons-material';

const Sidebar = ({ open, onClose }) => {
  const location = useLocation();
  const currentRole = useGetCurrentRole();
  const [expandedItems, setExpandedItems] = React.useState([]);
  const [isExpanded, setIsExpanded] = React.useState(true);

  const drawerWidth = isExpanded ? 240 : 64;
  const handleExpand = (itemId) => {
    setExpandedItems(prev =>
      prev.includes(itemId)
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const toggleDrawer = () => {
    setIsExpanded(!isExpanded);
    if (!isExpanded) {
      setExpandedItems([]); // Close all expanded items when collapsing
    }
  };

  const isSelected = (path) => location.pathname === path;

  const NavigationItem = ({ item }) => {
    const hasChildren = item.children && item.children.length > 0;
    const isItemExpanded = expandedItems.includes(item.id);

    if (item.kind === 'header') {
      return isExpanded ? (
        <ListItem sx={{ py: 1 }}>
          <Typography variant="overline" color="text.secondary">
            {item.title}
          </Typography>
        </ListItem>
      ) : null;
    }

    if (item.kind === 'divider') {
      return <Divider sx={{ my: 1 }} />;
    }

    return (
      <>
        <ListItem disablePadding>
          <ListItemButton
            component={hasChildren ? 'div' : Link}
            to={hasChildren ? undefined : item.path}
            onClick={hasChildren ? () => handleExpand(item.id) : undefined}
            selected={isSelected(item.path)}
            sx={{
              minHeight: 48,
              justifyContent: isExpanded ? 'initial' : 'center',
              px: 2.5,
              '&.Mui-selected': {
                backgroundColor: 'action.selected',
                '&:hover': {
                  backgroundColor: 'action.selected',
                }
              }
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: 0,
                mr: isExpanded ? 2 : 'auto',
                justifyContent: 'center',
              }}
            >
              {item.icon}
            </ListItemIcon>
            {isExpanded && (
              <>
                <ListItemText primary={item.title} />
                {hasChildren && (isItemExpanded ? <ExpandLess /> : <ExpandMore />)}
              </>
            )}
          </ListItemButton>
        </ListItem>
        {hasChildren && isItemExpanded && isExpanded && (
          <Collapse in={isItemExpanded} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {item.children.map((child) => (
                <ListItemButton
                  key={child.id}
                  component={Link}
                  to={child.path}
                  selected={isSelected(child.path)}
                  sx={{
                    minHeight: 48,
                    pl: 4,
                    '&.Mui-selected': {
                      backgroundColor: 'action.selected',
                    }
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    {child.icon}
                  </ListItemIcon>
                  <ListItemText primary={child.title} />
                </ListItemButton>
              ))}
            </List>
          </Collapse>
        )}
      </>
    );
  };

  const getNavigationItems = () => {
    if (currentRole === 'admin') {
      return [
        { kind: 'header', title: 'Administration' },
        { id: 'dashboard', title: 'Dashboard', icon: <DashboardIcon />, path: '/admin/dashboard' },
        { id: 'users', title: 'User Management', icon: <AdminIcon />, path: '/admin/users' },
        { kind: 'divider' },
        { kind: 'header', title: 'Analytics' },
        {
          id: 'reports',
          title: 'Reports',
          icon: <BarChartIcon />,
          children: [
            { id: 'usage', title: 'Usage Reports', icon: <DescriptionIcon />, path: '/admin/reports/usage' },
            { id: 'activity', title: 'Activity Logs', icon: <DescriptionIcon />, path: '/admin/reports/activity' }
          ]
        },
        {
          id: 'system',
          title: 'System',
          icon: <BuildIcon />,
          children: [
            { id: 'configurations', title: 'Configurations', icon: <SettingsIcon />, path: '/admin/configurations' },
            { id: 'optimizations', title: 'Optimizations', icon: <AnalyticsIcon />, path: '/admin/optimizations' }
          ]
        },
        { kind: 'divider' },
        { id: 'logout', title: 'Logout', icon: <LogoutIcon />, path: '/logout' }
      ];
    }

    if (currentRole === 'publisher') {
      return [
        { kind: 'header', title: 'Main' },
        { id: 'dashboard', title: 'Dashboard', icon: <DashboardIcon />, path: '/publisher/dashboard' },
        { id: 'profile', title: 'Company Profile', icon: <BusinessIcon />, path: '/publisher/profile' },
        { kind: 'divider' },
        { kind: 'header', title: 'Job Management' },
        {
          id: 'jobs',
          title: 'Jobs',
          icon: <JobIcon />,
          children: [
            { id: 'view-jobs', title: 'View Jobs', icon: <SearchIcon />, path: '/publisher/jobs' },
            { id: 'create-job', title: 'Create New Job', icon: <ArticleIcon />, path: '/publisher/jobs/create' }
          ]
        },
        {
          id: 'applications',
          title: 'Applications',
          icon: <AssignmentIcon />,
          children: [
            { id: 'active', title: 'Active Applications', icon: <DescriptionIcon />, path: '/publisher/applications/active' },
            { id: 'archived', title: 'Archived', icon: <DescriptionIcon />, path: '/publisher/applications/archived' }
          ]
        },
        { kind: 'divider' },
        { kind: 'header', title: 'Analytics' },
        { id: 'analytics', title: 'Analytics', icon: <AnalyticsIcon />, path: '/publisher/analytics' },
        { id: 'settings', title: 'Settings', icon: <SettingsIcon />, path: '/publisher/settings' }
      ];
    }

    if (currentRole === 'seeker') {
      return [
        { kind: 'header', title: 'Main' },
        { id: 'dashboard', title: 'Dashboard', icon: <DashboardIcon />, path: '/seeker/dashboard' },
        { id: 'profile', title: 'Profile', icon: <ProfileIcon />, path: '/seeker/profile' },
        { kind: 'divider' },
        { kind: 'header', title: 'Job Search' },
        { id: 'jobs', title: 'Find Jobs', icon: <SearchIcon />, path: '/seeker/jobs' },
        { id: 'applications', title: 'My Applications', icon: <AssignmentIcon />, path: '/seeker/applications' },
        { kind: 'divider' },
        { kind: 'header', title: 'Network' },
        {
          id: 'network',
          title: 'Network',
          icon: <NetworkIcon />,
          children: [
            { id: 'connections', title: 'Connections', icon: <GroupIcon />, path: '/seeker/connections' },
            { id: 'messages', title: 'Messages', icon: <MessageIcon />, path: '/seeker/messages' },
            { id: 'notifications', title: 'Notifications', icon: <NotificationsIcon />, path: '/seeker/notifications' }
          ]
        },
        { kind: 'divider' },
        { id: 'resume', title: 'Resume Builder', icon: <ArticleIcon />, path: '/seeker/resume' },
        { id: 'settings', title: 'Settings', icon: <SettingsIcon />, path: '/seeker/settings' }
      ];
    }

    return []; // Default empty navigation if no role matches
  };

  const drawer = (
    <Box sx={{ overflow: 'auto' }}>
      <Box sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: isExpanded ? 'flex-end' : 'center',
        padding: '8px'
      }}>
        <IconButton onClick={toggleDrawer}>
          {isExpanded ? <ChevronLeftIcon /> : <MenuIcon />}
        </IconButton>
      </Box>
      <Divider />
      <List>
        {getNavigationItems().map((item, index) => (
          <NavigationItem key={item.id || index} item={item} />
        ))}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', marginTop: '64px' }}>
      <Box
        component="nav"
        sx={{
          width: { sm: drawerWidth },
          flexShrink: { sm: 0 },
          transition: 'width 0.2s ease-in-out'
        }}
      >
        <Drawer
          variant="temporary"
          open={open}
          onClose={onClose}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': {
              width: drawerWidth,
              boxSizing: 'border-box',
              borderRight: '1px solid rgba(0, 0, 0, 0.12)',
              transition: 'width 0.2s ease-in-out'
            }
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': {
              width: drawerWidth,
              boxSizing: 'border-box',
              borderRight: '1px solid rgba(0, 0, 0, 0.12)',
              marginTop: '64px',
              transition: 'width 0.2s ease-in-out',
              overflowX: 'hidden'
            }
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
    </Box>
  );
};

export default Sidebar;