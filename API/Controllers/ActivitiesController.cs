using Domain;
using Persistence;
using Application.Activities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    [ApiController]
    [Route("api/activities")]
    public class ActivitiesController : BaseApiController
    {

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Activity>>> GetActivities()
        {
            var activitiesToReturn = await Mediator.Send(new List.Query());
            return Ok(activitiesToReturn);
        }

        [HttpGet("{Id}", Name = "GetActivity")]
        public async Task<ActionResult<Activity>> GetActivity(Guid Id)
        {
            var activityToReturn = await Mediator.Send(new Details.Query { Id = Id });
            return Ok(activityToReturn);
        }

        [HttpPost]
        public async Task<IActionResult> SetActivity(Activity activity)
        {
            await Mediator.Send(new Create.Command { Activity = activity });

            return CreatedAtRoute("GetActivity", new { Id = activity.Id }, activity);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateActivity(Guid id, Activity activity)
        {
            activity.Id = id;
            await Mediator.Send(new Edit.Command { Activity = activity });

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteActivity(Guid id)
        {
            await Mediator.Send(new Delete.Command { Id = id });
            return NoContent();
        }
    }
}