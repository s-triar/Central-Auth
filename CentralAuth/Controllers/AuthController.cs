using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using CentralAuth.Commons.Models.Authentication;
using CentralAuth.Datas;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace CentralAuth.Controllers
{
    [Route("api/[controller]")]
    public class AuthController : Controller
    {
        private readonly AppDbContext _context;
        private readonly UserManager<IdentityUser> _userManager;

        public AuthController(AppDbContext context, UserManager<IdentityUser> userManager)
        {
            _context = context;
            _userManager = userManager;
        }

        [HttpPost("[action]")]
        public async Task<ObjectResult> Register([FromBody] UserRegister req)
        {
            var user = new IdentityUser
            {
                UserName = req.Nik,
                Email = req.Email
            };

            var result = await _userManager.CreateAsync(user, req.Password);
            return Ok(result);
        }
    }
}