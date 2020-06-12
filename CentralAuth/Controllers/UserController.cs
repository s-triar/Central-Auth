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

        public UserController(IUserService userService,
                              UserManager<AppUser> userManager, 
                              SignInManager<AppUser> signInManager, 
                              RoleManager<AppRole> roleManager)
        {
            _userService = userService;
            _userManager = userManager;
            _signInManager = signInManager;
            _roleManager = roleManager;
        }
        [HttpPost("[action]")]
        public async Task<IActionResult> AddClaimsToUser([FromBody] UserAddRole entity)
        {
            AppUser user = await _userManager.FindByNameAsync(entity.Nik);
            if (user != null)
            {
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
                    userlama.Ext = userlama.Ext.ToLower() == userUpdate.Ext.ToLower() ? userlama.Ext : userUpdate.Ext;
                    userlama.DirektoratKode = userlama.DirektoratKode.ToLower() == userUpdate.KodeDirektorat.ToLower() ? userlama.DirektoratKode : userUpdate.KodeDirektorat;
                    userlama.DepartemenKode = userlama.DepartemenKode.ToLower() == userUpdate.KodeDepartemen.ToLower() ? userlama.DepartemenKode : userUpdate.KodeDepartemen;
                    userlama.SubDepartemenKode = userlama.SubDepartemenKode.ToLower() == userUpdate.KodeSubDepartemen.ToLower() ? userlama.SubDepartemenKode : userUpdate.KodeSubDepartemen;
                    userlama.CabangKode = userlama.CabangKode.ToLower() == userUpdate.KodeCabang.ToLower() ? userlama.CabangKode : userUpdate.KodeCabang;
                    userlama.UnitKode = userlama.UnitKode.ToLower() == userUpdate.KodeUnit.ToLower() ? userlama.UnitKode : userUpdate.KodeUnit;
                    userlama.Nama = userlama.Nama.ToLower() == userUpdate.Nama.ToLower() ? userlama.Nama : userUpdate.Nama;
                    userlama.AtasanNik = userlama.AtasanNik.ToLower() == userUpdate.NikAtasan.ToLower() ? userlama.AtasanNik : userUpdate.NikAtasan;
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

        [HttpGet("[action]/{id}")]
        public User GetById(string Kode)
        {
            return this._userService.FindByKey(Kode);
        }
    }
}