using CentralAuth.Commons.Models;
using CentralAuth.Datas;
using IdentityServer4.Extensions;
using IdentityServer4.Models;
using IdentityServer4.Services;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace CentralAuth.Commons.IdentityServerModels
{
    public class CustomProfileService : IProfileService
    {

        private AppDbContext _context;
        private UserManager<AppUser> _userManager;
        private SignInManager<AppUser> _signInManager;
        private RoleManager<AppRole> _roleManager;
        public CustomProfileService(AppDbContext context, UserManager<AppUser> userManager, SignInManager<AppUser> signInManager, RoleManager<AppRole> roleManager)
        {
            _context = context;
            _userManager = userManager;
            _signInManager = signInManager;
            _roleManager = roleManager;
        }
        public async Task GetProfileDataAsync(ProfileDataRequestContext context)
        {
            var sub = context.Subject.GetSubjectId();

            var user = await _userManager.FindByIdAsync(context.Subject.GetSubjectId());

            var claimsIdentity = await this.getClaimsUserFromIdentityAsync(
                                        user, 
                                        context.Client.AllowedScopes.ToList(), 
                                        context.RequestedResources.IdentityResources.Select(x => x.Name).ToList()
                                    );

            var claimsApi = await this.getClaimsUserFromApiAsync(
                                        user,
                                        context.Client.AllowedScopes.ToList(),
                                        context.RequestedResources.ApiResources.Select(x => x.Name).ToList()
                                    );
            var claims = claimsIdentity.Concat(claimsApi).ToList();
            context.IssuedClaims = claims;
        }

        public async Task IsActiveAsync(IsActiveContext context)
        {
            var sub = context.Subject.GetSubjectId();
            var user = await _userManager.FindByIdAsync(context.Subject.GetSubjectId());
            context.IsActive = user != null;
        }

        private async Task<List<Claim>> getClaimsUserFromIdentityAsync(AppUser user, List<string> allowedscopes, List<string> requestedscopes)
        {
            
            var claims = new List<Claim>{ new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()) };
            if (requestedscopes.Contains("email"))
            {
                claims.Add(new Claim(ClaimTypes.Email, user.Email));
            }
            if (requestedscopes.Contains("profile"))
            {
                claims.Add(new Claim(ClaimTypes.GivenName, user.UserName));
                claims.Add(new Claim(ClaimTypes.NameIdentifier, user.Id));
            }
            
            return claims;
        }

        private async Task<List<Claim>> getClaimsUserFromApiAsync(AppUser user, List<string> allowedscopes, List<string> requestedscopes)
        {

            var claims = new List<Claim> { new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()) };
            var roles = await _userManager.GetRolesAsync(user);
            roles = roles.Where(x => x.Contains(":="))
                            .Where(x => requestedscopes.Contains(x.Split(":=")[0]))
                            .ToList();
            foreach (var r in roles)
            {
                claims.Add(new Claim(ClaimTypes.Role, r));
                var userClaims = await _roleManager.GetClaimsAsync(await _roleManager.FindByNameAsync(r));
                foreach(var c in userClaims)
                {
                    claims.Add(c);
                }
            }
            return claims;
        }
    }
}
