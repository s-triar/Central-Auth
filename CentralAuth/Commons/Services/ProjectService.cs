using CentralAuth.Commons.Filters;
using CentralAuth.Commons.Generics;
using CentralAuth.Commons.Interfaces;
using CentralAuth.Commons.Models;
using CentralAuth.Datas;
using IdentityModel;
using IdentityServer4.EntityFramework.Entities;
using IdentityServer4.EntityFramework.Mappers;
using IdentityServer4.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Net.Sockets;
using System.Reflection;
using System.Security.Claims;
using System.Threading.Tasks;
using ApiResource = IdentityServer4.Models.ApiResource;
using ApiResourceEF = IdentityServer4.EntityFramework.Entities.ApiResource;
using Client = IdentityServer4.Models.Client;
using ClientEF = IdentityServer4.EntityFramework.Entities.Client;
using Secret = IdentityServer4.Models.Secret;
using SecretEF = IdentityServer4.EntityFramework.Entities.Secret;
using IdentityResource = IdentityServer4.Models.IdentityResource;
using IdentityResourceEF = IdentityServer4.EntityFramework.Entities.IdentityResource;
using IdentityServer4;
using Microsoft.EntityFrameworkCore.Storage;
using Microsoft.AspNetCore.Identity;
using IdentityServer4.EntityFramework.DbContexts;
using System.Data.Common;

namespace CentralAuth.Commons.Services
{
    public class ProjectService : SimpleGenericRepository<Project>, IProjectService
    {
        private readonly ConfigurationDbContext _configContext;
        private readonly RoleManager<AppRole> _roleManager;
        private readonly UserManager<AppUser> _userManager;
        private string separator = ":=";
        public ProjectService(AppDbContext context, 
                              ConfigurationDbContext configContext,
                              RoleManager<AppRole> roleManager,
                              UserManager<AppUser> userManager
            ) : base(context)
        {
            this._configContext = configContext;
            this._roleManager = roleManager;
            this._userManager = userManager;
        }
        override
        public GridResponse<Project> GetAllByFilterGrid(object entity)
        {
            Grid search = entity as Grid;
            var q = _context.Projects.Where(CustomFilter<Project>.FilterGrid(entity));
            if (search.Sort != null && search.Sort.Count > 0)
            {
                foreach (Sort s in search.Sort)
                {
                    PropertyInfo info = CustomFilter<Project>.SortGrid(s);
                    if (s.SortType == "ASC")
                    {
                        q = q.OrderBy(x => info.GetValue(x, null));
                    }
                    else if (s.SortType == "DESC")
                    {
                        q = q.OrderByDescending(x => info.GetValue(x, null));
                    }
                }
            }
            var n = q.Count();
            if (search.Pagination != null)
            {
                q = q.Skip(search.Pagination.NumberDisplay * (search.Pagination.PageNumber - 1)).Take(search.Pagination.NumberDisplay);
            }
            var q_enum = q.Include(x => x.Developer).Select(x => new Project
            {
                ApiName = x.ApiName,
                DeveloperNik = x.DeveloperNik,
                NamaProject = x.NamaProject,
                Type = x.Type,
                Url = x.Url,
                Developer= new User
                {
                    Nama = x.Developer.Nama,
                    DepartemenKode = x.Developer.DepartemenKode,
                    Ext = x.Developer.Ext,
                    Email = x.Developer.Email,
                    Nik = x.Developer.Nik,
                    AtasanNik = x.Developer.AtasanNik,
                    DirektoratKode = x.Developer.DirektoratKode,
                    CabangKode = x.Developer.CabangKode,
                    SubDepartemenKode = x.Developer.SubDepartemenKode
                },
            }).AsEnumerable();
            return new GridResponse<Project>
            {
                Data = q_enum,
                NumberData = n
            };
        }

        public void CreateClient(Project entity)
        {
            Client client = new Client
            {
                AccessTokenLifetime = 43200,
                AllowedGrantTypes = GrantTypes.ResourceOwnerPasswordAndClientCredentials,
                AllowedScopes =
                {
                    entity.ApiName,
                    IdentityServerConstants.StandardScopes.OpenId,
                    IdentityServerConstants.StandardScopes.Profile,
                    IdentityServerConstants.StandardScopes.Email,
                    IdentityServerConstants.StandardScopes.OfflineAccess
                },
                AllowOfflineAccess = true,
                AlwaysIncludeUserClaimsInIdToken = true,
                AlwaysSendClientClaims = true,
                Claims =
                {

                },
                ClientId = entity.ClientId,
                ClientName = entity.ApiName,
                ClientUri = entity.Url,
                ClientSecrets = this._GenerateSecret(entity.ClientSecret),
                IdentityTokenLifetime = 43200,
                IncludeJwtId = true,
                RefreshTokenExpiration = TokenExpiration.Absolute,
                RefreshTokenUsage = TokenUsage.OneTimeOnly,
                RequireConsent = false,
                UpdateAccessTokenClaimsOnRefresh = true
            };
            this._configContext.Clients.Add(client.ToEntity());
        }

        public void CreateIdentityResourceInit()
        {
            List<IdentityResource> ids = new List<IdentityResource>
            {
                new IdentityResources.OpenId(),
                new IdentityResources.Profile(),
                new IdentityResources.Email(),
            };
            ids.ForEach(
                x => this._configContext.IdentityResources.Add(x.ToEntity())
            );
        }

