
import { useEffect, useState } from 'react'
import {
  BrowserRouter,
  Routes,
  Route,
  NavLink,
} from 'react-router-dom'
import './App.css'

const STORAGE_KEY = 'employee-dashboard-added'

function Home({ employees, loading, error }) {
  return (
    <main className="container">
      <div className="page-heading">
        <div>
          <p className="eyebrow">OVERVIEW</p>
          <h1>Employee Dashboard</h1>
          <p className="subtitle">
            View and manage your employee directory.
          </p>
        </div>

        <NavLink to="/employee-form" className="primary-btn">
          + Add Employee
        </NavLink>
      </div>

      <div className="stats-card">
        <span className="stats-icon">👥</span>
        <div>
          <p>Total Employees</p>
          <h2>{loading ? '...' : employees.length}</h2>
        </div>
      </div>

      <section className="table-card">
        <h2>Employee Directory</h2>

        {loading ? (
          <p className="message">Loading employees...</p>
        ) : error ? (
          <p className="error">{error}</p>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Employee Name</th>
                  <th>Email Address</th>
                </tr>
              </thead>

              <tbody>
                {employees.map((employee) => (
                  <tr key={employee.id}>
                    <td>#{employee.id}</td>
                    <td>
                      <div className="employee-name">
                        <span className="avatar">
                          {employee.name.charAt(0).toUpperCase()}
                        </span>
                        {employee.name}
                      </div>
                    </td>
                    <td>{employee.email}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  )
}

function EmployeeForm({ onAddEmployee }) {
  const [form, setForm] = useState({
    name: '',
    designation: '',
    location: '',
    salary: '',
  })

  const [message, setMessage] = useState('')

  function handleChange(event) {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    })
    setMessage('')
  }

  function handleSubmit(event) {
    event.preventDefault()

    onAddEmployee(form)

    setMessage(`Employee "${form.name}" saved successfully!`)

    setForm({
      name: '',
      designation: '',
      location: '',
      salary: '',
    })
  }

  function clearForm() {
    setForm({
      name: '',
      designation: '',
      location: '',
      salary: '',
    })
    setMessage('')
  }

  return (
    <main className="container form-container">
      <div className="page-heading">
        <div>
          <p className="eyebrow">EMPLOYEE MANAGEMENT</p>
          <h1>Employee Form</h1>
          <p className="subtitle">
            Enter the employee details below.
          </p>
        </div>
      </div>

      <section className="form-card">
        <h2>Personal &amp; Employment Details</h2>
        <p className="form-description">All fields are required.</p>

        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <label>
              Full Name
              <input
                type="text"
                name="name"
                placeholder="Enter full name"
                value={form.name}
                onChange={handleChange}
                required
              />
            </label>

            <label>
              Designation
              <input
                type="text"
                name="designation"
                placeholder="e.g. Software Developer"
                value={form.designation}
                onChange={handleChange}
                required
              />
            </label>

            <label>
              Location
              <input
                type="text"
                name="location"
                placeholder="Enter work location"
                value={form.location}
                onChange={handleChange}
                required
              />
            </label>

            <label>
              Salary (₹)
              <input
                type="number"
                name="salary"
                placeholder="Enter salary"
                min="0"
                value={form.salary}
                onChange={handleChange}
                required
              />
            </label>
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="secondary-btn"
              onClick={clearForm}
            >
              Clear Form
            </button>

            <button type="submit" className="primary-btn">
              Submit Details
            </button>
          </div>

          {message && <p className="success">{message}</p>}
        </form>
      </section>
    </main>
  )
}

function App() {
  const [employees, setEmployees] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadEmployees() {
      try {
        const response = await fetch(
          'https://jsonplaceholder.typicode.com/users'
        )

        if (!response.ok) {
          throw new Error('Could not fetch employees')
        }

        const apiEmployees = await response.json()

        const savedEmployees = JSON.parse(
          localStorage.getItem(STORAGE_KEY) || '[]'
        )

        setEmployees([...apiEmployees, ...savedEmployees])
      } catch {
        setError('Unable to load employees. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    loadEmployees()
  }, [])

  function addEmployee(form) {
    const savedEmployees = JSON.parse(
      localStorage.getItem(STORAGE_KEY) || '[]'
    )

    const employee = {
      id: `new-${Date.now()}`,
      name: form.name.trim(),
      email: `${form.name.trim().toLowerCase().replace(/\s+/g, '.')}@employee.local`,
      designation: form.designation.trim(),
      location: form.location.trim(),
      salary: form.salary,
    }

    const updatedEmployees = [...savedEmployees, employee]

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(updatedEmployees)
    )

    setEmployees((previousEmployees) => [
      ...previousEmployees,
      employee,
    ])
  }

  return (
    <BrowserRouter>
      <div className="app">
        <nav className="navbar">
          <NavLink to="/" className="brand">
            <span className="brand-icon">E</span>
            Employee<span>Hub</span>
          </NavLink>

          <div className="nav-links">
            <NavLink to="/" end>Home</NavLink>
            <NavLink to="/employee-form">Employee Form</NavLink>
          </div>
        </nav>

        <Routes>
          <Route
            path="/"
            element={
              <Home
                employees={employees}
                loading={loading}
                error={error}
              />
            }
          />

          <Route
            path="/employee-form"
            element={<EmployeeForm onAddEmployee={addEmployee} />}
          />
        </Routes>

        <footer>
          EmployeeHub · Employee Management Dashboard
        </footer>
      </div>
    </BrowserRouter>
  )
}

export default App
