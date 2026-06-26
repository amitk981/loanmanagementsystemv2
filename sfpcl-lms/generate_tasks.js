const roles = [
  'field_officer', 'credit_manager', 'deputy_manager_finance', 
  'compliance_team', 'company_secretary', 'sanction_committee', 
  'cfo', 'director', 'senior_manager_finance', 'cfc', 
  'accounts', 'sales_team_user', 'admin'
];

const users = {
  field_officer: 'Amit Kallapa',
  credit_manager: 'Priya Kulkarni',
  deputy_manager_finance: 'Suresh Patil',
  compliance_team: 'Meera Joshi',
  company_secretary: 'Aarti Desai',
  sanction_committee: 'Rajesh Sharma',
  cfo: 'Vikram Nair',
  director: 'Anita Mehta',
  senior_manager_finance: 'Deepak Rao',
  cfc: 'Santosh Kumar',
  accounts: 'Kavita More',
  sales_team_user: 'Nikhil Jagtap',
  admin: 'Sneha Bhosale'
};

const taskTypesByRole = {
  field_officer: ['completeness_check', 'document_verification'],
  deputy_manager_finance: ['completeness_check', 'appraisal'],
  credit_manager: ['completeness_check', 'appraisal', 'sanction', 'default_review'],
  sanction_committee: ['sanction', 'approval'],
  cfo: ['sanction', 'approval'],
  director: ['sanction', 'approval'],
  compliance_team: ['document_verification'],
  company_secretary: ['document_verification'],
  senior_manager_finance: ['sap_setup', 'disbursement'],
  accounts: ['repayment_posting'],
  sales_team_user: ['repayment_posting'],
  cfc: ['sanction', 'approval', 'default_review'],
  admin: ['completeness_check', 'appraisal', 'sanction', 'sap_setup']
};

const names = ['Anjali Wagh', 'Ramesh Kulkarni', 'Sunita Kamble', 'Prakash Rao', 'Kiran Pawar', 'Asha Bhosale', 'Vijay Patil', 'Manoj Thorat', 'Malti Shinde', 'Kavita Desai', 'Ramesh Iyer', 'Ganesh Thorat', 'Pooja Sharma', 'Nitin Gupta', 'Varsha Deshmukh'];

let tasks = [];
let idCounter = 100;

for (const role of roles) {
  const types = taskTypesByRole[role] || ['approval'];
  const user = users[role];
  
  for (let i = 0; i < 5; i++) {
    const type = types[i % types.length];
    const loanNo = `LO${String(idCounter).padStart(8, '0')}`;
    const borrower = names[idCounter % names.length];
    const amount = 100000 + (Math.floor(Math.random() * 5) * 50000);
    const priorities = ['normal', 'high', 'critical'];
    const priority = priorities[Math.floor(Math.random() * 3)];
    const tatRemaining = priority === 'critical' ? 'Overdue' : (priority === 'high' ? '4 hrs' : '2 days');
    const statuses = ['draft', 'submitted', 'pending_sanction', 'sanctioned', 'ready_for_payment', 'default_review'];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const borrowerType = Math.random() > 0.8 ? 'fpc' : 'individual';
    const isSpecialCase = Math.random() > 0.8;
    const isException = Math.random() > 0.8;
    
    // Some tasks assigned to specific user, some not
    const assignedUser = (role === 'credit_manager' || role === 'deputy_manager_finance' || Math.random() > 0.3) ? user : undefined;
    
    tasks.push(`  { id: 'T${idCounter}', type: '${type}', loanNo: '${loanNo}', borrower: '${borrower}', amount: ${amount}, priority: '${priority}', tatRemaining: '${tatRemaining}', status: '${status}', assignedRole: '${role}', ${assignedUser ? `assignedUser: '${assignedUser}', ` : ''}createdDate: '2026-06-25', dueDate: '2026-06-28', borrowerType: '${borrowerType}', isSpecialCase: ${isSpecialCase}, isException: ${isException} },`);
    
    idCounter++;
  }
}

console.log('const allTasks: Task[] = [');
console.log(tasks.join('\n'));
console.log('];');
