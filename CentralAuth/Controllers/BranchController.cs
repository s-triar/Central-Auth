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
    public class BranchController : ControllerBase
    {
        private readonly IBranchService _branchService;

        public BranchController(IBranchService branchService)
        {
            this._branchService = branchService;
        }

        [HttpGet("[action]")]
        public IEnumerable<Branch> GetAll()
        {
            return this._branchService.GetAll();
        }

        [HttpGet("[action]/{id}")]
        public Branch GetById(string Kode)
        {
            return this._branchService.FindByKey(Kode);
        }
        [HttpPost("[action]")]
        public async Task<IActionResult> AddBranchUnit([FromBody] BranchUnit entity)
        {
            try
            {
                var t = await this._branchService.AddBranchUnit(entity);
                var res = new CustomResponse()
                {
                    errors = null,
                    message = "Tambah Cabang Berhasil",
                    title = "Success",
                    ok = true
                };
                if (t == 1) { return Ok(res); }
                res = new CustomResponse()
                {
                    errors = null,
                    message = "Tambah Cabang Gagal",
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
        [HttpGet("[action]/{id}")]
        public Branch GetByIdUser(string Nik)
        {
            return this._branchService.GetByUser(Nik);
        }
        [HttpPost("[action]")]
        public async Task<IActionResult> Create([FromBody]Branch entity)
        {
            try
            {
                this._branchService.Add(entity);
                var t = await this._branchService.SaveAsync();
                var res = new CustomResponse()
                {
                    errors = null,
                    message = "Tambah Cabang Berhasil",
                    title = "Success",
                    ok = true
                };
                if (t == 1) { return Ok(res); }
                res = new CustomResponse()
                {
                    errors = null,
                    message = "Tambah Cabang Gagal",
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
        public async Task<IActionResult> Update([FromBody]Branch entity)
        {
            try
            {
                this._branchService.Update(entity);
                var t = await this._branchService.SaveAsync();
                var res = new CustomResponse()
                {
                    errors = null,
                    message = "Update Cabang Berhasil",
                    title = "Success",
                    ok = true
                };
                if (t == 1) { return Ok(res); }
                res = new CustomResponse()
                {
                    errors = null,
                    message = "Update Cabang Gagal",
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
        public IEnumerable<Branch> GetByFilter([FromQuery]Branch entity)
        {
            return this._branchService.GetAllByFilter(entity);
        }
        [HttpGet("[action]")]
        public GridResponse<Branch> GetByFilterGrid([FromQuery]Grid entity)
        {
            return this._branchService.GetAllByFilterGrid(entity);
        }
        [HttpPost("[action]")]
        public async Task<IActionResult> Delete([FromBody]Branch entity)
        {

            try
            {
                this._branchService.DeleteByKey(entity.Kode);
                var t = await this._branchService.SaveAsync();
                var res = new CustomResponse()
                {
                    errors = null,
                    message = "Delete Cabang Berhasil",
                    title = "Success",
                    ok = true
                };
                if (t == 1) { return Ok(res); }
                res = new CustomResponse()
                {
                    errors = null,
                    message = "Delete Cabang Gagal",
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