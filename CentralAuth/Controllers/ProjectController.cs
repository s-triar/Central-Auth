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
        public GridResponse<Project> GetByFilterGrid([FromQuery]Grid entity)
        {
            return this._projectService.GetAllByFilterGrid(entity);
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
                    entity.ClientId = (this._utilityService.RandomString(3, true) + DateTime.Now.Ticks + entity.ApiName).ToSha256();
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
                    if (t >= 1)
                    {
                        using (configTrans)
                        {
                            Project project = this._projectService.FindByKey(entity.ApiName);
                            this._projectService.CreateClient(project);
                            t = await this._projectService.SaveConfigContextAsync();
                            if (t >= 1)
                            {
                                this._projectService.CreateApiResource(project);
                                t = await this._projectService.SaveConfigContextAsync();
                                if (t >= 1)
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
                using (trans)
                {
                    //TODO DELETE UserProject
                    this._projectService.DeleteUserProject(entity.ApiName);
                    this._projectService.DeleteProjectCollab(entity.ApiName);
                    this._projectService.DeleteProject(entity.ApiName);
                    t = await this._projectService.SaveAsync();
                    if (t >= 1)
                    {
                        using (configTrans)
                        {
                            this._projectService.DeleteScopeApi(entity.ApiName);
                            this._projectService.DeleteApiResource(entity.ApiName);
                            this._projectService.DeleteClient(entity.ApiName);
                            t = await this._projectService.SaveConfigContextAsync();
                            if (t >= 1)
                            {
                                this._projectService.Commit(trans);
                                this._projectService.Commit(configTrans);
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
            var nRole = this._projectService.GetNumberRole(ApiName);
            var nFollower = this._projectService.GetNumberFollower(ApiName);
            var nFollowing = this._projectService.GetNumberFollowing(ApiName);

            List<int> infos = new List<int> { nUser, nRole, nFollower, nFollowing };

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

    }
}