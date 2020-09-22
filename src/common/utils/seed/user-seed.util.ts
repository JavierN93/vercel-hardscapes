import * as Faker from 'faker';
import { UserRole } from '../../enums/user-role.enum';
import { globalConfig } from '../../../config';

const customerMailDomain = 'gmail.com';
const companyMailDomain = globalConfig.mailDomain;
const defaultPassword = 'secret';

const defaultAdmins = [
  { email: 'joe', firstName: 'Joseph', lastName: 'Masciovechio' },
  { email: 'nick', firstName: 'Nick', lastName: 'Masciovechio' },
];

const admins = [
  { email: 'admin.admin1', firstName: 'Joseph', lastName: 'Masciovechio' },
];

const consultants = [
  { email: 'smith', firstName: 'Smith', lastName: 'James' },
  { email: 'johnson', firstName: 'Johnson', lastName: 'John' },
  { email: 'williams', firstName: 'Williams', lastName: 'Robert' },
  { email: 'jones', firstName: 'Jones', lastName: 'Michael' },
];

const customers = [
  { email: 'sydni', firstName: 'Sydni', lastName: 'David' },
  { email: 'bella', firstName: 'Bella', lastName: 'Richard' },
  { email: 'aaron', firstName: 'Aaron', lastName: 'Charles' },
  { email: 'flo', firstName: 'Flo', lastName: 'Thomas' },
  { email: 'frances', firstName: 'Frances', lastName: 'Daniel' },
];

export function generateAccount(email: string, firstName: string, lastName: string, phone: string, role: UserRole) {
  return {
    email: email,
    password: defaultPassword,
    firstName: firstName,
    lastName: lastName,
    phone: phone,
    ideas: [],
    role: role,
  };
}

export function generateConsultantAccount(count = 1) {
  const ary = [];
  for (let i = 0; i < count; i++) {
    const firstName = i < consultants.length ? consultants[i].firstName : Faker.name.firstName();
    const lastName = i < consultants.length ? consultants[i].lastName : Faker.name.lastName();
    const mailName = i < consultants.length ? consultants[i].email : firstName;
    const email = `consultant${i + 1}.${mailName}@${companyMailDomain}`.toLowerCase();
    ary.push(generateAccount(email, firstName, lastName, Faker.phone.phoneNumber(), UserRole.Consultant));
  }
  return ary;
}

export function generateSuperAdminAccounts() {
  return admins.map(admin => generateAccount(`${admin.email}@${companyMailDomain}`, admin.firstName, admin.lastName, Faker.phone.phoneNumber(), UserRole.SuperAdmin));
}

export function generateDefaultAdminAccounts() {
  return defaultAdmins.map(defaultAdmin => generateAccount(`${defaultAdmin.email}@${companyMailDomain}`, defaultAdmin.firstName, defaultAdmin.lastName, Faker.phone.phoneNumber(), UserRole.SuperAdmin));
}

export function generateCustomerAccount(count = 1) {
  const ary = [];
  for (let i = 0; i < count; i++) {
    const firstName = i < customers.length ? customers[i].firstName : Faker.name.firstName();
    const lastName = i < customers.length ? customers[i].lastName : Faker.name.lastName();
    const mailName = i < customers.length ? customers[i].email : firstName;
    const email = `customer${i + 1}.${mailName}@${customerMailDomain}`;
    ary.push(generateAccount(email, firstName, lastName, Faker.phone.phoneNumber(), UserRole.Customer));
  }
  return ary;
}
