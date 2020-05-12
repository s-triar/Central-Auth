using CentralAuth.Commons.Models.Authentication;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CentralAuth.Commons.Interfaces
{
    public interface IUserAuth
    {
        UserAuth Login([FromBody] UserLogin req);
        IdentityResult Register([FromBody] UserRegister req);
    }
}
