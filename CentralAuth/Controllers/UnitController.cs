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
    public class UnitController : ControllerBase
    {
        private readonly IUnitService _unitService;

        public UnitController(IUnitService unitService)
        {
            this._unitService = unitService;
        }

        [HttpGet("[action]")]
        public IEnumerable<Unit> GetAll()
        {
            return this._unitService.GetAll();
        }

        [HttpGet("[action]/{id}")]
        public Unit GetById(string Kode)
        {
            return this._unitService.FindByKey(Kode);
        }
        [HttpPost("[action]")]
        public async Task<IActionResult> AddUnitUnit([FromBody] BranchUnit entity)
        {
            try
            {
                var t = await this._unitService.AddBranchUnit(entity);
                var res = new CustomResponse()
                {
                    errors = null,
                    message = "Tambah Unit Berhasil",
                    title = "Success",
                    ok = true
                };
                if (t == 1) { return Ok(res); }
                res = new CustomResponse()
                {
                    errors = null,
                    message = "Tambah Unit Gagal",
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
        public Unit GetByIdUser(string Nik)
        {
            return this._unitService.GetByUser(Nik);
        }
        [HttpPost("[action]")]
        public async Task<IActionResult> Create([FromBody]Unit entity)
        {
            try
            {
                this._unitService.Add(entity);
                var t = await this._unitService.SaveAsync();
                var res = new CustomResponse()
                {
                    errors = null,
                    message = "Tambah Unit Berhasil",
                    title = "Success",
                    ok = true
                };
                if (t == 1) { return Ok(res); }
                res = new CustomResponse()
                {
                    errors = null,
                    message = "Tambah Unit Gagal",
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
        public async Task<IActionResult> Update([FromBody]Unit entity)
        {
            try
            {
                this._unitService.Update(entity);
                var t = await this._unitService.SaveAsync();
                var res = new CustomResponse()
                {
                    errors = null,
                    message = "Update Unit Berhasil",
                    title = "Success",
                    ok = true
                };
                if (t == 1) { return Ok(res); }
                res = new CustomResponse()
                {
                    errors = null,
                    message = "Update Unit Gagal",
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
        public IEnumerable<Unit> GetByFilter([FromQuery]Unit entity)
        {
            return this._unitService.GetAllByFilter(entity);
        }
        [HttpGet("[action]")]
        public GridResponse<Unit> GetByFilterGrid([FromQuery]Grid entity)
        {
            return this._unitService.GetAllByFilterGrid(entity);
        }
        [HttpPost("[action]")]
        public async Task<IActionResult> Delete([FromBody]Unit entity)
        {

            try
            {
                this._unitService.DeleteByKey(entity.Kode);
                var t = await this._unitService.SaveAsync();
                var res = new CustomResponse()
                {
                    errors = null,
                    message = "Delete Unit Berhasil",
                    title = "Success",
                    ok = true
                };
                if (t == 1) { return Ok(res); }
                res = new CustomResponse()
                {
                    errors = null,
                    message = "Delete Unit Gagal",
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