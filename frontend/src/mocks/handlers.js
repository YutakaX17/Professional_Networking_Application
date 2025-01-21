import { http, HttpResponse } from 'msw'

// Mock data
const mockUsers = [
  {
    id: 1,
    username: 'john_doe',
    email: 'john@example.com',
    role: 'Admin',
    createdAt: '2024-01-15'
  },
  {
    id: 2,
    username: 'jane_smith',
    email: 'jane@example.com',
    role: 'Publisher',
    createdAt: '2024-01-16'
  },
  {
    id: 3,
    username: 'bob_wilson',
    email: 'bob@example.com',
    role: 'Seeker',
    createdAt: '2024-01-17'
  }
];

const mockDashboardStats = {
  totalUsers: 1250,
  activeJobs: 45,
  applications: 320,
  newUsers: 28
};

const mockRecentActivity = [
  {
    id: 1,
    description: 'New job posted: Senior Developer',
    timestamp: '2024-01-20T10:30:00Z'
  },
  {
    id: 2,
    description: 'User registration: Sarah Johnson',
    timestamp: '2024-01-20T09:15:00Z'
  },
  {
    id: 3,
    description: 'Application submitted: Marketing Manager',
    timestamp: '2024-01-20T08:45:00Z'
  }
];

const mockReports = {
  userStats: {
    'Total Users': 1250,
    'Active Users': 890,
    'New Users (This Month)': 150,
    'User Growth Rate': '12%'
  },
  jobStats: {
    'Total Jobs Posted': 450,
    'Active Jobs': 280,
    'Applications Received': 1200,
    'Average Applications per Job': 4.2
  },
  platformAnalytics: {
    'Platform Visits': 25000,
    'Conversion Rate': '2.8%',
    'Average Session Duration': '15 mins',
    'Mobile Users': '65%'
  }
};

// Define handlers
export const handlers = [
  // Dashboard endpoints
  http.get('/api/admin/dashboard/stats', () => {
    return HttpResponse.json(mockDashboardStats)
  }),

  http.get('/api/admin/dashboard/activity', () => {
    return HttpResponse.json(mockRecentActivity)
  }),

  // Users endpoints
  http.get('/api/admin/users', () => {
    return HttpResponse.json(mockUsers)
  }),

  http.put('/api/admin/users/:userId/role', async ({ params, request }) => {
    const { userId } = params
    const { role } = await request.json()

    const userIndex = mockUsers.findIndex(user => user.id === parseInt(userId))
    if (userIndex !== -1) {
      mockUsers[userIndex].role = role
      return HttpResponse.json(mockUsers[userIndex])
    }

    return new HttpResponse(
      JSON.stringify({ error: 'User not found' }),
      { status: 404 }
    )
  }),

  // Reports endpoints
  http.get('/api/admin/reports/:reportType', ({ params }) => {
    const { reportType } = params
    const reportData = mockReports[reportType]

    if (reportData) {
      return HttpResponse.json(reportData)
    }

    return new HttpResponse(
      JSON.stringify({ error: 'Report not found' }),
      { status: 404 }
    )
  }),
  http.get('/api/seeker/dashboard', () => {
    return HttpResponse.json({
      recentApplications: [
        {
          id: 1,
          jobTitle: 'Software Engineer',
          company: 'Tech Corp',
          status: 'Under Review',
          appliedDate: '2024-01-20'
        }
      ],
      savedJobs: [
        {
          id: 1,
          title: 'Frontend Developer',
          company: 'Web Solutions Inc',
          location: 'Lilongwe, Malawi',
          salary: '$50,000 - $70,000'
        }
      ],
      jobAlerts: [
        {
          id: 1,
          query: 'React Developer',
          frequency: 'Daily',
          location: 'Lilongwe'
        }
      ]
    })
  })
]