using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using CentralAuth.Commons.Interfaces;
using CentralAuth.Commons.Models;
using CentralAuth.Datas;
using IdentityModel;
using IdentityServer4.EntityFramework.Entities;
using IdentityServer4.EntityFramework.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Razor;
using Microsoft.EntityFrameworkCore.Storage;

namespace CentralAuth.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProjectController : ControllerBase
    {
        private readonly IProjectService _projectService;
        private readonly IUtilityService _utilityService;

        public ProjectController(IProjectService projectService, IUtilityService utilityService)
        {
            _projectService = projectService;
            _utilityService = utilityService;
        }

        [HttpGet("[action]")]
        public IEnumerable<Project> GetAll()
        {
            return this._projectService.GetAll();
        }
        [HttpGet("[action]/{id}")]
        public Project GetById(string ApiName)
        {
            return this._projectService.FindByKey(ApiName);
        }
        [HttpGet("[action]")]
        public async Task<bool> CheckApiName([FromQuery]string ApiName)
        {
            return this._projectService.checkAvailabilityApiName(ApiName);
        }

        [HttpGet("[action]")]
        public async Task<bool> CheckRoleName([FromQuery] string RoleName)
        {
            return await this._projectService.checkAvailabilityRoleName(RoleName);
        }
        [HttpGet("[action]")]
        public async Task<bool> CheckClaimName([FromQuery] string ClaimName)
        {
            return this._projectService.checkAvailabilityClaimName(ClaimName);
        }

        [HttpGet("[action]")]
        public GridResponse<Project> GetByFilterGrid([FromQuery]Grid entity)
        {
            return this._projectService.GetAllByFilterGrid(entity);
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> ApprovalFollower([FromBody]ProjectToProject entity)
        {
            var trans = await this._projectService.BeginTransactionAsync();
            try
            {
                using (trans)
                {
                    var decision = (bool)entity.Approve;
                    this._projectService.ApprovalFollower(entity.Id, decision);
                    var t = await this._projectService.SaveAsync();
                    var res = new CustomResponse()
                    {
                        errors = null,
                        message = "Approval Follower Projek Berhasil",
                        title = "Success",
                        ok = true
                    };
                    if (t > 0)
                    {
                        if (decision == true)
                        {
                            this._projectService.AddScopeApiToClient(entity.Id);
                            t = await this._projectService.SaveConfigContextAsync();
                            if (t > 0)
                            {
                                this._projectService.Commit(trans);
                                return Ok(res);
                            }
                            this._projectService.Rollback(trans);
                            res = new CustomResponse()
                            {
                                errors = null,
                                message = "Approval Follower Projek Gagal Tambah Scope",
                                title = "Warning",
                                ok = false
                            };
                            return BadRequest(res);
                        }
                        else
                        {
                            this._projectService.DeleteFollowingScopeApi(entity.ProjekApiName, entity.KolaborasiApiName);
                            t = await this._projectService.SaveConfigContextAsync();
                            if (t > 0)
                            {
                                this._projectService.Commit(trans);
                                return Ok(res);
                            }
                            this._projectService.Rollback(trans);
                            res = new CustomResponse()
                            {
                                errors = null,
                                message = "Approval Follower Projek Gagal Hapus Scope",
                                title = "Warning",
                                ok = false
                            };
                            return BadRequest(res);
                        }
                        
                    }
                    this._projectService.Rollback(trans);
                    res = new CustomResponse()
                    {
                        errors = null,
                        message = "Approval Follower Projek Gagal",
                        title = "Warning",
                        ok = false
                    };
                    return BadRequest(res);
                }
            }
            catch (Exception ex)
            {
                var res = new CustomResponse()
                {
                    errors = new List<string>() { ex.InnerException.Message },
                    message = ex.Message,
                    title = "Error",
                    ok = false
                };
                this._projectService.Rollback(trans);
                return BadRequest(res);
            }
        }


        [HttpPost("[action]")]
        public async Task<IActionResult> AddFollowing([FromBody]ProjectToProject entity)
        {
            var trans = await this._projectService.BeginTransactionAsync();
            try
            {
                using (trans)
                {
                    this._projectService.FollowProject(entity.ProjekApiName, entity.KolaborasiApiName);
                    var t = await this._projectService.SaveAsync();
                    var res = new CustomResponse()
                    {
                        errors = null,
                        message = "Follow Projek Berhasil",
                        title = "Success",
                        ok = true
                    };
                    if (t >0)
                    {
                        this._projectService.Commit(trans);
                        return Ok(res);
                    }
                    this._projectService.Rollback(trans);
                    res = new CustomResponse()
                    {
                        errors = null,
                        message = "Follow Projek Gagal",
                        title = "Warning",
                        ok = false
                    };
                    return BadRequest(res);
                }
            }
            catch(Exception ex)
            {
                var res = new CustomResponse()
                {
                    errors = new List<string>() { ex.InnerException.Message },
                    message = ex.Message,
                    title = "Error",
                    ok = false
                };
                this._projectService.Rollback(trans);
                return BadRequest(res);
            }
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> Create([FromBody]Project entity)
        {
            var trans = await this._projectService.BeginTransactionAsync();
            var configTrans = await this._projectService.BeginTransactionConfigContextAsync();
            try
            {
                using (trans)
                {
                    entity.ClientId = Guid.NewGuid().ToString()+this._utilityService.RandomString(4, false);
                    entity.ClientSecret = this._utilityService.RandomString(23, false);
                    this._projectService.Add(entity);
                    var t = await this._projectService.SaveAsync();
                    var res = new CustomResponse()
                    {
                        errors = null,
                        message = "Tambah Projek Berhasil",
                        title = "Success",
                        ok = true
                    };
                    if (t > 0)
                    {
                        using (configTrans)
                        {
                            Project project = this._projectService.FindByKey(entity.ApiName);
                            this._projectService.CreateClient(project);
                            t = await this._projectService.SaveConfigContextAsync();
                            if (t > 0)
                            {
                                this._projectService.CreateApiResource(project);
                                //this._projectService.CreateIdentityResource(project);
                                t = await this._projectService.SaveConfigContextAsync();
                                if (t > 0)
                                {
                                    this._projectService.Commit(trans);
                                    this._projectService.Commit(configTrans);
                                    return Ok(res);
                                }
                            }
                            this._projectService.Rollback(trans);
                            this._projectService.Rollback(configTrans);
                            res = new CustomResponse()
                            {
                                errors = null,
                                message = "Tambah Client Gagal",
                                title = "Warning",
                                ok = false
                            };
                            return BadRequest(res);
                        }

                    }
                    res = new CustomResponse()
                    {
                        errors = null,
                        message = "Tambah Projek Gagal",
                        title = "Warning",
                        ok = false
                    };
                    this._projectService.Rollback(trans);
                    return BadRequest(res);
                }
                
            }
            catch (Exception ex)
            {
                var res = new CustomResponse()
                {
                    errors = new List<string>() { ex.InnerException.Message },
                    message = ex.Message,
                    title = "Error",
                    ok = false
                };
                this._projectService.Rollback(trans);
                this._projectService.Rollback(configTrans);

                return BadRequest(res);
            }
        }
        [HttpPost("[action]")]
        public async Task<IActionResult> Update([FromBody]Department entity)
        {
            throw new NotImplementedException();
        }
        [HttpPost("[action]")]
        public async Task<IActionResult> Delete([FromBody]Project entity)
        {
            var res = new CustomResponse()
            {
                errors = null,
                message = "Delete Projek Berhasil",
                title = "Success",
                ok = true
            };
            var t = -1;
            var trans = await this._projectService.BeginTransactionAsync();
            var configTrans = await this._projectService.BeginTransactionConfigContextAsync();
            try
            {
                var follower = this._projectService.GetConnectedWith(entity.ApiName);
                var following = this._projectService.GetConnectingWith(entity.ApiName);

                if(follower.Count() > 0 || following.Count() > 0)
                {
                    res = new CustomResponse()
                    {
                        errors = null,
                        message = "Delete Projek Gagal."+
                                   (follower.Count() > 0 ? " API tersambung ke dengan "+ follower.Count()+ " API":"") +
                                   (follower.Count() > 0 && following.Count()>0 ? " dan":"") +
                                   (following.Count() > 0 ? " API menyambung ke "+ following.Count()+" API":"")+".",
                        title = "Warning",
                        ok = false
                    };
                    return BadRequest(res);
                }
                using (configTrans)
                {
                    this._projectService.DeleteScopeApi(entity.ApiName);
                    this._projectService.DeleteApiResource(entity.ApiName);
                    //this._projectService.DeleteIdentityResource(entity.ApiName);
                    this._projectService.DeleteClient(entity.ApiName);
                    
                    t = await this._projectService.SaveConfigContextAsync();
                    if (t >0)
                    {
                        using (trans)
                        {
                            //TODO DELETE UserProject
                            this._projectService.DeleteAllRolesProject(entity.ApiName);
                            this._projectService.DeleteUserProject(entity.ApiName);
                            this._projectService.DeleteProjectCollab(entity.ApiName);
                            this._projectService.DeleteProject(entity.ApiName);
                            t = await this._projectService.SaveAsync();
                            if (t >0)
                            {
                                this._projectService.Commit(configTrans);
                                this._projectService.Commit(trans);
                                return Ok(res);
                            }
                            this._projectService.Rollback(configTrans);
                            res = new CustomResponse()
                            {
                                errors = null,
                                message = "Delete Projek Gagal pada hapus API",
                                title = "Warning",
                                ok = false
                            };
                            return BadRequest(res);
                        }
                    }
                    this._projectService.Rollback(trans);
                    res = new CustomResponse()
                    {
                        errors = null,
                        message = "Delete Projek Gagal",
                        title = "Warning",
                        ok = false
                    };
                    return BadRequest(res);
                }                
            }
            catch (Exception ex)
            {
                this._projectService.Rollback(configTrans);
                this._projectService.Rollback(trans);
                res = new CustomResponse()
                {
                    errors = new List<string>() { ex.InnerException.Message },
                    message = ex.Message,
                    title = "Error",
                    ok = false
                };
                return BadRequest(res);
            }
        }
        [HttpGet("[action]")]
        public GridResponse<User> GetListUserByFilterGrid([FromQuery]Grid entity, [FromQuery]string ApiName)
        {
            return this._projectService.GetListUserGrid(entity, ApiName);
        }

        [HttpGet("[action]")]
        public async Task<ObjectResult> GetProjectDashboard([FromQuery]string ApiName)
        {
            var project = this._projectService.FindByKey(ApiName);
            project = new Project
            {
                NamaProject = project.NamaProject,
                ApiName = project.ApiName,
                ClientId = project.ClientId,
                ClientSecret = project.ClientSecret,
                Type = project.Type,
                Url = project.Url
            };

            var nUser = this._projectService.GetNumberUser(ApiName);
            var nClaim = this._projectService.GetNumberClaim(ApiName);
            var nRole = this._projectService.GetNumberRole(ApiName);
            var nFollower = this._projectService.GetNumberFollower(ApiName);
            var nFollowing = this._projectService.GetNumberFollowing(ApiName);

            List<int> infos = new List<int> { nUser, nClaim,nRole, nFollower, nFollowing };

            return Ok(new CustomResponse
            {
                data = new
                {
                    project = project,
                    infos = infos
                },
                errors = null,
                message = "Data Projek berhasil didapatkan",
                title = "Success",
                ok = true
            });
        }
        [HttpGet("[action]")]
        public GridResponse<ProjectToProject> GetFollowing([FromQuery]Grid entity, [FromQuery]string ApiName)
        {
            return this._projectService.GetFollowingFilterGrid(entity, ApiName);
        }
        [HttpGet("[action]")]
        public GridResponse<ProjectToProject> GetFollower([FromQuery]Grid entity, [FromQuery]string ApiName)
        {
            return this._projectService.GetFollowerFilterGrid(entity, ApiName);
        }
        [HttpGet("[action]")]
        public GridResponse<Project> CheckAvailabilityFollowing([FromQuery]Grid entity, [FromQuery]string ApiName)
        {
            return this._projectService.checkAvailabilityFollowing(entity, ApiName);
        }
        [HttpPost("[action]")]
        public async Task<IActionResult> DeleteFollowing([FromBody]ProjectToProject entity)
        {
            var res = new CustomResponse()
            {
                errors = null,
                message = "Delete Following Projek Berhasil",
                title = "Success",
                ok = true
            };
            var t = -1;
            var trans = await this._projectService.BeginTransactionAsync();
            var configTrans = await this._projectService.BeginTransactionConfigContextAsync();
            try
            {
                using (trans)
                {
                    this._projectService.DeleteFollowingProject(entity.ProjekApiName, entity.KolaborasiApiName);
                    t = await this._projectService.SaveAsync();
                    if (t > 0)
                    {
                        using (configTrans)
                        {
                            this._projectService.DeleteFollowingScopeApi(entity.ProjekApiName, entity.KolaborasiApiName);
                            t = await this._projectService.SaveAsync();
                            //if (t > 0)
                            //{
                                this._projectService.Commit(trans);
                                this._projectService.Commit(configTrans);
                                return Ok(res);
                            //}
                            //this._projectService.Rollback(trans);
                            //this._projectService.Rollback(configTrans);
                            //res = new CustomResponse()
                            //{
                            //    errors = null,
                            //    message = "Delete Following Gagal pada hapus API",
                            //    title = "Warning",
                            //    ok = false
                            //};
                            //return BadRequest(res);
                        }
                    }
                    this._projectService.Rollback(trans);
                    res = new CustomResponse()
                    {
                        errors = null,
                        message = "Delete Following Gagal pada hapus relasi",
                        title = "Warning",
                        ok = false
                    };
                    return BadRequest(res);
                }
            }
            catch (Exception ex)
            {
                this._projectService.Rollback(configTrans);
                this._projectService.Rollback(trans);
                res = new CustomResponse()
                {
                    errors = new List<string>() { ex.InnerException.Message },
                    message = ex.Message,
                    title = "Error",
                    ok = false
                };
                return BadRequest(res);
            }
        }

        //Todo Add Claim Project
        [HttpPost("[action]")]
        public async Task<IActionResult> CreateProjectClaim([FromBody] ProjectClaim entity)
        {
            try
            {
                this._projectService.CreateClaimProject(entity.ProjekApiName, entity.ClaimName);
                var t = await this._projectService.SaveAsync();
                var res = new CustomResponse()
                {
                    errors = null,
                    message = "Tambah Claim Projek Berhasil",
                    title = "Success",
                    ok = true
                };
                if (t == 1) { return Ok(res); }
                res = new CustomResponse()
                {
                    errors = null,
                    message = "Tambah Claim Projek Gagal",
                    title = "Warning",
                    ok = false
                };
                return BadRequest(res);
            }
            catch (Exception ex)
            {
                var res = new CustomResponse()
                {
                    errors = new List<string>() { ex.InnerException.Message },
                    message = ex.Message,
                    title = "Error",
                    ok = false
                };
                return BadRequest(res);
            }
        }
        //Todo Update Claim Project
        [HttpPost("[action]")]
        public async Task<IActionResult> UpdateProjectClaim([FromBody] ProjectClaim entity)
        {
            try
            {
                this._projectService.UpdateClaimProject(entity.Id, entity.ClaimName);
                var t = await this._projectService.SaveAsync();
                var res = new CustomResponse()
                {
                    errors = null,
                    message = "Update Claim Projek Berhasil",
                    title = "Success",
                    ok = true
                };
                if (t == 1) { return Ok(res); }
                res = new CustomResponse()
                {
                    errors = null,
                    message = "Update Claim Projek Gagal",
                    title = "Warning",
                    ok = false
                };
                return BadRequest(res);
            }
            catch (Exception ex)
            {
                var res = new CustomResponse()
                {
                    errors = new List<string>() { ex.InnerException.Message },
                    message = ex.Message,
                    title = "Error",
                    ok = false
                };
                return BadRequest(res);
            }
        }
        //Todo Remove Claim Project
        [HttpPost("[action]")]
        public async Task<IActionResult> DeleteProjectClaim([FromBody] ProjectClaim entity)
        {

            try
            {
                this._projectService.DeleteClaimProject(entity.Id);
                var t = await this._projectService.SaveAsync();
                var res = new CustomResponse()
                {
                    errors = null,
                    message = "Delete Claim Projek Berhasil",
                    title = "Success",
                    ok = true
                };
                if (t == 1) { return Ok(res); }
                res = new CustomResponse()
                {
                    errors = null,
                    message = "Delete Claim Projek Gagal",
                    title = "Warning",
                    ok = false
                };
                return BadRequest(res);
            }
            catch (Exception ex)
            {
                var res = new CustomResponse()
                {
                    errors = new List<string>() { ex.InnerException.Message },
                    message = ex.Message,
                    title = "Error",
                    ok = false
                };
                return BadRequest(res);
            }
        }
        //Todo Grid Claim Project
        [HttpGet("[action]")]
        public GridResponse<ProjectClaim> GetProjectClaimByFilterGrid([FromQuery] Grid entity, [FromQuery] string ApiName)
        {
            return this._projectService.GetProjectClaimGrid(entity, ApiName);
        }
        //Todo Add Role Project
        [HttpPost("[action]")]
        public async Task<IActionResult> CreateProjectRole([FromBody] AppRole entity)
        {
            try
            {
                this._projectService.AddRoleProject(entity.Name, entity.ProjectApiName);
                var t = await this._projectService.SaveAsync();
                var res = new CustomResponse()
                {
                    errors = null,
                    message = "Tambah Role Projek Berhasil",
                    title = "Success",
                    ok = true
                };
                if (t == 1) { return Ok(res); }
                res = new CustomResponse()
                {
                    errors = null,
                    message = "Tambah Role Projek Gagal",
                    title = "Warning",
                    ok = false
                };
                return BadRequest(res);
            }
            catch (Exception ex)
            {
                var res = new CustomResponse()
                {
                    errors = new List<string>() { ex.InnerException.Message },
                    message = ex.Message,
                    title = "Error",
                    ok = false
                };
                return BadRequest(res);
            }
        }
        //Todo Update Role Project
        [HttpPost("[action]")]
        public async Task<IActionResult> UpdateProjectRole([FromBody] AppRole entity)
        {
            try
            {
                var t = await this._projectService.UpdateRoleProject(entity.Id, entity.Name);
                var res = new CustomResponse()
                {
                    errors = null,
                    message = "Update Role Projek Berhasil",
                    title = "Success",
                    ok = true
                };
                if (t == true) { return Ok(res); }
                res = new CustomResponse()
                {
                    errors = null,
                    message = "Update Role Projek Gagal",
                    title = "Warning",
                    ok = false
                };
                return BadRequest(res);
            }
            catch (Exception ex)
            {
                var res = new CustomResponse()
                {
                    errors = new List<string>() { ex.InnerException.Message },
                    message = ex.Message,
                    title = "Error",
                    ok = false
                };
                return BadRequest(res);
            }
        }
        //Todo Remove Role Project
        [HttpPost("[action]")]
        public async Task<IActionResult> RemoveProjectRole([FromBody] AppRole entity)
        {
            try
            {
                var t = await this._projectService.RemoveRoleProject(entity.Id);
                var res = new CustomResponse()
                {
                    errors = null,
                    message = "Hapus Role Projek Berhasil",
                    title = "Success",
                    ok = true
                };
                if (t == true) { return Ok(res); }
                res = new CustomResponse()
                {
                    errors = null,
                    message = "Hapus Role Projek Gagal",
                    title = "Warning",
                    ok = false
                };
                return BadRequest(res);
            }
            catch (Exception ex)
            {
                var res = new CustomResponse()
                {
                    errors = new List<string>() { ex.InnerException.Message },
                    message = ex.Message,
                    title = "Error",
                    ok = false
                };
                return BadRequest(res);
            }
        }
        //Todo Grid Role Project
        [HttpGet("[action]")]
        public GridResponse<AppRole> GetProjectRoleByFilterGrid([FromQuery] Grid entity, [FromQuery] string ApiName)
        {
            return this._projectService.GetProjectRoleGrid(entity, ApiName);
        }
        //Todo Add Claim Project to Role Project
        [HttpPost("[action]")]
        public async Task<IActionResult> AddClaimToProjectRole([FromBody] ProjectIdentityVM entity )
        {
            try
            {
                var t = await this._projectService.AddClaimToRoleProject(entity.IdRole, entity.IdProjectClaim);
                var res = new CustomResponse()
                {
                    errors = null,
                    message = "Tambah Claim ke Role Projek Berhasil",
                    title = "Success",
                    ok = true
                };
                if (t == true) { return Ok(res); }
                res = new CustomResponse()
                {
                    errors = null,
                    message = "Tambah Claim ke Role Projek Gagal",
                    title = "Warning",
                    ok = false
                };
                return BadRequest(res);
            }
            catch (Exception ex)
            {
                var res = new CustomResponse()
                {
                    errors = new List<string>() { ex.InnerException.Message },
                    message = ex.Message,
                    title = "Error",
                    ok = false
                };
                return BadRequest(res);
            }
        }
        //Todo Remove Claim Project to Role Project
        [HttpPost("[action]")]
        public async Task<IActionResult> RemoveClaimFromProjectRole([FromBody] ProjectIdentityVM entity)
        {
            try
            {
                var t = await this._projectService.RemoveClaimFromRoleProject(entity.IdRole, entity.IdProjectClaim);
                var res = new CustomResponse()
                {
                    errors = null,
                    message = "Hapus Claim dari Role Projek Berhasil",
                    title = "Success",
                    ok = true
                };
                if (t == true) { return Ok(res); }
                res = new CustomResponse()
                {
                    errors = null,
                    message = "Hapus Claim dari Role Projek Gagal",
                    title = "Warning",
                    ok = false
                };
                return BadRequest(res);
            }
            catch (Exception ex)
            {
                var res = new CustomResponse()
                {
                    errors = new List<string>() { ex.InnerException.Message },
                    message = ex.Message,
                    title = "Error",
                    ok = false
                };
                return BadRequest(res);
            }
        }
        //Todo Add User To Project
        [HttpPost("[action]")]
        public async Task<IActionResult> AddUserToProject([FromBody] UserProject entity)
        {
            try
            {
                this._projectService.AddUserToProject(entity.PenggunaNik, entity.ProjekApiName);
                var t = await this._projectService.SaveAsync();
                var res = new CustomResponse()
                {
                    errors = null,
                    message = "Tambah User ke Projek Berhasil",
                    title = "Success",
                    ok = true
                };
                if (t > 0) { return Ok(res); }
                res = new CustomResponse()
                {
                    errors = null,
                    message = "Tambah User ke Projek Gagal",
                    title = "Warning",
                    ok = false
                };
                return BadRequest(res);
            }
            catch (Exception ex)
            {
                var res = new CustomResponse()
                {
                    errors = new List<string>() { ex.InnerException.Message },
                    message = ex.Message,
                    title = "Error",
                    ok = false
                };
                return BadRequest(res);
            }
        }
        //Todo Remove User From Project
        [HttpPost("[action]")]
        public async Task<IActionResult> RemoveUserFromProject([FromBody] UserProject entity)
        {
            try
            {
                var tb = await this._projectService.RemoveUserFromProject(entity.PenggunaNik, entity.ProjekApiName);
                var t = await this._projectService.SaveAsync();
                var res = new CustomResponse()
                {
                    errors = null,
                    message = "Hapus User ke Projek Berhasil",
                    title = "Success",
                    ok = true
                };
                if (t > 0 ) { return Ok(res); }
                res = new CustomResponse()
                {
                    errors = null,
                    message = "Hapus User ke Projek Gagal",
                    title = "Warning",
                    ok = false
                };
                return BadRequest(res);
            }
            catch (Exception ex)
            {
                var res = new CustomResponse()
                {
                    errors = new List<string>() { ex.InnerException.Message },
                    message = ex.Message,
                    title = "Error",
                    ok = false
                };
                return BadRequest(res);
            }
        }
        //Todo Add User Role
        [HttpPost("[action]")]
        public async Task<IActionResult> AddRoleToUserProject([FromBody] ProjectIdentityVM entity)
        {
            try
            {
                var t = await this._projectService.AddRoleToUserProject(entity.IdRole, entity.Nik);
                var res = new CustomResponse()
                {
                    errors = null,
                    message = "Tambah Role ke User Projek Berhasil",
                    title = "Success",
                    ok = true
                };
                if (t == true) { return Ok(res); }
                res = new CustomResponse()
                {
                    errors = null,
                    message = "Tambah Role ke User Projek Gagal",
                    title = "Warning",
                    ok = false
                };
                return BadRequest(res);
            }
            catch (Exception ex)
            {
                var res = new CustomResponse()
                {
                    errors = new List<string>() { ex.InnerException.Message },
                    message = ex.Message,
                    title = "Error",
                    ok = false
                };
                return BadRequest(res);
            }
        }
        //Todo Remove User Role
        [HttpPost("[action]")]
        public async Task<IActionResult> RemoveRoleFromUserProject([FromBody] ProjectIdentityVM entity)
        {
            try
            {
                var t = await this._projectService.RemoveRoleFromUserProject(entity.IdRole, entity.Nik);
                var res = new CustomResponse()
                {
                    errors = null,
                    message = "Hapus Role dari User Projek Berhasil",
                    title = "Success",
                    ok = true
                };
                if (t == true) { return Ok(res); }
                res = new CustomResponse()
                {
                    errors = null,
                    message = "Hapus Role dari User Projek Gagal",
                    title = "Warning",
                    ok = false
                };
                return BadRequest(res);
            }
            catch (Exception ex)
            {
                var res = new CustomResponse()
                {
                    errors = new List<string>() { ex.InnerException.Message },
                    message = ex.Message,
                    title = "Error",
                    ok = false
                };
                return BadRequest(res);
            }
        }
        //Todo Add User Claim
        [HttpPost("[action]")]
        public async Task<IActionResult> AddClaimoUserProject([FromBody] ProjectIdentityVM entity)
        {
            try
            {
                var t = await this._projectService.AddClaimToUserProject(entity.IdProjectClaim, entity.Nik);
                var res = new CustomResponse()
                {
                    errors = null,
                    message = "Tambah Claim ke User Projek Berhasil",
                    title = "Success",
                    ok = true
                };
                if (t == true) { return Ok(res); }
                res = new CustomResponse()
                {
                    errors = null,
                    message = "Tambah Claim ke User Projek Gagal",
                    title = "Warning",
                    ok = false
                };
                return BadRequest(res);
            }
            catch (Exception ex)
            {
                var res = new CustomResponse()
                {
                    errors = new List<string>() { ex.InnerException.Message },
                    message = ex.Message,
                    title = "Error",
                    ok = false
                };
                return BadRequest(res);
            }
        }
        //Todo remove User Claim
        [HttpPost("[action]")]
        public async Task<IActionResult> RemoveClaimFromUserProject([FromBody] ProjectIdentityVM entity)
        {
            try
            {
                var t = await this._projectService.RemoveClaimFromUserProject(entity.IdProjectClaim, entity.Nik);
                var res = new CustomResponse()
                {
                    errors = null,
                    message = "Hapus Claim dari User Projek Berhasil",
                    title = "Success",
                    ok = true
                };
                if (t == true) { return Ok(res); }
                res = new CustomResponse()
                {
                    errors = null,
                    message = "Hapus Claim dari User Projek Gagal",
                    title = "Warning",
                    ok = false
                };
                return BadRequest(res);
            }
            catch (Exception ex)
            {
                var res = new CustomResponse()
                {
                    errors = new List<string>() { ex.InnerException.Message },
                    message = ex.Message,
                    title = "Error",
                    ok = false
                };
                return BadRequest(res);
            }
        }

        [HttpGet("[action]")]
        public async Task<List<ProjectClaim>> GetAvailableClaimForRole([FromQuery] string ApiName, [FromQuery] string IdRole, [FromQuery] string cari = null)
        {
            if (cari == null)
            {
                cari = "";
            }
            return await this._projectService.getAvailableClaimForRole(ApiName,IdRole, cari) ;
        }
        [HttpGet("[action]")]
        public async Task<List<ProjectClaim>> GetAvailableClaimForUser([FromQuery] string ApiName, [FromQuery] string Nik, [FromQuery] string cari = null)
        {
            if (cari == null)
            {
                cari = "";
            }
            return await this._projectService.getAvailableClaimForUser(ApiName, Nik, cari);
        }
        [HttpGet("[action]")]
        public async Task<List<AppRole>> GetAvailableRoleForUser([FromQuery] string ApiName, [FromQuery] string Nik, [FromQuery] string cari = null)
        {
            if (cari == null)
            {
                cari = "";
            }
            return await this._projectService.getAvailableRoleForUser(ApiName, Nik, cari);
        }

        [HttpGet("[action]")]
        public GridResponse<User> GetAvailableUserProject([FromQuery] Grid entity, [FromQuery] string ApiName)
        {
            return this._projectService.getAvailableUserProject(entity, ApiName);
        }
        [HttpGet("[action]")]
        public async Task<List<ProjectClaim>> GetClaimOfRole([FromQuery] string ApiName, [FromQuery] string IdRole)
        {
            return await this._projectService.getClaimOfRole(ApiName, IdRole);
        }
        [HttpGet("[action]")]
        public async Task<List<ProjectClaim>> GetClaimOfUser([FromQuery] string ApiName, [FromQuery] string Nik)
        {
            return await this._projectService.getClaimOfUser(ApiName, Nik);
        }
        [HttpGet("[action]")]
        public async Task<List<AppRole>> GetRoleOfUser([FromQuery] string ApiName, [FromQuery] string Nik)
        {
            return await this._projectService.getRoleOfUser(ApiName, Nik);
        }
    }
}