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

        public ProjectService(AppDbContext context, ConfigurationDbContext configContext) : base(context)
        {
            this._configContext = configContext;
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
                Collaborations = x.Collaborations,
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
               AllowedGrantTypes = GrantTypes.CodeAndClientCredentials,
               AllowedScopes = 
               {
                    entity.ApiName,
                    IdentityServerConstants.StandardScopes.OpenId,
                    IdentityServerConstants.StandardScopes.Profile,
                    IdentityServerConstants.StandardScopes.Email,
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
               RedirectUris = {entity.Url+"/signin-oidc"},
               RefreshTokenExpiration = TokenExpiration.Sliding,
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
               DisplayName = entity.NamaProject
            };
            this._configContext.ApiResources.Add(api.ToEntity());
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

        public void AddProjectCollabToApi(string ApiName, string ApiNameCollab)
        {
            var d = new ProjectToProject
            {
                Approve = false,
                CreatedAt = DateTime.Now,
                CreatedBy = "",
                ProjekApiName = ApiName,
                KolaborasiApiName = ApiNameCollab
            };
            this._context.ProjectToProjects.Add(d);
        }

        public void ApproveAddingScope(int id)
        {
            var d = this._context.ProjectToProjects.FirstOrDefault(x => x.Id == id);
            d.Approve = true;
            d.UpdatedAt = DateTime.Now;
            d.UpdatedBy = "";
            this._context.Update(d);
        }
        
        public void AddScopeApiToClient(int id)
        {
            var d = this._context.ProjectToProjects.FirstOrDefault(x => x.Id == id);
            var c = this._configContext.Clients
                                       .Where(x=> x.ClientId == d.Projek.ClientId)
                                       .Where(x => x.ClientName == d.Projek.ApiName)
                                       .Where(x => x.ClientUri == d.Projek.Url)
                                       .FirstOrDefault();
            ClientScope cs = new ClientScope
            {
                ClientId = c.Id,
                Scope = d.KolaborasiApiName
            };
            c.AllowedScopes.Add(cs);
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
            var p = this._context.Projects.FirstOrDefault(x => x.ApiName == ApiName);
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
            var q_enum = q.Select(x => new User
            {
                Nama = x.Nama,
                Ext = x.Ext,
                Email = x.Email,
                Nik = x.Nik,
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
            var p = this._context.Projects.FirstOrDefault(x => x.ApiName == ApiName);
            p.Users.Add(new UserProject
            {
                PenggunaNik = Nik,
                ProjekApiName = ApiName,
                CreatedAt = DateTime.Now,
                CreatedBy = "",
            });
            this._context.Projects.Update(p);
        }

        public async Task<int> SaveConfigContextAsync()
        {
            return await _configContext.SaveChangesAsync();
        }

        public async Task<IDbContextTransaction> BeginTransactionConfigContextAsync()
        {
            return await _configContext.Database.BeginTransactionAsync();
        }

        public IEnumerable<IdentityRole> GetRoleProject(string ApiName)
        {
            return this._context.Roles.Where(x=>x.Id.Contains(ApiName)).AsEnumerable();
        }

        public void AddRoleProject(string RoleName, string ApiName)
        {
            IdentityRole t = new IdentityRole
            {
                Id = ApiName+":"+RoleName,
                Name = ApiName + ":" + RoleName,
                NormalizedName = ApiName.ToUpper() + ":" + RoleName.ToUpper()
            };
            this._context.Roles.Add(t);
        }

        public void DeleteRoleProject(string RoleName, string ApiName)
        {
            var r = this._context.Roles.Find(ApiName + ":" + RoleName);
            this._context.Roles.Remove(r);
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
        public void AddRoleToUserProject(string RoleName, string Nik, string ApiName)
        {
            throw new NotImplementedException();
        }

        public void AddClaimToUserProject(string ClaimKey, string ClaimValue, string Nik, string ApiName)
        {
            throw new NotImplementedException();
        }

        public void AddClaimToRoleOfUserProject(string ClaimKey, string ClaimValue, string RoleName, string Nik, string ApiName)
        {
            throw new NotImplementedException();
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

        public void DeleteUserProject(string ApiName)
        {
            var users = this._context.UserProjects.Where(x => x.ProjekApiName == ApiName).AsEnumerable();
            this._context.UserProjects.RemoveRange(users);
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
        public int GetNumberFollower(string ApiName)
        {
            return this._context.ProjectToProjects.Where(x => x.KolaborasiApiName == ApiName).Count();
        }
        public int GetNumberFollowing(string ApiName)
        {
            return this._context.ProjectToProjects.Where(x => x.ProjekApiName == ApiName).Count();
        }
    }
}
