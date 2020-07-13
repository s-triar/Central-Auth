using CentralAuth.Datas;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SpaServices.AngularCli;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using System;
using Pomelo.EntityFrameworkCore;
using CentralAuth.Commons.Models;
using Microsoft.AspNetCore.Identity;
using System.Security.Cryptography.X509Certificates;
using System.IO;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using CentralAuth.Commons.Constants;
using CentralAuth.Commons.IdentityServerModels;
using CentralAuth.Commons.Services;
using CentralAuth.Commons.Interfaces;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;
using System.Reflection;
using System.Runtime.ConstrainedExecution;
using IdentityServer4.Validation;
using IdentityServer4.Services;
using Microsoft.AspNetCore.ResponseCompression;

namespace CentralAuth
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {


            services.AddDbContext<AppDbContext>(config =>
            {
                config.UseMySql(Configuration.GetConnectionString("DefaultConnection"));
            });
            services.AddIdentity<AppUser, AppRole>(options =>
            {
                options.Password.RequireDigit = false;
                options.Password.RequiredLength = 3;
                options.Password.RequiredUniqueChars = 0;
                options.Password.RequireLowercase = true;
                options.Password.RequireNonAlphanumeric = false;
                options.Password.RequireUppercase = false;
            })
            .AddEntityFrameworkStores<AppDbContext>()
            .AddDefaultTokenProviders();

            var builder =  services.AddIdentityServer()
                    .AddEFConfigurationStore(Configuration.GetConnectionString("DefaultConnection"))
                    .AddConfigurationStore(options =>
                    {
                        options.ConfigureDbContext = b => b.UseMySql(Configuration.GetConnectionString("DefaultConnection"));
                    })
                    .AddOperationalStore(options =>
                    {
                        options.ConfigureDbContext = b => b.UseMySql(Configuration.GetConnectionString("DefaultConnection"));
                    })
                    .AddAspNetIdentity<AppUser>()
                    //.AddInMemoryApiResources(IdentityServerConfiguration.GetApis())
                    //.AddInMemoryClients(IdentityServerConfiguration.GetClients())
                    .AddJwtBearerClientAuthentication()
                    .AddResourceOwnerValidator<CustomResourceOwnerPasswordValidator>()
                    .AddProfileService<CustomProfileService>()
                    ;

            X509Certificate2 certif = GetCertificate();
            if(certif == null)
            {
                builder.AddDeveloperSigningCredential(); // jika nggak maka pake sertifikat;
            }
            else
            {
                builder.AddSigningCredential(certif);
            }

            JwtConfig jwtConfig = Configuration.GetSection("Jwt").Get<JwtConfig>();
            services.AddAuthentication(config =>
                    {
                        config.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                        config.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
                        config.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
                    })
                    .AddJwtBearer(options =>
                    {
                        options.RequireHttpsMetadata = false;
                        options.SaveToken = true;
                        options.TokenValidationParameters = new TokenValidationParameters
                        {
                            ValidateIssuer = true,
                            ValidateAudience = true,
                            ValidateLifetime = true,
                            ValidateIssuerSigningKey = true,
                            ValidIssuer = jwtConfig.Issuer,
                            ValidAudience = jwtConfig.Audience,
                            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtConfig.SecretKey)),
                            ClockSkew = TimeSpan.Zero
                        };
                    });

            services.AddResponseCompression(c =>
            {
                c.EnableForHttps = true;
                c.Providers.Add<GzipCompressionProvider>();
            });

            services.AddMvc().SetCompatibilityVersion(CompatibilityVersion.Version_2_2);

            // In production, the Angular files will be served from this directory
            services.AddSpaStaticFiles(configuration =>
            {
                configuration.RootPath = "ClientApp/dist";
            });




            JsonConvert.DefaultSettings = () => new JsonSerializerSettings
            {
                ContractResolver = new CamelCasePropertyNamesContractResolver()
            };

            services.AddHttpContextAccessor();
            // Custom resource owner password validator
            //builder.Services.AddTransient<IResourceOwnerPasswordValidator, CustomResourceOwnerPasswordValidator>();
            //builder.Services.AddTransient<IProfileService, CustomProfileService>();

            services.AddScoped<IUtilityService, UtilityService>();
            services.AddScoped<ISubDepartmentService, SubDepartmentService>();
            services.AddScoped<IDepartmentService, DepartmentService>();
            services.AddScoped<IDirectorateService, DirectorateService>();
            services.AddScoped<IBranchService, BranchService>();
            services.AddScoped<IUnitService, UnitService>();
            services.AddScoped<IUserService, UserService>();
            services.AddScoped<IProjectService, ProjectService>();


        }

        public X509Certificate2 GetCertificate()
        {
            X509Certificate2 certificate = null;

            // Load certificate from Certificate Store using the configured Thumbprint
            using (X509Store store = new X509Store(StoreName.My, StoreLocation.LocalMachine))
            {
                store.Open(OpenFlags.ReadOnly);
                X509Certificate2Collection certificates = store.Certificates.Find(X509FindType.FindByThumbprint, Configuration.GetSection("Certificate").GetSection("Thumbprint").Value, false);

                if (certificates.Count > 0)
                    certificate = certificates[0];
            }

            // Fallback to load certificate from local file
            if (certificate == null)
            {
                string path = Path.Combine(Configuration.GetSection("Certificate").GetSection("PathFile").Value);

                try
                {
                    certificate = new X509Certificate2(path, "qweasd");
                }
                catch (Exception ex)
                {
                    certificate = null;
                }
            }

            if (certificate == null)
                throw new Exception($"Certificate {Configuration.GetSection("Certificate").GetSection("Thumbprint").Value} not found.");

            return certificate;
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseExceptionHandler("/Error");
                // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
                app.UseHsts();
            }
            app.UseResponseCompression();
            app.UseHttpsRedirection();
            app.UseStaticFiles();
            app.UseSpaStaticFiles();
            //app.UseAuthentication();
            app.UseIdentityServer();

            app.UseMvc(routes =>
            {
                routes.MapRoute(
                    name: "default",
                    template: "{controller}/{action=Index}/{id?}");
            });

            app.UseSpa(spa =>
            {
                // To learn more about options for serving an Angular SPA from ASP.NET Core,
                // see https://go.microsoft.com/fwlink/?linkid=864501

                spa.Options.SourcePath = "ClientApp";

                if (env.IsDevelopment())
                {
                    spa.Options.StartupTimeout = new TimeSpan(days: 0, hours: 0, minutes: 1, seconds: 30);
                    //spa.UseAngularCliServer(npmScript: "start");
                    spa.UseProxyToSpaDevelopmentServer("http://localhost:4200");
                }
            });
        }
    }
}
