using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using CentralAuth.Commons.Constants;
using CentralAuth.Commons.Models;
using CentralAuth.Commons.Models.Authentication;
using CentralAuth.Datas;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
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
        
        public AuthController(AppDbContext context, UserManager<AppUser> userManager, SignInManager<AppUser> signInManager, RoleManager<AppRole> roleManager)
        {
            _context = context;
            _userManager = userManager;
            _signInManager = signInManager;
            _roleManager = roleManager;
        }

        [HttpGet("[action]")]
        public async Task<string> qweasd()
        {
            
            return "test";
        }

        [HttpGet("[action]")]
        public async Task<ObjectResult> RegisterAdmin()
        {
            var trans = _context.Database.BeginTransaction();
            try
            {
                using (trans)
                {
                    UserRegister newUserData = new UserRegister
                    {
                        Email = "s.triarjo@gmail.com",
                        Nik = "2015169765",
                        Password = "qweasd",
                        ConfirmPassword = "qweasd",
                        Ext = "321",
                        KodeDepartemen = "01",
                        KodeSubDepartemen = "03",
                        Nama = "Sulaiman Triarjo",
                        NikAtasan = null
                    };
                    AppUser newUser = new AppUser
                    {
                        UserName = newUserData.Nik,
                        Email = newUserData.Email
                    };
                    var result = await _userManager.CreateAsync(newUser, newUserData.ConfirmPassword);
                    
                    if (result.Succeeded)
                    {
                        var rolesUser = new List<string> { Role.ADMIN, Role.DEVELOPER };
                        var role = await _userManager.AddToRolesAsync(newUser, rolesUser);
                        if (role.Succeeded)
                        {
                            User newUserDb = new User
                            {
                                Email = newUserData.Email,
                                Ext = newUserData.Ext,
                                Nama = newUserData.Nama,
                                Nik = newUserData.Nik,
                                //Departemen = _context.Departemens.FirstOrDefault(m=>m.Kode == newUserData.KodeDepartemen),
                                //SubDepartemen = _context.SubDepartemens.FirstOrDefault(m => m.Kode == newUserData.KodeSubDepartemen && m.Departemen.Kode == newUserData.KodeDepartemen)
                            };
                            _context.Users.Add(newUserDb);
                             await _context.SaveChangesAsync();
                            trans.Commit();
                            return Ok(new CustomResponse { message = "Pedaftaran User Berhasil", title = "Pendaftaran User Berhasil"});
                        }
                        trans.Rollback();
                        return BadRequest(new CustomResponse { message = "Gagal Mendaftarkan User pada IdentityUser", title = "Pendaftaran User Gagal" });
                    }
                    trans.Rollback();
                    return BadRequest(new CustomResponse { message = "Gagal Mendaftarkan User pada IdentityUser", title = "Pendaftaran User Gagal" });
                }
            }
            catch(Exception ex)
            {
                return BadRequest(new CustomResponse { message = ex.Message, title = "Pendaftaran User Error" , errors = new List<string>() { ex.InnerException.Message } });
            }
            

        }

        [HttpPost("[action]")]
        public async Task<ObjectResult> Register([FromBody] UserRegister req)
        {
                var user = new AppUser
                {
                    UserName = req.Nik,
                    Email = req.Email
                };

                var result = await _userManager.CreateAsync(user, req.Password);
                return Ok(result);
        }

        [HttpPost("[action]")]
        public async Task<ObjectResult> Login([FromBody] UserLogin req)
        {
            var userDb = await  _userManager.FindByNameAsync(req.Nik);

            var user = await _signInManager.PasswordSignInAsync(userDb, req.Password, false, false);

            return Ok(user);
        }
    }
}