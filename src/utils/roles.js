export function checkRole(data, nama_role) {

 
    let roles = data.allRole.includes(nama_role)
    return roles;
  }