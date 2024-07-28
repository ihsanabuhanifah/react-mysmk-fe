export function checkRole(data, nama_role) {

  console.log('data role', data)
    let roles = data.allRole.includes(nama_role)
    return roles;
  }