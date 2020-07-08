using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using CentralAuth.Datas;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace CentralAuth.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DashboardController : ControllerBase
    {
        private readonly AppDbContext _context;

        public DashboardController(AppDbContext context)
        {
            _context = context;
        }
        [HttpGet("[action]")]
        public List<int> GetDataDashboardAdmin()
        {
            var res = new List<int>();
            var nUser = this._context.Users.Count();
            var nProjek = this._context.Projects.Count();
            var nUnit = this._context.Units.Count();
            var nCabang = this._context.Branches.Count();
            var nDirektorat = this._context.Directorates.Count();
            var nDepartemen = this._context.Departments.Count();
            var nSubDepartemen = this._context.SubDepartments.Count();
            res.Add(nUser);
            res.Add(nProjek);
            res.Add(nUnit);
            res.Add(nCabang);
            res.Add(nDirektorat);
            res.Add(nDepartemen);
            res.Add(nSubDepartemen);
            return res;
        }
        [HttpGet("[action]")]
        public List<int> GetDataDashboardUser([FromQuery]string Nik)
        {
            var res = new List<int>();
            var nProjek = this._context.UserProjects.Where(x=>x.PenggunaNik == Nik).Count();
            res.Add(nProjek);
            return res;
        }
        [HttpGet("[action]")]
        public List<int> GetDataDashboardDev([FromQuery]string Nik)
        {
            var res = new List<int>();
            var nProjekDev = this._context.Projects.Where(x => x.DeveloperNik == Nik).Count();
            res.Add(nProjekDev);
            return res;
        }
    }
}