        public void CreateApiResource(Project entity)
        {
            ApiResource api = new ApiResource
            {
               Name = entity.ApiName,
               DisplayName = entity.NamaProject,
               Scopes = {
                    new Scope{
                        Name = entity.ApiName+"."+entity.ApiName,
                        DisplayName = "Main Scope for API "+entity.ApiName,
                        Description = "This Scope holds all functionality (all scopes of this API Resource)"
                    } 
               }
            };
            this._configContext.ApiResources.Add(api.ToEntity());
        }

        public void CreateIdentityResource(Project entity)
        {
            IdentityResource api = new IdentityResource
            {
                Name = entity.ApiName,
                DisplayName = entity.NamaProject,
                Description = "Identity Resource for user to access this API"
            };
            this._configContext.IdentityResources.Add(api.ToEntity());
        }

        private List<Secret> _GenerateSecret (string secret)
        {
            Secret clientSecret = new Secret
            {
                Value = secret.ToSha256(),
                Type = IdentityServerConstants.SecretTypes.SharedSecret,
            };
            List<Secret> secrets = new List<Secret> { clientSecret };
            return secrets;
        }

        public void FollowProject(string ApiName, string ApiNameCollab)
        {
            var d = new ProjectToProject
            {
                Approve = null,
                CreatedAt = DateTime.Now,
                CreatedBy = "",
                ProjekApiName = ApiName,
                KolaborasiApiName = ApiNameCollab
            };
            this._context.ProjectToProjects.Add(d);
        }

        public void ApprovalFollower(int id, bool decision)
        {
            var d = this._context.ProjectToProjects.FirstOrDefault(x => x.Id == id);
            d.Approve = decision;
            d.UpdatedAt = DateTime.Now;
            d.UpdatedBy = "";
            this._context.Update(d);
        }
        public void AddScopeApiToClient(int id)
        {
            var d = this._context.ProjectToProjects
                                 .Include(x => x.Kolaborasi)
                                 .Include(x => x.Projek)
                                 .FirstOrDefault(x => x.Id == id);
            var c = this._configContext.Clients
                                       .Where(x=> x.ClientId == d.Projek.ClientId)
                                       .Where(x => x.ClientName == d.Projek.ApiName)
                                       .Where(x => x.ClientUri == d.Projek.Url)
                                       .Include(x=>x.AllowedScopes)
                                       .FirstOrDefault();
            ClientScope csIR = new ClientScope
            {
                ClientId = c.Id,
                Scope = d.KolaborasiApiName
            };
            ClientScope csAR = new ClientScope
            {
                ClientId = c.Id,
                Scope = d.KolaborasiApiName+"."+d.KolaborasiApiName
            };
            c.AllowedScopes.Add(csIR);
            c.AllowedScopes.Add(csAR);
            this._configContext.Clients.Update(c);
        }

        public IEnumerable<Project> GetByUser(string Nik)
        {
            var api_names = this._context.UserProjects
                                  .Where(x => x.PenggunaNik == Nik)
                                  .Select(x => x.ProjekApiName)
                                  .ToList();
            return this._context.Projects
                                .Where(x => api_names.Contains(x.ApiName))
                                .Select(x => new Project
                                {
                                    ApiName = x.ApiName,
                                    NamaProject = x.NamaProject,
                                    Url = x.Url,
                                    Type = x.Type,
                                    DeveloperNik = x.DeveloperNik,
                                })
                                .AsEnumerable();
        }

        public IEnumerable<Project> GetByDeveloper(string Nik)
        {
            return this._context.Projects
                                .Where(x => x.DeveloperNik == Nik)
                                .AsEnumerable();
        }

        public GridResponse<User> GetListUserGrid(object entity, string ApiName)
        {
            var p = this._context.Projects.Include(x=>x.Users).FirstOrDefault(x => x.ApiName == ApiName);
            var userp = p.Users.Select(x => x.PenggunaNik).ToList();

            Grid search = entity as Grid;
            var q = _context.Users
                            .Where(x => userp.Contains(x.Nik))
                            .Where(CustomFilter<User>.FilterGrid(entity));
            if (search.Sort != null && search.Sort.Count > 0)
            {
                foreach (Sort s in search.Sort)
                {
                    PropertyInfo info = CustomFilter<User>.SortGrid(s);
                    if (s.SortType == "ASC")
                    {
                        q = q.OrderBy(x => info.GetValue(x, null));
                    }
                    else if (s.SortType == "DESC")
                    {
                        q = q.OrderByDescending(x => info.GetValue(x, null));
                    }
                }
            }
            var n = q.Count();
            if (search.Pagination != null)
            {
                q = q.Skip(search.Pagination.NumberDisplay * (search.Pagination.PageNumber - 1)).Take(search.Pagination.NumberDisplay);
            }
            var q_enum =   q.Include(x => x.Departemen)
                            .Include(x => x.SubDepartemen)
                            .Include(x => x.Cabang)
                            .Include(x => x.Unit)
                            .Include(x => x.Direktorat)
                            .Include(x => x.Atasan)
                            .Select(x => new User
                            {
                                Nik = x.Nik,
                                Email = x.Email,
                                Ext = x.Ext,
                                Nama = x.Nama,
                                AtasanNik = x.AtasanNik,
                                Atasan = new User
                                {
                                    AtasanNik = x.Atasan.AtasanNik,
                                    Email = x.Atasan.Email,
                                    Ext = x.Atasan.Ext,
                                    Nama = x.Atasan.Nama,
                                    Nik = x.Atasan.Nik
                                },
                                DepartemenKode = x.DepartemenKode,
                                Departemen = new Department
                                {
                                    DirektoratKode = x.Departemen.DirektoratKode,
                                    Kode = x.Departemen.Kode,
                                    NamaDepartemen = x.Departemen.NamaDepartemen
                                },
                                SubDepartemenKode = x.SubDepartemenKode,
                                SubDepartemen = new SubDepartment
                                {
                                    Kode = x.SubDepartemen.Kode,
                                    NamaSubDepartemen = x.SubDepartemen.NamaSubDepartemen,
                                    DepartemenKode = x.SubDepartemen.DepartemenKode
                                },
                                DirektoratKode = x.DirektoratKode,
                                Direktorat = new Directorate
                                {
                                    Kode = x.Direktorat.Kode,
                                    NamaDirektorat = x.Direktorat.NamaDirektorat
                                },
                                CabangKode = x.CabangKode,
                                Cabang = new Branch
                                {
                                    Kode = x.Cabang.Kode,
                                    Alamat = x.Cabang.Alamat,
                                    NamaCabang = x.Cabang.NamaCabang,
                                    Singkatan = x.Cabang.Singkatan,
                                    Keterangan = x.Cabang.Keterangan
                                },
                                UnitKode = x.UnitKode,
                                Unit = new Unit
                                {
                                    Kode = x.Unit.Kode,
                                    NamaUnit = x.Unit.NamaUnit,
                                    Keterangan = x.Unit.Keterangan
                                }

                            }).AsEnumerable();
            return new GridResponse<User>
            {
                Data = q_enum,
                NumberData = n
            };
        }

