using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using CentralAuth.Commons.Interfaces;
using CentralAuth.Commons.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;

namespace CentralAuth.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DirectorateController : ControllerBase
    {
        private readonly IDirectorateService _directorateService;
        public DirectorateController(IDirectorateService directorateService)
        {
            this._directorateService = directorateService;
        }

        [HttpGet("[action]")]
        public IEnumerable<Directorate> GetAll()
        {
            return this._directorateService.GetAll();
        }

        [HttpGet("[action]/{id}")]
        public Directorate GetById(string Kode)
        {
            return this._directorateService.GetByID(Kode);
        }
        [HttpGet("[action]/{id}")]
        public Directorate GetByIdDepartemen(string Kode)
        {
            return this._directorateService.GetByDepartemen(Kode);
        }
        [HttpGet("[action]/{id}")]
        public Directorate GetByIdUser(string Nik)
        {
            return this._directorateService.GetByUser(Nik);
        }
        [HttpPost("[action]")]
        public async Task<IActionResult> Create([FromBody]Directorate entity)
        {
            try
            {
                var t = await this._directorateService.Create(entity);
                var res = new CustomResponse()
                {
                    errors = null,
                    message = "Tambah Direktorat Berhasil",
                    title = "Success",
                    ok = true
                };
                if (t == 1) { return Ok(res); }
                res = new CustomResponse()
                {
                    errors = null,
                    message = "Tambah Direktorat Gagal",
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
        public async Task<IActionResult> Update([FromBody]Directorate entity)
        {
            try
            {
                var t = await this._directorateService.Update(entity);
                var res = new CustomResponse()
                {
                    errors = null,
                    message = "Update Direktorat Berhasil",
                    title = "Success",
                    ok = true
                };
                if (t == 1) { return Ok(res); }
                res = new CustomResponse()
                {
                    errors = null,
                    message = "Update Direktorat Gagal",
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
        public IEnumerable<Directorate> GetByFilter([FromQuery]Directorate entity)
        {
            return this._directorateService.GetAllByFilter(entity);
        }
        [HttpGet("[action]")]
        public GridResponse<Directorate> GetByFilterGrid([FromQuery]Grid entity)
        {
            return this._directorateService.GetAllByFilterGrid(entity);
        }
        [HttpPost("[action]")]
        public async Task<IActionResult> Delete([FromBody]Directorate entity)
        {

            try
            {
                var t = await this._directorateService.Delete(entity.Kode);
                var res = new CustomResponse()
                {
                    errors = null,
                    message = "Delete Direktorat Berhasil",
                    title = "Success",
                    ok = true
                };
                if (t == 1) { return Ok(res); }
                res = new CustomResponse()
                {
                    errors = null,
                    message = "Delete Direktorat Gagal",
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