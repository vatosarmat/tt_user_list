import { faker } from '@faker-js/faker'

const makePerson = () => {
  const fullName = faker.unique(faker.name.findName)
  const fullNameAr = fullName.split(' ') as [string, string]
  const company = faker.unique(faker.company.companyName)
  return {
    fullName,
    userName: faker.internet.userName(...fullNameAr),
    email: faker.internet.email(...fullNameAr),

    phone: faker.unique(faker.phone.phoneNumber, ['+###########']),

    city: faker.address.cityName(),
    street: faker.unique(faker.address.streetName),
    zipCode: faker.unique(faker.address.zipCode),

    company,
    website: `www.${company.split(/[^A-Za-z]/)[0].toLowerCase()}.${faker.internet.domainSuffix()}`,

    comment: faker.datatype.boolean() ? faker.lorem.paragraph(3) : undefined
  }
}

const main = () => {
  const maybeCountStr = process.argv[process.argv.length - 1]
  const maybeCount = parseInt(maybeCountStr)
  const count = isNaN(maybeCount) ? 16 : maybeCount

  const persons: ReturnType<typeof makePerson>[] = []
  for (let i = 0; i < count; i++) {
    persons.push(makePerson())
  }

  process.stdout.write(JSON.stringify(persons, undefined, 2))
}

main()
