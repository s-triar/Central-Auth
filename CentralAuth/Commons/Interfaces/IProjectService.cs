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
        void FollowProject(string ApiName, string ApiNameCollab);
        void DeleteProjectCollab(string ApiName);
        void DeleteFollowingProject(string ApiName, string ApiNameFollowing);
        void ApprovalFollower(int id, bool decision);
        void AddScopeApiToClient(int id);
        void DeleteScopeApi(string ApiName);
        void DeleteFollowingScopeApi(string ApiName, string ApiNameCollab);
        IEnumerable<Project> GetByUser(string Nik);
        IEnumerable<Project> GetByDeveloper(string Nik);
        GridResponse<User> GetListUserGrid(object entity, string ApiName);
        IEnumerable<ProjectToProject> GetNotifAddCollabProjects(string Nik);
        IEnumerable<ProjectToProject> GetNotifAddCollabProject(string ApiName);
        IEnumerable<ProjectToProject> GetConnectedWith(string ApiName);
        IEnumerable<ProjectToProject> GetConnectingWith(string ApiName);
        IEnumerable<AppRole> GetRoleProject(string ApiName);
        void AddRoleProject(string RoleName, string ApiName);
        void DeleteRoleProject(string Id);
        Task<int> SaveConfigContextAsync();
        Task<IDbContextTransaction> BeginTransactionConfigContextAsync();

        void AddUserToProject(string Nik, string ApiName);
        Task<bool> RemoveUserFromProject(string Nik, string ApiName);
        Task<bool> AddRoleToUserProject(string IdRole, string Nik);
        Task<bool> RemoveRoleFromUserProject(string IdRole, string Nik);
        Task<bool> AddClaimToUserProject(string IdClaim, string Nik);
        Task<bool> RemoveClaimFromUserProject(string IdClaim, string Nik);
        bool checkAvailabilityApiName(string ApiName);
        Task<bool> checkAvailabilityRoleName(string RoleName);
        bool checkAvailabilityClaimName(string ClaimName);
        int GetNumberUser(string ApiName);
        int GetNumberRole(string ApiName);
        int GetNumberClaim(string ApiName);
        int GetNumberFollower(string ApiName);
        GridResponse<ProjectToProject> GetFollowerFilterGrid(object entity, string ApiName);
        int GetNumberFollowing(string ApiName);
        GridResponse<ProjectToProject> GetFollowingFilterGrid(object entity, string ApiName);
        GridResponse<Project> checkAvailabilityFollowing(object entity, string ApiName);
        void CreateClaimProject(string ApiName, string ClaimName);
        void UpdateClaimProject(string id, string claimName);
        void DeleteClaimProject(string id);
        GridResponse<ProjectClaim> GetProjectClaimGrid(object entity, string ApiName);
        GridResponse<AppRole> GetProjectRoleGrid(object entity, string ApiName);
        Task<bool> CreateRoleProject(string ApiName, string RoleName);
        Task<bool> UpdateRoleProject(string id, string RoleName);
        Task<bool> RemoveRoleProject(string id);
        Task<bool> AddClaimToRoleProject(string IdRole, string IdClaim);
        Task<bool> RemoveClaimFromRoleProject(string IdRole, string IdClaim);
        Task<List<ProjectClaim>> getAvailableClaimForRole(string ApiName, string IdRole, string value);
        Task<List<ProjectClaim>> getAvailableClaimForUser(string ApiName, string Nik, string value);
        Task<List<AppRole>> getAvailableRoleForUser(string ApiName, string Nik, string value);
        Task<List<ProjectClaim>> getClaimOfRole(string ApiName, string IdRole);
        Task<List<ProjectClaim>> getClaimOfUser(string ApiName, string Nik);
        Task<List<AppRole>> getRoleOfUser(string ApiName, string Nik);
        GridResponse<User> getAvailableUserProject(object entity, string ApiName);
    }
}
