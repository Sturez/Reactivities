using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Activities;
using Application.Core;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace API.Extensions
{
    public static class ApplicationServiceExtensions
    {
        public static IServiceCollection AddApplicationServices(this IServiceCollection Services, IConfiguration Configuration)
        {
            // using AppDomain.CurrentDomain.GetAssemblies() allow the app to get automatically all the assemblies 
            Services.AddAutoMapper(typeof(MappingProfiles).Assembly);

            Services.AddDbContext<DataContext>(opt =>
            {
                opt.UseSqlite(Configuration.GetConnectionString("DefaultConnection"));
            });


            Services.AddCors(opt =>
            {
                opt.AddPolicy("ReactApp_CorsPolicy", policy =>
                {
                    policy.AllowAnyMethod()
                          .AllowAnyHeader()
                          .WithOrigins("http://localhost:3000");
                });
            });

            Services.AddMediatR(typeof(List.Handler));

            return Services;

        }
    }
}