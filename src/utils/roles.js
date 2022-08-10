export function checkRole(data, nama_role) {
    let roles = data?.some((item) => {
      return item.role?.role_name.toLowerCase() === nama_role;
    });
    return roles;
  }