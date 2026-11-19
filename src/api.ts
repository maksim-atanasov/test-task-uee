const firstNames = ['Олександр', 'Марія', 'Іван', 'Олена', 'Дмитро', 'Анна', 'Сергій', 'Юлія', 'Андрій', 'Катерина', 'Максим', 'Ірина', 'Богдан', 'Софія', 'Тарас', 'Наталія', 'Віктор', 'Оксана', 'Роман', 'Тетяна']
const lastNames = ['Шевченко', 'Коваленко', 'Бондаренко', 'Ткаченко', 'Кравченко', 'Олійник', 'Мельник', 'Шевчук', 'Поліщук', 'Бойко', 'Лисенко', 'Мороз', 'Гончаренко', 'Савченко', 'Руденко', 'Марченко']
const departments = ['Розробка', 'Дизайн', 'Маркетинг', 'Продажі', 'HR', 'Фінанси', 'Підтримка', 'QA']
const positions = ['Junior', 'Middle', 'Senior', 'Lead', 'Head']
const cities = ['Київ', 'Львів', 'Харків', 'Одеса', 'Дніпро', 'Вінниця', 'Запоріжжя', 'Івано-Франківськ', 'Ужгород', 'Чернівці']
const statuses = ['active', 'vacation', 'sick', 'fired']

function rand(arr: any) {
  return arr[Math.floor(Math.random() * arr.length)]
}

export function generateEmployees(count: number) {
  const result: any = []
  for (let i = 0; i < count; i++) {
    const first = rand(firstNames)
    const last = rand(lastNames)
    const year = 2012 + Math.floor(Math.random() * 14)
    const month = 1 + Math.floor(Math.random() * 12)
    const day = 1 + Math.floor(Math.random() * 28)
    result.push({
      id: i + 1,
      name: first + ' ' + last,
      email: 'user' + (i + 1) + '@company.ua',
      department: rand(departments),
      position: rand(positions),
      city: rand(cities),
      salary: 20000 + Math.floor(Math.random() * 180000),
      startDate: year + '-' + String(month).padStart(2, '0') + '-' + String(day).padStart(2, '0'),
      status: rand(statuses),
      rating: Math.round((1 + Math.random() * 4) * 10) / 10,
      projects: Math.floor(Math.random() * 30),
    })
  }
  return result
}

export function fetchEmployees(): Promise<any> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(JSON.parse(JSON.stringify(generateEmployees(5000))))
    }, 800)
  })
}

export function fetchDepartmentInfo(department: any): Promise<any> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        name: department,
        head: rand(firstNames) + ' ' + rand(lastNames),
        budget: 1000000 + Math.floor(Math.random() * 9000000),
        floor: 1 + Math.floor(Math.random() * 12),
      })
    }, 300 + Math.random() * 1500)
  })
}
