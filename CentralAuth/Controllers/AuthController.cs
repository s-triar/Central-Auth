using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using CentralAuth.Commons.Constants;
using CentralAuth.Commons.Models;
using CentralAuth.Commons.Models.Authentication;
using CentralAuth.Datas;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using Microsoft.VisualStudio.Web.CodeGeneration.Contracts.Messaging;

namespace CentralAuth.Controllers
{
    [Route("api/[controller]")]
    public class AuthController : Controller
    {
        private readonly AppDbContext _context;
        private readonly UserManager<AppUser> _userManager;
        private readonly SignInManager<AppUser> _signInManager;
        private readonly RoleManager<AppRole> _roleManager;
        private readonly IConfiguration _configuration;

        public AuthController(AppDbContext context, UserManager<AppUser> userManager, SignInManager<AppUser> signInManager, RoleManager<AppRole> roleManager, IConfiguration configuration)
        {
            _context = context;
            _userManager = userManager;
            _signInManager = signInManager;
            _roleManager = roleManager;
            _configuration = configuration;
        }


        [HttpPost("[action]")]
        public async Task<ObjectResult> Login([FromBody] UserLogin req)
        {
            var userDb = await  _userManager.FindByNameAsync(req.Nik);

            var result = await _signInManager.PasswordSignInAsync(userDb, req.Password, false, false);
            if (result.Succeeded)
            {
                var token = await GenerateJwtToken(userDb);
                return Ok(new CustomResponse
                {
                    data = token,
                    errors = null,
                    message = "Login Berhasil",
                    title = "Success",
                    ok = true
                });
            }
            return BadRequest(new CustomResponse { 
                errors=null,
                message="Pasangan NIK dan Password tidak cocok",
                title="Warning",
                ok = false
            });
        }

        private async Task<object> GenerateJwtToken(AppUser user)
        {
            JwtConfig jwtConfig = this._configuration.GetSection("Jwt").Get<JwtConfig>();
            var claims = new List<Claim>
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.Email),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                new Claim(ClaimTypes.NameIdentifier, user.Id),
                new Claim(ClaimTypes.GivenName, user.UserName)
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtConfig.SecretKey));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
            var expires = DateTime.Now.AddDays(Convert.ToDouble(1));

            var token = new JwtSecurityToken(
                jwtConfig.Issuer,
                jwtConfig.Audience,
                claims,
                expires: expires,
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}