import { useState, useEffect } from 'react'
import { fetchEmployees, fetchDepartmentInfo } from './api'
import { formatMoney, formatDate, statusLabel, calcStats } from './utils'
import './styles.css'

export default function App() {
  const [data, setData] = useState<any>([])
  const [filtered, setFiltered] = useState<any>([])
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState('')
  const [sortField, setSortField] = useState<any>(null)
  const [sortDir, setSortDir] = useState('asc')
  const [department, setDepartment] = useState('all')
  const [status, setStatus] = useState('all')
  const [selected, setSelected] = useState<any>([])
  const [hovered, setHovered] = useState<any>(null)
  const [editing, setEditing] = useState<any>(null)
  const [editValue, setEditValue] = useState<any>('')
  const [modalRow, setModalRow] = useState<any>(null)
  const [deptInfo, setDeptInfo] = useState<any>(null)
  const [time, setTime] = useState(new Date())
  const [dark, setDark] = useState(false)

  useEffect(() => {
    setLoading(true)
    const saved = localStorage.getItem('employees')
    if (saved && JSON.parse(saved).length > 0) {
      setData(JSON.parse(saved))
      setLoading(false)
    } else {
      fetchEmployees().then((res: any) => {
        setData(res)
        setLoading(false)
      })
    }
  }, [])

  useEffect(() => {
    setInterval(() => {
      setTime(new Date())
    }, 1000)
  }, [])

  useEffect(() => {
    localStorage.setItem('employees', JSON.stringify(data))
  }, [data])

  useEffect(() => {
    if (department !== 'all') {
      fetchDepartmentInfo(department).then((res: any) => {
        setDeptInfo(res)
      })
    } else {
      setDeptInfo(null)
    }
  }, [department])

  useEffect(() => {
    let result = data.filter((row: any) => {
      const matchSearch = JSON.stringify(row).toLowerCase().includes(search.toLowerCase())
      const matchDept = department === 'all' || row.department === department
      const matchStatus = status === 'all' || row.status === status
      return matchSearch && matchDept && matchStatus
    })
    if (sortField) {
      result = result.sort((a: any, b: any) => {
        let res = 0
        if (sortField === 'startDate') {
          res = new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
        } else if (typeof a[sortField] === 'number') {
          res = a[sortField] - b[sortField]
        } else {
          res = a[sortField].toString().localeCompare(b[sortField].toString())
        }
        return sortDir === 'asc' ? res : -res
      })
    }
    setFiltered(result)
  }, [data, search, sortField, sortDir, department, status])

  const stats = calcStats(filtered)
  const departments = data.map((r: any) => r.department).filter((v: any, i: any, arr: any) => arr.indexOf(v) === i)

  const handleSort = (field: any) => {
    if (sortField === field) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDir('asc')
    }
  }

  const toggleSelect = (id: any) => {
    if (selected.includes(id)) {
      setSelected(selected.filter((s: any) => s !== id))
    } else {
      setSelected([...selected, id])
    }
  }

  const allSelected = filtered.length > 0 && filtered.every((r: any) => selected.includes(r.id))

  const toggleAll = () => {
    if (allSelected) {
      setSelected([])
    } else {
      setSelected(filtered.map((r: any) => r.id))
    }
  }

  const deleteSelected = () => {
    if (window.confirm('Видалити ' + selected.length + ' записів?')) {
      setData(data.filter((r: any) => !selected.includes(r.id)))
    }
  }

  const startEdit = (index: any, field: any, value: any) => {
    setEditing({ index, field })
    setEditValue(value)
  }

  const saveEdit = () => {
    const newData = data.map((r: any, i: any) => {
      if (i === editing.index) {
        return { ...r, [editing.field]: editing.field === 'salary' ? Number(editValue) : editValue }
      }
      return r
    })
    setData(newData)
    setEditing(null)
  }

  const exportCsv = () => {
    let csv = 'id,name,email,department,position,city,salary,startDate,status,rating,projects\n'
    filtered.forEach((r: any) => {
      csv += r.id + ',' + r.name + ',' + r.email + ',' + r.department + ',' + r.position + ',' + r.city + ',' + r.salary + ',' + r.startDate + ',' + r.status + ',' + r.rating + ',' + r.projects + '\n'
    })
    const blob = new Blob([csv], { type: 'text/csv' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = 'employees.csv'
    a.click()
  }

  const resetData = () => {
    localStorage.removeItem('employees')
    setLoading(true)
    fetchEmployees().then((res: any) => {
      setData(res)
      setLoading(false)
    })
  }

  const selectedSalary = data.filter((r: any) => selected.includes(r.id)).reduce((s: any, r: any) => s + r.salary, 0)

  const Row = ({ row, index }: any) => {
    const sameDept = filtered.filter((r: any) => r.department === row.department)
    const deptTotal = sameDept.reduce((s: any, r: any) => s + r.salary, 0)
    const share = ((row.salary / deptTotal) * 100).toFixed(2)
    const rank = sameDept.filter((r: any) => r.rating > row.rating).length + 1
    const isSelected = selected.includes(row.id)

    return (
      <tr
        onMouseEnter={() => setHovered(row.id)}
        onMouseLeave={() => setHovered(null)}
        onClick={() => setModalRow(row)}
        style={{
          background: hovered === row.id ? (dark ? '#2a3550' : '#eef3ff') : isSelected ? (dark ? '#3d3520' : '#fff6d9') : index % 2 ? (dark ? '#1c2130' : '#fafbfc') : dark ? '#171b26' : '#ffffff',
          cursor: 'pointer',
        }}
      >
        <td onClick={(e) => e.stopPropagation()}>
          <input type="checkbox" checked={isSelected} onChange={() => toggleSelect(row.id)} />
        </td>
        <td>{row.id}</td>
        <td>
          <div style={{ fontWeight: 600 }}>{row.name}</div>
          <div style={{ fontSize: 12, opacity: 0.6 }}>{row.email}</div>
        </td>
        <td>{row.department}</td>
        <td
          onDoubleClick={(e) => {
            e.stopPropagation()
            startEdit(index, 'position', row.position)
          }}
        >
          {editing && editing.index === index && editing.field === 'position' ? (
            <input
              value={editValue}
              onClick={(e) => e.stopPropagation()}
              onChange={(e) => setEditValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') saveEdit()
                if (e.key === 'Escape') setEditing(null)
              }}
            />
          ) : (
            row.position
          )}
        </td>
        <td>{row.city}</td>
        <td
          style={{ textAlign: 'right', whiteSpace: 'nowrap' }}
          onDoubleClick={(e) => {
            e.stopPropagation()
            startEdit(index, 'salary', row.salary)
          }}
        >
          {editing && editing.index === index && editing.field === 'salary' ? (
            <input
              type="number"
              value={editValue}
              onClick={(e) => e.stopPropagation()}
              onChange={(e) => setEditValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') saveEdit()
                if (e.key === 'Escape') setEditing(null)
              }}
            />
          ) : (
            formatMoney(row.salary)
          )}
        </td>
        <td style={{ textAlign: 'right' }}>{share}%</td>
        <td style={{ whiteSpace: 'nowrap' }}>{formatDate(row.startDate)}</td>
        <td>
          <span className={'status status-' + row.status}>{statusLabel(row.status)}</span>
        </td>
        <td style={{ textAlign: 'right' }}>
          {row.rating} <span style={{ opacity: 0.5, fontSize: 12 }}>#{rank}</span>
        </td>
        <td style={{ textAlign: 'right' }}>{row.projects}</td>
      </tr>
    )
  }

  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'name', label: 'Співробітник' },
    { key: 'department', label: 'Відділ' },
    { key: 'position', label: 'Посада' },
    { key: 'city', label: 'Місто' },
    { key: 'salary', label: 'Зарплата' },
    { key: 'share', label: 'Частка у відділі' },
    { key: 'startDate', label: 'Дата початку' },
    { key: 'status', label: 'Статус' },
    { key: 'rating', label: 'Рейтинг' },
    { key: 'projects', label: 'Проєкти' },
  ]

  return (
    <div className={dark ? 'app dark' : 'app'}>
      <header className="header">
        <div>
          <h1>Співробітники</h1>
          <p className="subtitle">Усього записів: {data.length}, показано: {filtered.length}</p>
        </div>
        <div className="header-right">
          <span className="clock">{time.toLocaleTimeString('uk-UA')}</span>
          <button onClick={() => setDark(!dark)}>{dark ? 'Світла тема' : 'Темна тема'}</button>
        </div>
      </header>

      <div className="toolbar">
        <input className="search" placeholder="Пошук за будь-яким полем" value={search} onChange={(e) => setSearch(e.target.value)} />
        <select value={department} onChange={(e) => setDepartment(e.target.value)}>
          <option value="all">Усі відділи</option>
          {departments.map((d: any) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="all">Усі статуси</option>
          <option value="active">Працює</option>
          <option value="vacation">Відпустка</option>
          <option value="sick">Лікарняний</option>
          <option value="fired">Звільнений</option>
        </select>
        <button disabled={selected.length === 0} onClick={deleteSelected}>
          Видалити обрані ({selected.length})
        </button>
        <button onClick={exportCsv}>Експорт CSV</button>
        <button onClick={resetData}>Скинути дані</button>
      </div>

      <div className="stats">
        <div className="stat">
          <div className="stat-label">Фонд зарплат</div>
          <div className="stat-value">{formatMoney(stats.total)}</div>
        </div>
        <div className="stat">
          <div className="stat-label">Середня зарплата</div>
          <div className="stat-value">{formatMoney(stats.avg)}</div>
        </div>
        <div className="stat">
          <div className="stat-label">Працюють зараз</div>
          <div className="stat-value">{stats.active}</div>
        </div>
        <div className="stat">
          <div className="stat-label">Найкращий рейтинг</div>
          <div className="stat-value">{stats.best ? stats.best.name + ' (' + stats.best.rating + ')' : '—'}</div>
        </div>
      </div>

      <div className="departments">
        {Object.keys(stats.byDepartment).map((dep: any) => (
          <div key={dep} className="dep-chip" onClick={() => setDepartment(dep)}>
            <b>{dep}</b> {stats.byDepartment[dep].count} осіб, сер. {formatMoney(stats.byDepartment[dep].avgSalary)}, рейтинг {stats.byDepartment[dep].avgRating.toFixed(2)}
          </div>
        ))}
      </div>

      {deptInfo && (
        <div className="dept-info">
          Відділ «{deptInfo.name}»: керівник {deptInfo.head}, бюджет {formatMoney(deptInfo.budget)}, поверх {deptInfo.floor}
        </div>
      )}

      {selected.length > 0 && <div className="selected-info">Обрано {selected.length}, сума зарплат: {formatMoney(selectedSalary)}</div>}

      {loading ? (
        <div className="loading">Завантаження...</div>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>
                  <input type="checkbox" checked={allSelected} onChange={toggleAll} />
                </th>
                {columns.map((col) => (
                  <th key={col.key} onClick={() => col.key !== 'share' && handleSort(col.key)}>
                    {col.label}
                    {sortField === col.key ? (sortDir === 'asc' ? ' ▲' : ' ▼') : ''}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((row: any, index: any) => (
                <Row key={index} row={row} index={index} />
              ))}
            </tbody>
          </table>
        </div>
      )}

      {modalRow && (
        <div className="modal-backdrop" onClick={() => setModalRow(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>{modalRow.name}</h2>
            <p>{modalRow.email}</p>
            <p>
              {modalRow.position}, {modalRow.department}, {modalRow.city}
            </p>
            <p>Зарплата: {formatMoney(modalRow.salary)}</p>
            <p>Працює з {formatDate(modalRow.startDate)}</p>
            <h3>Колеги з відділу</h3>
            <ul className="colleagues">
              {data
                .filter((r: any) => r.department === modalRow.department && r.id !== modalRow.id)
                .map((r: any) => (
                  <li key={r.id}>
                    {r.name}, {r.position}, {formatMoney(r.salary)}
                  </li>
                ))}
            </ul>
            <button onClick={() => setModalRow(null)}>Закрити</button>
          </div>
        </div>
      )}
    </div>
  )
}
