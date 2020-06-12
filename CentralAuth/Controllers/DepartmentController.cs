using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Net;
using System.Net.Http;
using System.Reflection;
using System.Reflection.Metadata.Ecma335;
using System.Threading.Tasks;
using System.Web;
using CentralAuth.Commons.Interfaces;
using CentralAuth.Commons.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity.UI.V3.Pages.Internal.Account;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore.Internal;
using Newtonsoft.Json;

namespace CentralAuth.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DepartmentController : ControllerBase
    {
        private readonly IDepartmentService _departemenService;
        public DepartmentController(IDepartmentService departemenService)
        {
            this._departemenService = departemenService;
        }

        [HttpGet("[action]")]
        public IEnumerable<Department> GetAll()
        {
            return this._departemenService.GetAll();
        }

        [HttpGet("[action]/{id}")]
        public Department GetById(string Kode)
        {
            return this._departemenService.FindByKey(Kode);
        }
        [HttpGet("[action]/{id}")]
        public Department GetByIdSubDepartemen(string Kode)
        {
            return this._departemenService.GetBySubDepartment(Kode);
        }
        [HttpGet("[action]/{id}")]
        public Department GetByIdUser(string Nik)
        {
            return this._departemenService.GetByUser(Nik);
        }
        [HttpPost("[action]")]
        public async Task<IActionResult> Create([FromBody]Department entity)
        {
            try
            {
                this._departemenService.Add(entity);
                var t = await this._departemenService.SaveAsync();
                var res = new CustomResponse()
                {
                    errors = null,
                    message = "Tambah Departemen Berhasil",
                    title = "Success",
                    ok = true
                };
                if (t == 1) { return Ok(res); }
                res = new CustomResponse()
                {
                    errors = null,
                    message = "Tambah Departemen Gagal",
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
        public async Task<IActionResult> Update([FromBody]Department entity)
        {
            try
            {
                this._departemenService.Update(entity);
                var t = await this._departemenService.SaveAsync();
                var res = new CustomResponse()
                {
                    errors = null,
                    message = "Update Departemen Berhasil",
                    title = "Success",
                    ok = true
                };
                if (t == 1) { return Ok(res); }
                res = new CustomResponse()
                {
                    errors = null,
                    message = "Update Departemen Gagal",
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
        public IEnumerable<Department> GetByFilter([FromQuery]Department entity)
        {
            return this._departemenService.GetAllByFilter(entity);
        }
        [HttpGet("[action]")]
        public GridResponse<Department> GetByFilterGrid([FromQuery]Grid entity)
        {
           return this._departemenService.GetAllByFilterGrid(entity);
        }
        [HttpPost("[action]")]
        public async Task<IActionResult> Delete([FromBody]Department entity)
        {

            try
            {
                this._departemenService.DeleteByKey(entity.Kode);
                var t = await this._departemenService.SaveAsync();
                var res = new CustomResponse()
                {
                    errors = null,
                    message = "Delete Departemen Berhasil",
                    title = "Success",
                    ok = true
                };
                if (t == 1) { return Ok(res); }
                res = new CustomResponse()
                {
                    errors = null,
                    message = "Delete Departemen Gagal",
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



        //public string GetQueryString(object obj)
        //{
        //    var properties = from p in obj.GetType().GetProperties()
        //                     where p.GetValue(obj, null) != null
        //                     select p.Name + "=" + HttpUtility.UrlEncode(p.GetValue(obj, null).ToString());

        //    return String.Join("&", properties.ToArray());
        //}

        //public string ObjToQueryString(object obj)
        //{
        //    var step1 = JsonConvert.SerializeObject(obj);

        //    var step2 = JsonConvert.DeserializeObject<IDictionary<string, string>>(step1);

        //    var step3 = step2.Select(x => HttpUtility.UrlEncode(x.Key) + "=" + HttpUtility.UrlEncode(x.Value));

        //    return string.Join("&", step3);
        //}
        //public Func<object, bool> cobaexpression (object obj)
        //{
        //    var parameter = Expression.Parameter(typeof(obj), "a");
        //    var comparison = Expression.GreaterThan(Expression.Property(parameter, typeof(obj).GetProperty("Quantity")), Expression.Constant(100));
        //    Func<object, bool> discountFilterExpression = Expression.Lambda<Func<object, bool>>(comparison, parameter).Compile();

        //    //var discountedAlbums = albums.Where(discountFilterExpression);
        //    return discountFilterExpression;
        //}

        //public void SearchBasedByContain(object obj)
        //{
        //    var properties = obj.GetType().GetProperties();
        //    var parameter = Expression.Parameter(typeof(obj), "a");
        //    MethodInfo method = typeof(string).GetMethod("Contains", new[] { typeof(string) });
        //    Expression<Func<object, bool>> res = null;
        //    foreach (var prop in properties)
        //    {
        //        var value = obj.GetType().GetProperty(prop.Name).GetType();

        //    }

        //}
    }
}