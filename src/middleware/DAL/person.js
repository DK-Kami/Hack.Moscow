export default function personDAL(person) {
  if (!person) return;
  return {
    ...person,
    fullName: [person.family_name, person.name, person.patronymic].join(' '),
    gender: person.gender === 'M' ? 'Мужской' : 'Женский',
    role: person.last_role || 'информация отсутствует',
    birthday: currentDate(person.birth_date),
  };
};

function currentDate(dateTime) {
  if (!dateTime) return '';
  const [year, month, day] = dateTime.split('-')
  return [day, month, year].join('.');
}
