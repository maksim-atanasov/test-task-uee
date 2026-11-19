export function formatMoney(value: any) {
  return new Intl.NumberFormat('uk-UA', { style: 'currency', currency: 'UAH', maximumFractionDigits: 0 }).format(value)
}

export function formatDate(value: any) {
  return new Date(value).toLocaleDateString('uk-UA', { year: 'numeric', month: 'long', day: 'numeric' })
}

export function statusLabel(status: any) {
  if (status == 'active') return 'Працює'
  if (status == 'vacation') return 'Відпустка'
  if (status == 'sick') return 'Лікарняний'
  if (status == 'fired') return 'Звільнений'
  return status
}

export function calcStats(data: any) {
  const departments: any = []
  data.forEach((row: any) => {
    if (departments.indexOf(row.department) === -1) departments.push(row.department)
  })
  const byDepartment: any = {}
  departments.forEach((dep: any) => {
    const rows = data.filter((r: any) => r.department === dep)
    byDepartment[dep] = {
      count: rows.length,
      avgSalary: rows.reduce((s: any, r: any) => s + r.salary, 0) / (rows.length || 1),
      avgRating: rows.reduce((s: any, r: any) => s + r.rating, 0) / (rows.length || 1),
    }
  })
  const sorted = JSON.parse(JSON.stringify(data)).sort((a: any, b: any) => b.rating - a.rating || b.projects - a.projects)
  const total = data.reduce((s: any, r: any) => s + r.salary, 0)
  const active = data.filter((r: any) => r.status === 'active').length
  return {
    total,
    avg: total / (data.length || 1),
    active,
    best: sorted[0],
    byDepartment,
  }
}