        public IEnumerable<ProjectToProject> GetNotifAddCollabProjects(string Nik)
        {
            var ps = this._context.Projects
                         .Where(x => x.DeveloperNik == Nik)
                         .Select(x => x.ApiName)
                         .ToList();
            return this._context.ProjectToProjects
                        .Where(x => ps.Contains(x.KolaborasiApiName))
                        .Where(x => x.Approve == false)
                        .AsEnumerable();
        }
        public IEnumerable<ProjectToProject> GetNotifAddCollabProject(string ApiName)
        {
            return this._context.ProjectToProjects
                        .Where(x => x.KolaborasiApiName == ApiName)
                        .Where(x => x.Approve == false)
                        .AsEnumerable();
        }

        public IEnumerable<ProjectToProject> GetConnectedWith(string ApiName)
        {
            return this._context.ProjectToProjects
                        .Where(x => x.KolaborasiApiName == ApiName)
                        .Select(x => new ProjectToProject
                        {
                            Id = x.Id,
                            Projek = new Project
                            {
                                ApiName = x.Projek.ApiName,
                                Url = x.Projek.Url,
                                Type = x.Projek.Type,
                                NamaProject = x.Projek.NamaProject,
                                DeveloperNik = x.Projek.DeveloperNik,
                            },
                            Approve = x.Approve,
                            CreatedAt = x.CreatedAt,
                            UpdatedAt = x.UpdatedAt,
                            KolaborasiApiName = x.KolaborasiApiName,
                            ProjekApiName = x.ProjekApiName
                        })
                        .AsEnumerable();
        }
        public IEnumerable<ProjectToProject> GetConnectingWith(string ApiName)
        {
            return this._context.ProjectToProjects
                        .Where(x => x.ProjekApiName == ApiName)
                        .Select(x => new ProjectToProject
                        {
                            Id = x.Id,
                            Projek = this._context.Projects.Where(y => y.ApiName == x.KolaborasiApiName)
                                         .Select(y => new Project
                                         {
                                             ApiName = y.ApiName,
                                             Url = y.Url,
                                             Type = y.Type,
                                             NamaProject = y.NamaProject,
                                             DeveloperNik = y.DeveloperNik,
                                         })
                                         .FirstOrDefault(),
                            Approve = x.Approve,
                            CreatedAt = x.CreatedAt,
                            UpdatedAt = x.UpdatedAt,
                            KolaborasiApiName = x.KolaborasiApiName,
                            ProjekApiName = x.ProjekApiName
                        })
                        .AsEnumerable();
        }

        public void AddUserToProject(string Nik, string ApiName)
        {
            var p = this._context.Projects.Include(x=>x.Users).FirstOrDefault(x => x.ApiName == ApiName);
            p.Users.Add(new UserProject
            {
                PenggunaNik = Nik,
                ProjekApiName = ApiName,
                CreatedAt = DateTime.Now,
                CreatedBy = "",
            });
            this._context.Projects.Update(p);
        }

        public async Task<bool> RemoveUserFromProject(string Nik, string ApiName)
        {
            var p = this._context.Projects.Include(x=>x.Users).FirstOrDefault(x => x.ApiName == ApiName);
            var u = p.Users.FirstOrDefault(x => x.PenggunaNik == Nik);
            if (u != null)
            {
                var usr = await this._userManager.FindByNameAsync(u.PenggunaNik);
                var rs = await this._userManager.GetRolesAsync(usr);
                rs = rs.Where(x => x.Contains(ApiName)).ToList();
                var t = await this._userManager.RemoveFromRolesAsync(usr, rs);
                var cl = await this._userManager.GetClaimsAsync(usr);
                cl = cl.Where(x => x.Value.Contains(ApiName)).ToList();
                t = await this._userManager.RemoveClaimsAsync(usr, cl);
                p.Users.Remove(u);
            }
            this._context.Projects.Update(p);
            return true;
        }

        public async Task<int> SaveConfigContextAsync()
        {
            return await _configContext.SaveChangesAsync();
        }

