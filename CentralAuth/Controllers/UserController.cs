using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using CentralAuth.Commons.Constants;
using CentralAuth.Commons.Interfaces;
using CentralAuth.Commons.Models;
using CentralAuth.Commons.Models.Authentication;
using CentralAuth.Datas;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore.Storage;

namespace CentralAuth.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly IUserService _userService;
        private readonly UserManager<AppUser> _userManager;
        private readonly SignInManager<AppUser> _signInManager;
        private readonly RoleManager<AppRole> _roleManager;
        private readonly IEmailService _emailService;

        public UserController(IUserService userService,
                              UserManager<AppUser> userManager, 
                              SignInManager<AppUser> signInManager, 
                              RoleManager<AppRole> roleManager,
                              IEmailService emailService
                              )
        {
            _userService = userService;
            _userManager = userManager;
            _signInManager = signInManager;
            _roleManager = roleManager;
            _emailService = emailService;
        }
        [HttpPost("[action]")]
        public async Task<IActionResult> AddClaimsToUser([FromBody] UserAddRole entity)
        {
            AppUser user = await _userManager.FindByNameAsync(entity.Nik);
            if (user != null)
            {
                if(entity.Claims == null)
                {
                    return BadRequest(new CustomResponse
                    {
                        errors = null,
                        message = "Claims tidak dicantumkan",
                        title = "Error",
                        ok = false
                    });
                }
                List<Claim> claim_list = new List<Claim>();
                foreach(ClaimStandard c in entity.Claims)
                {
                    claim_list.Add(new Claim(c.Type, c.Value));
                }
                var role = await _userManager.AddClaimsAsync(user, claim_list);
                if (role.Succeeded)
                {
                    return Ok(new CustomResponse
                    {
                        errors = null,
                        message = "Tambah Claim User Berhasil",
                        title = "Success",
                        ok = true

                    });
                }
                return Ok(new CustomResponse
                {
                    errors = null,
                    message = "Gagal Menambahkan Claim User pada IdentityUser",
                    title = "Warning",
                    ok = false
                });
            }
            return BadRequest(new CustomResponse
            {
                errors = null,
                message = "Tidak Menemukan User pada IdentityUser",
                title = "Error",
                ok = false
            });
        }
        [HttpPost("[action]")]
        public async Task<IActionResult> AddRolesToUser([FromBody] UserAddRole entity)
        {
            AppUser user = await _userManager.FindByNameAsync(entity.Nik);
            if (user!=null)
            {
                var role = await _userManager.AddToRolesAsync(user, entity.Roles);
                if (role.Succeeded)
                {
                    return Ok(new CustomResponse
                    {
                        errors = null,
                        message = "Tambah Role User Berhasil",
                        title = "Success",
                        ok = true

                    });
                }
                return Ok(new CustomResponse
                {
                    errors = null,
                    message = "Gagal Menambahkan Role User pada IdentityUser",
                    title = "Warning",
                    ok = false
                });
            }
            return BadRequest(new CustomResponse
            {
                errors = null,
                message = "Tidak Menemukan User pada IdentityUser",
                title = "Error",
                ok = false
            });
        }
        [HttpPost("[action]")]
        public async Task<IActionResult> RegisterAccount([FromBody]UserRegister newUserData)
        {
            IDbContextTransaction trans = await this._userService.BeginTransactionAsync();
            using (trans)
            {
                try
                {

                    AppUser newUser = new AppUser
                    {
                        UserName = newUserData.Nik,
                        Email = newUserData.Email,
                        DetailNik = newUserData.Nik
                    };
                    var result = await _userManager.CreateAsync(newUser, newUserData.ConfirmPassword);

                    if (result.Succeeded)
                    {
                        var role = await _userManager.AddToRoleAsync(newUser, Role.USER);
                        if (role.Succeeded)
                        {
                            User newUserDb = new User
                            {
                                Email = newUserData.Email,
                                Ext = newUserData.Ext,
                                Nama = newUserData.Nama,
                                Nik = newUserData.Nik,
                                DepartemenKode = newUserData.KodeDepartemen,
                                SubDepartemenKode = newUserData.KodeSubDepartemen,
                                CabangKode = newUserData.KodeCabang,
                                UnitKode = newUserData.KodeUnit,
                                DirektoratKode = newUserData.KodeDirektorat
                            };
                            this._userService.Add(newUserDb);
                            var res_save = await this._userService.SaveAsync();
                            if (res_save == 1)
                            {
                                this._userService.Commit(trans);
                                var m = new Message(new string[] { newUserData.Email }, "Pendafatar Akun Central Auth", "Password anda : "+ newUserData.ConfirmPassword);
                                try { _emailService.SendEmail(m); }
                                catch (Exception ex) { }
                                
                                return Ok(new CustomResponse
                                {
                                    errors = null,
                                    message = "Tambah User Berhasil",
                                    title = "Success",
                                    ok = true

                                });
                            }
                            
                        }
                        this._userService.Rollback(trans);
                        return BadRequest(new CustomResponse
                        {
                            errors = null,
                            message = "Gagal Menambahkan Role User pada IdentityUser",
                            title = "Error",
                            ok = false
                        });
                    }
                    this._userService.Rollback(trans);
                    return BadRequest(new CustomResponse
                    {
                        message = "Gagal Mendaftarkan User pada IdentityUser",
                        title = "Error",
                        ok = false,
                        errors = null
                    });
                }

                catch (Exception ex)
                {
                    this._userService.Rollback(trans);
                    return BadRequest(new CustomResponse
                    {
                        message = ex.Message,
                        title = "Error",
                        errors = new List<string>() { ex.InnerException.Message },
                        ok = false
                    });
                }
            }
        }
        [HttpPost("[action]")]
        public async Task<IActionResult> UpdateAccount([FromBody]UserUpdate userUpdate)
        {
            IDbContextTransaction trans = await this._userService.BeginTransactionAsync();
            using (trans)
            {
                try
                {
                    AppUser user = await this._userManager.FindByNameAsync(userUpdate.Nik);
                    IdentityResult res_identity = null;
                    if (userUpdate.Password != null)
                    {
                        var token_change_password = await this._userManager.GeneratePasswordResetTokenAsync(user);
                        res_identity = await this._userManager.ResetPasswordAsync(user, token_change_password, userUpdate.Password);
                        // TODO send email to notify new password

                        if (!res_identity.Succeeded)
                        {
                            return BadRequest(new CustomResponse
                            {
                                message = "Gagal Update Password User pada IdentityUser",
                                title = "Error",
                                ok = false,
                                errors = null
                            });
                        }
                    }
                    
                    if(user.Email != userUpdate.Email)
                    {
                        var token_change_email = await this._userManager.GenerateChangeEmailTokenAsync(user, userUpdate.Email);
                        var old_email = user.Email;
                        res_identity = await this._userManager.ChangeEmailAsync(user, userUpdate.Email, token_change_email);
                        // TODO send email to notify changing email contain old and new email

                        if (!res_identity.Succeeded)
                        {
                            return BadRequest(new CustomResponse
                            {
                                message = "Gagal Update Email User pada IdentityUser",
                                title = "Error",
                                ok = false,
                                errors = null
                            });
                        }
                    }
                    User userlama = this._userService.FindByKey(userUpdate.Nik);
                    userlama.Ext = userlama.Ext == userUpdate.Ext ? userlama.Ext : userUpdate.Ext;
                    userlama.DirektoratKode = userlama.DirektoratKode == userUpdate.KodeDirektorat ? userlama.DirektoratKode : userUpdate.KodeDirektorat;
                    userlama.DepartemenKode = userlama.DepartemenKode == userUpdate.KodeDepartemen ? userlama.DepartemenKode : userUpdate.KodeDepartemen;
                    userlama.SubDepartemenKode = userlama.SubDepartemenKode == userUpdate.KodeSubDepartemen ? userlama.SubDepartemenKode : userUpdate.KodeSubDepartemen;
                    userlama.CabangKode = userlama.CabangKode == userUpdate.KodeCabang ? userlama.CabangKode : userUpdate.KodeCabang;
                    userlama.UnitKode = userlama.UnitKode == userUpdate.KodeUnit ? userlama.UnitKode : userUpdate.KodeUnit;
                    userlama.Nama = userlama.Nama.ToLower() == userUpdate.Nama.ToLower() ? userlama.Nama : userUpdate.Nama;
                    userlama.AtasanNik = userlama.AtasanNik == userUpdate.NikAtasan ? userlama.AtasanNik : userUpdate.NikAtasan;
                    this._userService.Update(userlama);
                    var res_save = await this._userService.SaveAsync();
                    if (res_save == 1)
                    {
                        this._userService.Commit(trans);
                        return Ok(new CustomResponse
                        {
                            errors = null,
                            message = "Update User Berhasil",
                            title = "Success",
                            ok = true
                        });
                    }
                    else
                    {
                        this._userService.Rollback(trans);
                        return BadRequest(new CustomResponse
                        {
                            message = "Update User Gagal",
                            title = "Error",
                            errors =null,
                            ok = false
                        });
                    }
                }
                catch (Exception ex)
                {
                    this._userService.Rollback(trans);
                    return BadRequest(new CustomResponse
                    {
                        message = ex.Message,
                        title = "Error",
                        errors = new List<string>() { ex.InnerException.Message },
                        ok = false
                    });
                }
            }
        }
        [HttpPost("[action]")]
        public async Task<IActionResult> DeleteAccount([FromBody]User userDel)
        {
            IDbContextTransaction trans = await this._userService.BeginTransactionAsync();
            using (trans)
            {
                try
                {
                    this._userService.DeleteByKey(userDel.Nik);
                    var res_save = await this._userService.SaveAsync();
                    if (res_save == 1)
                    {
                        AppUser newUser = await this._userManager.FindByNameAsync(userDel.Nik);
                        var result = await _userManager.DeleteAsync(newUser);
                        if (result.Succeeded)
                        {
                            this._userService.Commit(trans);
                            return Ok(new CustomResponse
                            {
                                errors = null,
                                message = "Delete User Berhasil",
                                title = "Success",
                                ok = true

                            });
                        }
                        this._userService.Rollback(trans);
                        return BadRequest(new CustomResponse
                        {
                            errors = null,
                            message = "Gagal Menghapus Data User pada IdentityUser",
                            title = "Error",
                            ok = false
                        });
                    }
                    this._userService.Rollback(trans);
                    return BadRequest(new CustomResponse
                    {
                        message = "Gagal Menghapus Data User",
                        title = "Error",
                        ok = false,
                        errors = null
                    });
                }

                catch (Exception ex)
                {
                    this._userService.Rollback(trans);
                    return BadRequest(new CustomResponse
                    {
                        message = ex.Message,
                        title = "Error",
                        errors = new List<string>() { ex.InnerException.Message },
                        ok = false
                    });
                }
            }
        }

        [HttpGet("[action]")]
        public IEnumerable<User> GetByFilter([FromQuery]User entity)
        {
            return this._userService.GetAllByFilter(entity);
        }
        [HttpGet("[action]")]
        public GridResponse<User> GetByFilterGrid([FromQuery]Grid entity)
        {
            return this._userService.GetAllByFilterGrid(entity);
        }
        [HttpGet("[action]")]
        public IEnumerable<User> GetAll()
        {
            return this._userService.GetAll();
        }

        [HttpGet("[action]")]
        public User GetById([FromQuery]string Kode)
        {
            return this._userService.FindByKey(Kode);
        }

        [HttpGet("[action]")]
        public async Task<List<string>> GetAvailableRole([FromQuery]string Kode, [FromQuery]string cari=null)
        {
            if(cari == null)
            {
                cari = "";
            }
            var user = await this._userManager.FindByNameAsync(Kode);
            var user_roles = await this._userManager.GetRolesAsync(user);
            var roles = this._roleManager.Roles.Where(x=>x.Name.ToLower().Contains(cari.ToLower()))
                                               .Where(x => !x.Name.Contains(":"))
                                               .Where(x => !user_roles.Contains(x.Name))
                                               .Where(x => !x.Name.Equals("USER"))
                                               .OrderBy(x=>x.Name)
                                               .Select(x=> x.Name).ToList();
            return roles;
        }

        [HttpGet("[action]")]
        public async Task<IList<string>> GetUserRole([FromQuery]string Kode)
        {
            var user = await this._userManager.FindByNameAsync(Kode);
            var user_roles = await this._userManager.GetRolesAsync(user);
            user_roles = user_roles.Where(x => !x.Equals("USER")).OrderBy(x=>x).ToList();
            return user_roles;
        }

        [HttpGet("[action]")]
        public User GetDetail([FromQuery]string Kode)
        {
            return this._userService.GetUserDetail(Kode);
        }
        [HttpGet("[action]")]
        public UserVM GetDetailUser([FromQuery] string Kode)
        {
            var u = this._userService.GetUserDetail(Kode);
            return new UserVM
            {
                Atasan = u.Atasan.Nama,
                AtasanNik = u.AtasanNik,
                Cabang = u.Cabang.NamaCabang,
                CabangKode = u.CabangKode,
                Departemen = u.Departemen.NamaDepartemen,
                DepartemenKode = u.DepartemenKode,
                Direktorat = u.Direktorat.NamaDirektorat,
                DirektoratKode = u.DirektoratKode,
                Email = u.Email,
                Ext = u.Ext,
                Nama = u.Nama,
                Nik = u.Nik,
                SubDepartemen = u.SubDepartemen.NamaSubDepartemen,
                SubDepartemenKode = u.SubDepartemenKode,
                Unit = u.Unit.NamaUnit,
                UnitKode = u.UnitKode
            };
        }
        [HttpPost("[action]")]
        public async Task<IActionResult> RemoveRoleFromUser([FromBody]UserAddRole user)
        {
            var user_app = await this._userManager.FindByNameAsync(user.Nik);
            var result = await this._userManager.RemoveFromRoleAsync(user_app, user.Roles.ElementAt(0));
            if (result.Succeeded)
            {
                return Ok(new CustomResponse
                {
                    errors = null,
                    message = "Delete Role User Berhasil",
                    title = "Success",
                    ok = true

                });
            }
            return BadRequest(new CustomResponse
            {
                errors = null,
                message = "Gagal Menghapus Role User pada IdentityUser",
                title = "Error",
                ok = false
            });
        }

    }
}