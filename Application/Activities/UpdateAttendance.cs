using Application.Core;
using Application.Interfaces;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Activities
{
    public class UpdateAttendance
    {
        public class Command : IRequest<Result<Unit>>
        {
            public Guid Id { get; set; }
        }

        public class Handler : IRequestHandler<Command, Result<Unit>>
        {
            private readonly DataContext _datacontext;
            private readonly IUserAccessor _UserAccessor;
            public Handler(DataContext datacontext, IUserAccessor UserAccessor)
            {
                this._UserAccessor = UserAccessor ?? throw new ArgumentNullException(nameof(UserAccessor));
                this._datacontext = datacontext ?? throw new ArgumentNullException(nameof(datacontext));

            }
            public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                var activity = await _datacontext.Activities
                .Include(att => att.Attendees)
                .ThenInclude(u => u.AppUser)
                .SingleOrDefaultAsync(act => act.Id == request.Id);

                if (activity == null)
                    return null;

                var user = await _datacontext.Users
                                .FirstOrDefaultAsync(u =>
                                u.UserName == _UserAccessor.GetUsername());

                if (user == null)
                    return null;

                var hostUserName = activity.Attendees.FirstOrDefault(h => h.IsHost)?.AppUser?.UserName;

                var attendance = activity.Attendees.FirstOrDefault(attendee => attendee.AppUser.UserName == user.UserName);

                // if the user making the request is the host, 
                // i should toggle the stauts of the event (if the host leaves, 
                // then is cancelled, if the host joins, the event is going)
                if (attendance != null && hostUserName == user.UserName)
                {
                    activity.Cancelled = !activity.Cancelled;
                }
                // if the user making the request is normal attendee, 
                // i should remove it from the attendee list
                if (attendance != null && hostUserName != user.UserName)
                {
                    activity.Attendees.Remove(attendance);
                }

                // if no attendance, the user is joining the activity and I need to 
                // create a new attendance empty object
                if (attendance == null)
                {
                    attendance = new ActivityAttendee
                    {
                        Activity = activity,
                        AppUser = user,
                        IsHost = false
                    };

                    activity.Attendees.Add(attendance);
                }

                var result = await _datacontext.SaveChangesAsync() > 0;

                return result ? Result<Unit>.Success(Unit.Value) : Result<Unit>.Faliure("Failed to change activity attendance");


            }
        }
    }
}