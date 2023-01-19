using Domain;
using Persistence;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    [ApiController]
    [Route("api/activities")]
    public class ActivitiesController : BaseApiController
    {
        private readonly DataContext _context;
        public ActivitiesController(DataContext context)
        {
            this._context = context ?? throw new ArgumentNullException(nameof(context));

        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Activity>>> GetActivities()
        {
            var activitiesToReturn = await _context.Activities.ToListAsync();
            return Ok(activitiesToReturn);
        }

        [HttpGet("{Id}", Name = "GetActivity")]
        public async Task<ActionResult<Activity>> GetActivity(Guid Id)
        {
            var activityToReturn = await _context.Activities.FirstOrDefaultAsync(a => a.Id == Id);
            
            if(activityToReturn==null)
                return NotFound();

            return Ok(activityToReturn);
        }
    }
}