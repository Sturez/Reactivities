using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Persistence;

namespace Infrastructure.Security
{
    public class IsHostRequirement : IAuthorizationRequirement
    {

    }

    public class IsHostRequirementHandler : AuthorizationHandler<IsHostRequirement>
    {
        private readonly DataContext _dbContext;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public IsHostRequirementHandler(DataContext dbContext, IHttpContextAccessor httpContextAccessor)
        {
            this._dbContext = dbContext ?? throw new ArgumentNullException(nameof(dbContext));
            this._httpContextAccessor = httpContextAccessor ?? throw new ArgumentNullException(nameof(httpContextAccessor));
        }

        protected override Task HandleRequirementAsync(AuthorizationHandlerContext context, IsHostRequirement requirement)
        {
            // get user id
            var userId = context.User.FindFirst(ClaimTypes.NameIdentifier);

            // if userId is null, then the user has no rights to proceed
            if (userId == null) return Task.CompletedTask;

            // get ActivityId from the querystring
            var activityId = Guid.Parse(_httpContextAccessor.HttpContext?.Request.
            RouteValues.SingleOrDefault(x => x.Key == "id").Value?.ToString());

            // get  activity attendees from database
            var attendee = _dbContext.ActivityAttendees.FindAsync(userId.Value, activityId).Result;

            // if attendee is null, then the user has no rights to proceed
            if (attendee == null) return Task.CompletedTask;

            // if the attendee is the host, then the requirement is fullfilled
            if (attendee.IsHost) context.Succeed(requirement);

            return Task.CompletedTask;

        }
    }
}