        public async Task<IDbContextTransaction> BeginTransactionConfigContextAsync()
        {
            return await _configContext.Database.BeginTransactionAsync();
        }

        public IEnumerable<AppRole> GetRoleProject(string ApiName)
        {
            return this._context.Roles.Where(x=>x.Id.Contains(ApiName)).AsEnumerable();
        }

        public void AddRoleProject(string RoleName, string ApiName)
        {
            AppRole t = new AppRole
            {
                Id = Guid.NewGuid().ToString(),
                Name = ApiName + this.separator + RoleName,
                NormalizedName = ApiName.ToUpper() + this.separator + RoleName.ToUpper(),
                ProjectApiName = ApiName,
                ConcurrencyStamp = Guid.NewGuid().ToString()
            };
            this._context.Roles.Add(t);
        }

        public void DeleteRoleProject(string id)
        {
            var r = this._context.Roles.FirstOrDefault(x=>x.Id==id);
            if (r != null)
            {
                this._context.Roles.Remove(r);
            }
        }

        public void DeleteAllRolesProject(string ApiName)
        {
            var r = this._context.Roles.Where(x=>x.ProjectApiName == ApiName).AsEnumerable();
            if (r != null)
            {
                this._context.Roles.RemoveRange(r);
            }
        }

        public bool checkAvailabilityApiName (string ApiName)
        {
            var res =  this.FindByKey(ApiName);
            if (res != null)
            {
                return false;
            }
            return true;
        }
        public async Task<bool> checkAvailabilityRoleName (string RoleName)
        {
            return !(await this._roleManager.RoleExistsAsync(RoleName));
        }
        public bool checkAvailabilityClaimName(string ClaimName)
        {
            var res = this._context.ProjectClaims.FirstOrDefault(x => x.ClaimName == ClaimName);
            if (res != null)
            {
                return false;
            }
            return true;
        }
        
        public async Task<bool> AddRoleToUserProject(string IdRole, string Nik)
        {
            var r = await this._roleManager.FindByIdAsync(IdRole);
            var u = await this._userManager.FindByNameAsync(Nik);
            var res = await this._userManager.AddToRoleAsync(u, r.Name);
            return res.Succeeded;
        }
        public async Task<bool> RemoveRoleFromUserProject(string IdRole, string Nik)
        {
            var r = await this._roleManager.FindByIdAsync(IdRole);
            var u = await this._userManager.FindByNameAsync(Nik);
            var res = await this._userManager.RemoveFromRoleAsync(u, r.Name);
            return res.Succeeded;
        }

        public async Task<bool> AddClaimToUserProject(string IdClaim, string Nik)
        {
            var c = await this._context.ProjectClaims.FirstOrDefaultAsync(x => x.Id == IdClaim);
            var cl = new Claim(ClaimTypes.Role, c.ClaimName);
            var u = await this._userManager.FindByNameAsync(Nik);
            var res = await this._userManager.AddClaimAsync(u, cl);
            return res.Succeeded;
        }
        public async Task<bool> RemoveClaimFromUserProject(string IdClaim, string Nik)
        {
            var c = await this._context.ProjectClaims.FirstOrDefaultAsync(x => x.Id == IdClaim);
            var cl = new Claim(ClaimTypes.Role, c.ClaimName);
            var u = await this._userManager.FindByNameAsync(Nik);
            var res = await this._userManager.RemoveClaimAsync(u, cl);
            return res.Succeeded;
        }
        public void DeleteClient(string ApiName)
        {
            var c = this._configContext.Clients.FirstOrDefault(x => x.ClientName == ApiName);
            this._configContext.Clients.Remove(c);
        }

        public void DeleteApiResource(string ApiName)
        {
            var apiresources = this._configContext.ApiResources.Where(x => x.Name == ApiName).AsEnumerable();
            this._configContext.ApiResources.RemoveRange(apiresources);
        }
        public void DeleteIdentityResource(string ApiName)
        {
            var identityresource = this._configContext.IdentityResources.Where(x => x.Name == ApiName).AsEnumerable();
            this._configContext.IdentityResources.RemoveRange(identityresource);
        }

        public void DeleteUserProject(string ApiName)
        {
            var users = this._context.UserProjects.Where(x => x.ProjekApiName == ApiName).AsEnumerable();
            this._context.UserProjects.RemoveRange(users);
        }
        public void DeleteUserProject(string ApiName, string Nik)
        {
            var user = this._context.UserProjects.FirstOrDefault(x => x.ProjekApiName == ApiName && x.PenggunaNik ==Nik);
            this._context.UserProjects.Remove(user);
        }
        public void DeleteProjectCollab(string ApiName)
        {
            var connections = this._context.ProjectToProjects
                                        .Where(x =>
                                               x.ProjekApiName == ApiName ||
                                               x.KolaborasiApiName == ApiName)
                                        .AsEnumerable();
            this._context.ProjectToProjects.RemoveRange(connections);
        }
        public void DeleteFollowingProject(string ApiName, string ApiNameFollowing)
        {
            var connections = this._context.ProjectToProjects
                                        .Where(x =>
                                               x.ProjekApiName == ApiName &&
                                               x.KolaborasiApiName == ApiNameFollowing)
                                        .AsEnumerable();
            this._context.ProjectToProjects.RemoveRange(connections);
        }

