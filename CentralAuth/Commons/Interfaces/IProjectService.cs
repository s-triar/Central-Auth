using CentralAuth.Commons.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore.Storage;
using System;
using System.Collections.Generic;
using System.Data.Common;
using System.Linq;
using System.Threading.Tasks;

namespace CentralAuth.Commons.Interfaces
{
    public interface IProjectService : ISimpleGenericService<Project>
    {
        void DeleteUserProject(string ApiName);
        void DeleteProject(string ApiName);
        void CreateClient(Project entity);
        void DeleteClient(string ApiName);
        void CreateIdentityResourceInit();
        void CreateApiResource(Project entity);
        void DeleteApiResource(string ApiName);
        void AddProjectCollabToApi(string ApiName, string ApiNameCollab);
        void DeleteProjectCollab(string ApiName);
        void ApproveAddingScope(int id);
        void AddScopeApiToClient(int id);
        void DeleteScopeApi(string ApiName);
        IEnumerable<Project> GetByUser(string Nik);
        IEnumerable<Project> GetByDeveloper(string Nik);
        GridResponse<User> GetListUserGrid(object entity, string ApiName);
        IEnumerable<ProjectToProject> GetNotifAddCollabProjects(string Nik);
        IEnumerable<ProjectToProject> GetNotifAddCollabProject(string ApiName);
        IEnumerable<ProjectToProject> GetConnectedWith(string ApiName);
        IEnumerable<ProjectToProject> GetConnectingWith(string ApiName);
        IEnumerable<IdentityRole> GetRoleProject(string ApiName);
        void AddRoleProject(string RoleName, string ApiName);
        void DeleteRoleProject(string RoleName, string ApiName);
        Task<int> SaveConfigContextAsync();
        Task<IDbContextTransaction> BeginTransactionConfigContextAsync();

        void AddUserToProject(string Nik, string ApiName);
        void AddRoleToUserProject(string RoleName, string Nik, string ApiName);
        void AddClaimToUserProject(string ClaimKey, string ClaimValue, string Nik, string ApiName);
        void AddClaimToRoleOfUserProject(string ClaimKey, string ClaimValue, string RoleName, string Nik, string ApiName);
        bool checkAvailabilityApiName(string ApiName);

        int GetNumberUser(string ApiName);
        int GetNumberRole(string ApiName);
        int GetNumberFollower(string ApiName);
        int GetNumberFollowing(string ApiName);
    }
}
