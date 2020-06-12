using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using CentralAuth.Datas;
using IdentityServer4.EntityFramework.Entities;
using IdentityServer4.EntityFramework.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace CentralAuth.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProjectController : ControllerBase
    {
        private readonly IConfigurationDbContext _configContext;
        private readonly AppDbContext _context;

        public ProjectController(IConfigurationDbContext configContext, AppDbContext context)
        {
            _configContext = configContext;
            _context = context;
        }

        public IActionResult AddApi()
        {
            var t = new Client
            {
                ClientId = "fafwaf"
            };
            this._configContext.Clients.Add(t);
            return Ok();
        }
    }
}