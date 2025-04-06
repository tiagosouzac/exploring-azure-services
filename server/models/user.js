class User {
  constructor({ name, email, password, role }, id) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.password = password;
    this.role = role;
  }
}

export { User };
