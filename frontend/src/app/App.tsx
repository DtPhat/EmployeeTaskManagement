import MainLayout from '@/components/layout/MainLayout'
import EmployeeDashboard from '@/pages/dashboard/employees'
import Home from '@/pages/home'
import BasicLogin from '@/pages/login/basic'
import EmailLogin from '@/pages/login/email'
import PhoneLogin from '@/pages/login/phone'
import Missing from '@/pages/missing/indext'
import { Route, Routes } from 'react-router-dom'
import DashboardLayout from '@/pages/dashboard/layout'
import MessageDashboard from '@/pages/dashboard/messages'
import TaskDashboard from '@/pages/dashboard/tasks'
import VerifyPage from '@/pages/verify/page'
import Profile from '@/pages/profile'
import ProtectedRoute from '@/components/protected-route'
import { roles } from './constants'

function App() {

  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Home />} />

        <Route path='/login' >
          <Route index element={<BasicLogin />} />
          <Route path='email' element={<EmailLogin />} />
          <Route path='phone' element={<PhoneLogin />} />
        </Route>

        <Route element={<ProtectedRoute allowedRoles={[roles.EMPLOYEE, roles.OWNER]} />} >
          <Route path='dashboard' element={<DashboardLayout />}>
            <Route element={<ProtectedRoute allowedRoles={[roles.OWNER]} />} >
              <Route path='employees' element={<EmployeeDashboard />} />
            </Route>
            <Route path='tasks' element={<TaskDashboard />} />
            <Route path='messages' element={<MessageDashboard />} />
          </Route>
        </Route>

        <Route element={<ProtectedRoute allowedRoles={[roles.EMPLOYEE, roles.OWNER]} />}>
          <Route path='/profile' element={<Profile />} />
        </Route>

        <Route path='/verify' element={<VerifyPage />} />

        <Route path='*' element={<Missing />} />
      </Route>
    </Routes >
  )
}

export default App