        public void DeleteScopeApi(string ApiName)
        {
            var clients = this._configContext
                                   .Clients
                                   .Include(x=>x.AllowedScopes)
                                   .Where(x => x.AllowedScopes.Where(y => y.Scope == ApiName).Count() > 0)
                                   .ToList();
            if (clients.Count() > 0)
            {
                foreach (var c in clients)
                {
                    if (c.AllowedScopes!=null) { 
                        var cs = c.AllowedScopes.FirstOrDefault(y => y.Scope == ApiName);
                        c.AllowedScopes.Remove(cs);
                    }
                }
                this._configContext.Clients.UpdateRange(clients);
            }
            
        }
        public void DeleteFollowingScopeApi(string ApiName, string ApiNameCollab)
        {
            var client = this._configContext
                                   .Clients
                                   .Where(x=>x.ClientName == ApiName)
                                   .Include(x => x.AllowedScopes)
                                   .FirstOrDefault();
            if (client!=null)
            {
                if (client.AllowedScopes != null)
                {
                    var cs = client.AllowedScopes.FirstOrDefault(y => y.Scope == ApiNameCollab);
                    client.AllowedScopes.Remove(cs);
                }
                this._configContext.Clients.Update(client);
            }

        }
        public void DeleteProject(string ApiName)
        {
            var p = this._context.Projects.FirstOrDefault(x => x.ApiName == ApiName);
            this._context.Projects.Remove(p);
        }

        public int GetNumberUser(string ApiName)
        {
            return this._context.UserProjects.Where(x => x.ProjekApiName == ApiName).Count();
        }
        public int GetNumberRole(string ApiName)
        {
            return this._context.Roles.Where(x => x.Name.Contains(ApiName)).Count();
        }
        public int GetNumberClaim(string ApiName)
        {
            return this._context.ProjectClaims.Where(x => x.ProjekApiName==ApiName).Count();
        }
        public int GetNumberFollower(string ApiName)
        {
            return this._context.ProjectToProjects.Where(x => x.KolaborasiApiName == ApiName).Count();
        }
        public int GetNumberFollowing(string ApiName)
        {
            return this._context.ProjectToProjects.Where(x => x.ProjekApiName == ApiName).Count();
        }
        public GridResponse<ProjectToProject> GetFollowingFilterGrid(object entity, string ApiName)
        {
            Grid search = entity as Grid;
            var q = _context.ProjectToProjects
                            .Where(x=>x.ProjekApiName == ApiName)
                            .Where(CustomFilter<ProjectToProject>.FilterGrid(entity));
            if (search.Sort != null && search.Sort.Count > 0)
            {
                foreach (Sort s in search.Sort)
                {
                    PropertyInfo info = CustomFilter<ProjectToProject>.SortGrid(s);
                    if (s.SortType == "ASC")
                    {
                        q = q.OrderBy(x => info.GetValue(x, null));
                    }
                    else if (s.SortType == "DESC")
                    {
                        q = q.OrderByDescending(x => info.GetValue(x, null));
                    }
                }
            }
            var n = q.Count();
            if (search.Pagination != null)
            {
                q = q.Skip(search.Pagination.NumberDisplay * (search.Pagination.PageNumber - 1)).Take(search.Pagination.NumberDisplay);
            }
            var q_enum = q.Include(x => x.Kolaborasi).Select(x => new ProjectToProject
            {
                Id = x.Id,
                KolaborasiApiName = x.KolaborasiApiName,
                ProjekApiName = x.ProjekApiName,
                Kolaborasi = new Project
                {
                    ApiName = x.Kolaborasi.ApiName,
                    NamaProject = x.Kolaborasi.NamaProject,
                    Type = x.Kolaborasi.Type,
                    DeveloperNik = x.Kolaborasi.DeveloperNik,
                    Url = x.Kolaborasi.Url,
                    Developer = new User
                    {    
                        Nama = x.Kolaborasi.Developer.Nama,
                        DepartemenKode = x.Kolaborasi.Developer.DepartemenKode,
                        Ext = x.Kolaborasi.Developer.Ext,
                        Email = x.Kolaborasi.Developer.Email,
                        Nik = x.Kolaborasi.Developer.Nik,
                        AtasanNik = x.Kolaborasi.Developer.AtasanNik,
                        DirektoratKode = x.Kolaborasi.Developer.DirektoratKode,
                        CabangKode = x.Kolaborasi.Developer.CabangKode,
                        SubDepartemenKode = x.Kolaborasi.Developer.SubDepartemenKode
                    }
                },
                Approve = x.Approve
            }).AsEnumerable();
            return new GridResponse<ProjectToProject>
            {
                Data = q_enum,
                NumberData = n
            };
        }
        public GridResponse<ProjectToProject> GetFollowerFilterGrid(object entity, string ApiName)
        {
            Grid search = entity as Grid;
            var q = _context.ProjectToProjects
                            .Where(x=>x.KolaborasiApiName == ApiName)
                            .Where(CustomFilter<ProjectToProject>.FilterGrid(entity));
            if (search.Sort != null && search.Sort.Count > 0)
            {
                foreach (Sort s in search.Sort)
                {
                    PropertyInfo info = CustomFilter<ProjectToProject>.SortGrid(s);
                    if (s.SortType == "ASC")
                    {
                        q = q.OrderBy(x => info.GetValue(x, null));
                    }
                    else if (s.SortType == "DESC")
                    {
                        q = q.OrderByDescending(x => info.GetValue(x, null));
                    }
                }
            }
            var n = q.Count();
            if (search.Pagination != null)
            {
                q = q.Skip(search.Pagination.NumberDisplay * (search.Pagination.PageNumber - 1)).Take(search.Pagination.NumberDisplay);
            }
            var q_enum = q.Include(x => x.Projek).Select(x => new ProjectToProject
            {
                Id = x.Id,
                KolaborasiApiName = x.KolaborasiApiName,
                ProjekApiName = x.ProjekApiName,
                Projek = new Project
                {
                    ApiName = x.Projek.ApiName,
                    NamaProject = x.Projek.NamaProject,
                    Type = x.Projek.Type,
                    DeveloperNik = x.Projek.DeveloperNik,
                    Url = x.Projek.Url,
                    Developer = new User
                    {
                        Nama = x.Projek.Developer.Nama,
                        DepartemenKode = x.Projek.Developer.DepartemenKode,
                        Ext = x.Projek.Developer.Ext,
                        Email = x.Projek.Developer.Email,
                        Nik = x.Projek.Developer.Nik,
                        AtasanNik = x.Projek.Developer.AtasanNik,
                        DirektoratKode = x.Projek.Developer.DirektoratKode,
                        CabangKode = x.Projek.Developer.CabangKode,
                        SubDepartemenKode = x.Projek.Developer.SubDepartemenKode
                    }
                },
                Approve = x.Approve
            }).AsEnumerable();
            return new GridResponse<ProjectToProject>
            {
                Data = q_enum,
                NumberData = n
            };
        }

