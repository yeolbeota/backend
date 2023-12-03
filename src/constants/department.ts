export enum Department {
  Security = 'security',
  Software = 'software',
  Business = 'business',
  Design = 'design',
}

export function getDepartmentByClass(userClass: number): Department {
  if (userClass < 4) return Department.Security;
  else if (userClass < 7) return Department.Software;
  else if (userClass < 10) return Department.Business;
  return Department.Design;
}
