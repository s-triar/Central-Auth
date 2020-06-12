using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using CentralAuth.Commons.Interfaces;
using CentralAuth.Commons.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace CentralAuth.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SubDepartmentController : ControllerBase
    {
        private readonly ISubDepartmentService _subDepartmentService;

        public SubDepartmentController(ISubDepartmentService subDepartmentService)
        {
            this._subDepartmentService = subDepartmentService;
        }

        [HttpGet("[action]")]
        public IEnumerable<SubDepartment> GetAll()
        {
            return this._subDepartmentService.GetAll();
        }

        [HttpGet("[action]/{id}")]
        public SubDepartment GetById(string Kode)
        {
            return this._subDepartmentService.FindByKey(Kode);
        }
        [HttpGet("[action]/{id}")]
        public SubDepartment GetByIdUser(string Nik)
        {
            return this._subDepartmentService.GetByUser(Nik);
        }
        [HttpPost("[action]")]
        public async Task<IActionResult> Create([FromBody]SubDepartment entity)
        {
            try
            {
                this._subDepartmentService.Add(entity);
                var t = await this._subDepartmentService.SaveAsync();
                var res = new CustomResponse()
                {
                    errors = null,
                    message = "Tambah Sub Departemen Berhasil",
                    title = "Success",
                    ok = true
                };
                if (t == 1) { return Ok(res); }
                res = new CustomResponse()
                {
                    errors = null,
                    message = "Tambah Sub Departemen Gagal",
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
        [HttpPost("[action]")]
        public async Task<IActionResult> Update([FromBody]SubDepartment entity)
        {
            try
            {
                this._subDepartmentService.Update(entity);
                var t = await this._subDepartmentService.SaveAsync();
                var res = new CustomResponse()
                {
                    errors = null,
                    message = "Update Sub Departemen Berhasil",
                    title = "Success",
                    ok = true
                };
                if (t == 1) { return Ok(res); }
                res = new CustomResponse()
                {
                    errors = null,
                    message = "Update Sub Departemen Gagal",
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
        public IEnumerable<SubDepartment> GetByFilter([FromQuery]SubDepartment entity)
        {
            return this._subDepartmentService.GetAllByFilter(entity);
        }
        [HttpGet("[action]")]
        public GridResponse<SubDepartment> GetByFilterGrid([FromQuery]Grid entity)
        {
            return this._subDepartmentService.GetAllByFilterGrid(entity);
        }
        [HttpPost("[action]")]
        public async Task<IActionResult> Delete([FromBody]SubDepartment entity)
        {

            try
            {
                this._subDepartmentService.DeleteByKey(entity.Kode);
                var t = await this._subDepartmentService.SaveAsync();
                var res = new CustomResponse()
                {
                    errors = null,
                    message = "Delete Sub Departemen Berhasil",
                    title = "Success",
                    ok = true
                };
                if (t == 1) { return Ok(res); }
                res = new CustomResponse()
                {
                    errors = null,
                    message = "Delete Sub Departemen Gagal",
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
    }
}