        public GridResponse<Project> checkAvailabilityFollowing(object entity,string ApiName)
        {
            Grid search = entity as Grid;
            var collabs = _context.ProjectToProjects.Where(x => x.ProjekApiName == ApiName).Select(x => x.KolaborasiApiName).ToList();
            var q = _context.Projects
                            .Where(x => x.ApiName!=ApiName)
                            .Where(x => !collabs.Contains(ApiName))
                            .Where(CustomFilter<Project>.FilterGrid(entity));
            if (search.Sort != null && search.Sort.Count > 0)
            {
                foreach (Sort s in search.Sort)
                {
                    PropertyInfo info = CustomFilter<Project>.SortGrid(s);
                    if (s.SortType == "ASC")
                    {
                        q = q.OrderBy(x => info.GetValue(x, null));
                    }
                    else if (s.SortType == "DESC")
                    {
                        q = q.OrderByDescending(x => info.GetValue(x, null));
                    }
                }
            }
            var n = q.Count();
            if (search.Pagination != null)
            {
                q = q.Skip(search.Pagination.NumberDisplay * (search.Pagination.PageNumber - 1)).Take(search.Pagination.NumberDisplay);
            }
            var q_enum = q.Select(x => new Project
            {
                
                ApiName = x.ApiName,
                NamaProject = x.NamaProject,
                Type = x.Type,
                DeveloperNik = x.DeveloperNik,
                Url = x.Url,
            }).AsEnumerable();
            return new GridResponse<Project>
            {
                Data = q_enum,
                NumberData = n
            };
        }
        public void CreateClaimProject(string ApiName, string ClaimName)
        {
            ProjectClaim n = new ProjectClaim
            {
                ClaimName = ApiName + this.separator + ClaimName,
                CreatedAt = DateTime.Now,
                Id = Guid.NewGuid().ToString(),
                ProjekApiName = ApiName
            };
            this._context.ProjectClaims.Add(n);
        }
        public void UpdateClaimProject(string id, string claimName)
        {
            var t = this._context.ProjectClaims.FirstOrDefault(x => x.Id == id);
            
            var rc = this._context.RoleClaims.Where(x => x.ClaimValue == t.ClaimName).ToList();
            var uc = this._context.UserClaims.Where(x => x.ClaimValue == t.ClaimName).ToList();
            t.ClaimName = t.ProjekApiName + this.separator + claimName;
            t.UpdatedAt = DateTime.Now;
            rc.ForEach(x => x.ClaimValue = t.ClaimName);
            uc.ForEach(x => x.ClaimValue = t.ClaimName);
            this._context.RoleClaims.UpdateRange(rc);
            this._context.UserClaims.UpdateRange(uc);
            this._context.ProjectClaims.Update(t);
        }
        public void DeleteClaimProject(string id)
        {
            var t = this._context.ProjectClaims.FirstOrDefault(x => x.Id == id);
            var rc = this._context.RoleClaims.Where(x => x.ClaimValue == t.ClaimName).AsEnumerable();
            this._context.RoleClaims.RemoveRange(rc);
            var uc = this._context.UserClaims.Where(x => x.ClaimValue == t.ClaimName).AsEnumerable();
            this._context.UserClaims.RemoveRange(uc);
            this._context.ProjectClaims.Remove(t);
        }
        public GridResponse<ProjectClaim> GetProjectClaimGrid(object entity, string ApiName)
        {

            Grid search = entity as Grid;
            var q = _context.ProjectClaims
                            .Where(x => x.ProjekApiName == ApiName)
                            .Where(CustomFilter<ProjectClaim>.FilterGrid(entity));
            if (search.Sort != null && search.Sort.Count > 0)
            {
                foreach (Sort s in search.Sort)
                {
                    PropertyInfo info = CustomFilter<ProjectClaim>.SortGrid(s);
                    if (s.SortType == "ASC")
                    {
                        q = q.OrderBy(x => info.GetValue(x, null));
                    }
                    else if (s.SortType == "DESC")
                    {
                        q = q.OrderByDescending(x => info.GetValue(x, null));
                    }
                }
            }
            var n = q.Count();
            if (search.Pagination != null)
            {
                q = q.Skip(search.Pagination.NumberDisplay * (search.Pagination.PageNumber - 1)).Take(search.Pagination.NumberDisplay);
            }
            var q_enum = q.Select(x => new ProjectClaim
            {
                Id = x.Id,
                ProjekApiName = x.ProjekApiName,
                ClaimName = x.ClaimName,
                CreatedAt = x.CreatedAt,
            }).AsEnumerable();
            return new GridResponse<ProjectClaim>
            {
                Data = q_enum,
                NumberData = n
            };
        }
        public GridResponse<AppRole> GetProjectRoleGrid(object entity, string ApiName)
        {
            Grid search = entity as Grid;
            var q = _context.Roles
                            .Where(x => x.ProjectApiName == ApiName)
                            .Where(CustomFilter<AppRole>.FilterGrid(entity));
            if (search.Sort != null && search.Sort.Count > 0)
            {
                foreach (Sort s in search.Sort)
                {
                    PropertyInfo info = CustomFilter<AppRole>.SortGrid(s);
                    if (s.SortType == "ASC")
                    {
                        q = q.OrderBy(x => info.GetValue(x, null));
                    }
                    else if (s.SortType == "DESC")
                    {
                        q = q.OrderByDescending(x => info.GetValue(x, null));
                    }
                }
            }
            var n = q.Count();
            if (search.Pagination != null)
            {
                q = q.Skip(search.Pagination.NumberDisplay * (search.Pagination.PageNumber - 1)).Take(search.Pagination.NumberDisplay);
            }
            var q_enum = q.Select(x => new AppRole
            {
                Id = x.Id,
                Name = x.Name,
                NormalizedName = x.NormalizedName,
                ProjectApiName = x.ProjectApiName,
            }).AsEnumerable();
            return new GridResponse<AppRole>
            {
                Data = q_enum,
                NumberData = n
            };
        }

