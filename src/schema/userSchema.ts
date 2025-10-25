export const userSignupInviteSchema = {
  id: 'uuid',
  status: ['INVITED', 'APPLIED', 'DELETED', 'ALL'], 
  companyName: 'string',
  firstName: 'string',
  lastName: 'string',
  email: 'email',
  sendDate: 'date',
  createdAt: 'date',
};