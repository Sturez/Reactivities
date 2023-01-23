using Microsoft.EntityFrameworkCore;
using Persistence;
using API.Extensions;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddApplicationServices(builder.Configuration);

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("ReactApp_CorsPolicy");

app.UseAuthorization();

app.MapControllers();

// creating a scope (like when the WS is being invoked) to perform an operation.
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    try
    {
        var context = services.GetRequiredService<DataContext>();
        // await context.Database.EnsureCreatedAsync();
        await context.Database.MigrateAsync();
        await Seed.SeedData(context);
    }
    catch (System.Exception ex)
    {
        var logger = services.GetRequiredService<ILogger>();
        logger.LogError(ex, "An error occurred while migrating");
    }
}
app.Run();