        public async Task<bool> CreateRoleProject(string ApiName, string RoleName)
        {
            AppRole n = new AppRole
            {
                Name = ApiName + this.separator + RoleName,
                Id = Guid.NewGuid().ToString(),
                ProjectApiName = ApiName,
                NormalizedName = ApiName.ToUpper() + this.separator + RoleName.ToUpper(),
                ConcurrencyStamp = Guid.NewGuid().ToString()

            };
            var t = await this._roleManager.CreateAsync(n);
            return t.Succeeded;
        }
        public async Task<bool> UpdateRoleProject(string id, string RoleName)
        {
            var r = await this._roleManager.FindByIdAsync(id);
            r.Name = r.ProjectApiName + this.separator + RoleName;
            r.NormalizedName = r.ProjectApiName.ToUpper() + this.separator + RoleName.ToUpper();
            r.ConcurrencyStamp = Guid.NewGuid().ToString();
            var t = await this._roleManager.UpdateAsync(r);
            return t.Succeeded;
        }
        public async Task<bool> RemoveRoleProject(string id)
        {
            var r = await this._roleManager.FindByIdAsync(id);
            var us = await this._userManager.GetUsersInRoleAsync(r.Name);
            foreach(var u in us)
            {
                await this._userManager.RemoveFromRoleAsync(u, r.Name);
            }
            var t = await this._roleManager.DeleteAsync(r);
            return t.Succeeded;
        }
        public async Task<bool> AddClaimToRoleProject(string IdRole, string IdClaim)
        {
            var c = this._context.ProjectClaims.Find(IdClaim);
            var cl = new Claim(ClaimTypes.Role, c.ClaimName);
            var r = await this._roleManager.FindByIdAsync(IdRole);
            var t = await this._roleManager.AddClaimAsync(r, cl);
            return t.Succeeded;
        }
        public async Task<bool> RemoveClaimFromRoleProject(string IdRole, string IdClaim)
        {
            var c = this._context.ProjectClaims.Find(IdClaim);
            var cl = new Claim(ClaimTypes.Role, c.ClaimName);
            var r = await this._roleManager.FindByIdAsync(IdRole);
            var t = await this._roleManager.RemoveClaimAsync(r, cl);
            return t.Succeeded;
        }
        public GridResponse<User> getAvailableUserProject(object entity, string ApiName)
        {
            var p = this._context.Projects.Include(x=>x.Users).FirstOrDefault(x => x.ApiName == ApiName);
            var userp = p.Users.Select(x => x.PenggunaNik).ToList();

            Grid search = entity as Grid;
            var q = _context.Users
                            .Where(x => !userp.Contains(x.Nik))
                            .Where(CustomFilter<User>.FilterGrid(entity));
            if (search.Sort != null && search.Sort.Count > 0)
            {
                foreach (Sort s in search.Sort)
                {
                    PropertyInfo info = CustomFilter<User>.SortGrid(s);
                    if (s.SortType == "ASC")
                    {
                        q = q.OrderBy(x => info.GetValue(x, null));
                    }
                    else if (s.SortType == "DESC")
                    {
                        q = q.OrderByDescending(x => info.GetValue(x, null));
                    }
                }
            }
            var n = q.Count();
            if (search.Pagination != null)
            {
                q = q.Skip(search.Pagination.NumberDisplay * (search.Pagination.PageNumber - 1)).Take(search.Pagination.NumberDisplay);
            }
            var q_enum =   q.Include(x => x.Departemen)
                            .Include(x => x.SubDepartemen)
                            .Include(x => x.Cabang)
                            .Include(x => x.Unit)
                            .Include(x => x.Direktorat)
                            .Include(x => x.Atasan)
                            .Select(x => new User
                            {
                                Nik = x.Nik,
                                Email = x.Email,
                                Ext = x.Ext,
                                Nama = x.Nama,
                                AtasanNik = x.AtasanNik,
                                Atasan = new User
                                {
                                    AtasanNik = x.Atasan.AtasanNik,
                                    Email = x.Atasan.Email,
                                    Ext = x.Atasan.Ext,
                                    Nama = x.Atasan.Nama,
                                    Nik = x.Atasan.Nik
                                },
                                DepartemenKode = x.DepartemenKode,
                                Departemen = new Department
                                {
                                    DirektoratKode = x.Departemen.DirektoratKode,
                                    Kode = x.Departemen.Kode,
                                    NamaDepartemen = x.Departemen.NamaDepartemen
                                },
                                SubDepartemenKode = x.SubDepartemenKode,
                                SubDepartemen = new SubDepartment
                                {
                                    Kode = x.SubDepartemen.Kode,
                                    NamaSubDepartemen = x.SubDepartemen.NamaSubDepartemen,
                                    DepartemenKode = x.SubDepartemen.DepartemenKode
                                },
                                DirektoratKode = x.DirektoratKode,
                                Direktorat = new Directorate
                                {
                                    Kode = x.Direktorat.Kode,
                                    NamaDirektorat = x.Direktorat.NamaDirektorat
                                },
                                CabangKode = x.CabangKode,
                                Cabang = new Branch
                                {
                                    Kode = x.Cabang.Kode,
                                    Alamat = x.Cabang.Alamat,
                                    NamaCabang = x.Cabang.NamaCabang,
                                    Singkatan = x.Cabang.Singkatan,
                                    Keterangan = x.Cabang.Keterangan
                                },
                                UnitKode = x.UnitKode,
                                Unit = new Unit
                                {
                                    Kode = x.Unit.Kode,
                                    NamaUnit = x.Unit.NamaUnit,
                                    Keterangan = x.Unit.Keterangan
                                }

                            }).AsEnumerable();
            return new GridResponse<User>
            {
                Data = q_enum,
                NumberData = n
            };
        }
        public async Task<List<ProjectClaim>> getAvailableClaimForRole(string ApiName, string IdRole, string value)
        {
            var r = await this._roleManager.FindByIdAsync(IdRole);
            var rc = await this._roleManager.GetClaimsAsync(r);
            var rcs = rc.ToList().Select(x => x.Value);
            return this._context.ProjectClaims
                                   .Where(x=>x.ProjekApiName == ApiName)
                                   .Where(x=>x.ClaimName.Contains(value))
                                   .Where(x => !rcs.Contains(x.ClaimName))
                                   .ToList();
        }
        public async Task<List<ProjectClaim>> getAvailableClaimForUser(string ApiName, string Nik, string value)
        {
            var u = await this._userManager.FindByNameAsync(Nik);
            var uc = await this._userManager.GetClaimsAsync(u);
            if (uc == null)
            {
                return this._context.ProjectClaims
                                   .Where(x => x.ProjekApiName == ApiName)
                                   .Where(x => x.ClaimName.Contains(value))
                                   .ToList();
            }
            var ucs = uc.ToList().Select(x => x.Value);
            return this._context.ProjectClaims
                                   .Where(x => x.ProjekApiName == ApiName)
                                   .Where(x => x.ClaimName.Contains(value))
                                   .Where(x => !ucs.Contains(x.ClaimName))
                                   .ToList();
        }
        public async Task<List<AppRole>> getAvailableRoleForUser(string ApiName, string Nik, string value)
        {
            var u = await this._userManager.FindByNameAsync(Nik);
            var urs = await this._userManager.GetRolesAsync(u);
            if (urs == null)
            {
                return this._roleManager.Roles
                                   .Where(x => x.ProjectApiName == ApiName)
                                   .Where(x => x.Name.Contains(value))
                                   .ToList();
            }
            return this._roleManager.Roles
                                   .Where(x => x.ProjectApiName == ApiName)
                                   .Where(x => x.Name.Contains(value))
                                   .Where(x => !urs.Contains(x.Name))
                                   .ToList();
        }

