import { faker } from '@faker-js/faker';

export interface IUserData {
    firstName: string;
    lastName: string;
    email: string;
    company: string;
}

export const Invitations = {
  buyer: {
    firstName: `AutoTest ${faker.person.firstName()}`,
    lastName: `Buyer ${faker.person.lastName()}`,
    email: faker.internet.email(),
    company: faker.company.name(),
  },
  vendor: {
    firstName: `AutoTest ${faker.person.firstName()}`,
    lastName: `Vendor ${faker.person.lastName()}`,
    email: faker.internet.email(),
    company: faker.company.name(),
  },
  messages: {
    success: "Invitation has been successfully sent",
    duplicate: "Invite already sent to this email",
  },
};

export const Messages = {
    success: "Invitation has been successfully sent",
    duplicate: "Invite already sent to this email",
}

type InvitationKey = 'buyer' | 'vendor';
export type MessageStatus = typeof Messages[keyof typeof Messages];
