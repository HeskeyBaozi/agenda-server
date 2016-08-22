'use strict';
class User
{
    constructor(name, password, email, phone)
    {
        this.name = name;
        this.password = password;
        this.email = email;
        this.phone = phone;
    }
}

module.exports = User;