        public async Task<List<ProjectClaim>> getClaimOfRole(string ApiName, string IdRole)
        {
            var r = await this._roleManager.FindByIdAsync(IdRole);
            var rc = await this._roleManager.GetClaimsAsync(r);
            var rcs = rc.ToList().Select(x => x.Value);
            return this._context.ProjectClaims
                                   .Where(x => x.ProjekApiName == ApiName)
                                   .Where(x => rcs.Contains(x.ClaimName))
                                   .ToList();
        }

        public async Task<List<ProjectClaim>> getClaimOfUser(string ApiName, string Nik)
        {
            var u = await this._userManager.FindByNameAsync(Nik);
            var uc = await this._userManager.GetClaimsAsync(u);
            if(uc == null)
            {
                return new List<ProjectClaim>();
            }
            var ucs = uc.ToList().Select(x => x.Value);
            return this._context.ProjectClaims
                                   .Where(x => x.ProjekApiName == ApiName)
                                   .Where(x => ucs.Contains(x.ClaimName))
                                   .ToList();
        }
        public async Task<List<AppRole>> getRoleOfUser(string ApiName, string Nik)
        {
            var u = await this._userManager.FindByNameAsync(Nik);
            var urs = await this._userManager.GetRolesAsync(u);
            if (urs == null)
            {
                return new List<AppRole>();
            }
            return this._roleManager.Roles
                                   .Where(x => x.ProjectApiName == ApiName)
                                   .Where(x => urs.Contains(x.Name))
                                   .ToList();
        }
    }
}
