using Application.Core;
using Application.Interfaces;
using Domain;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Activities
{
    public class Create
    {
        public class Command : IRequest<Result<Unit>>
        {
            public Activity Activity { get; set; }
        }

        public class CommandValidator : AbstractValidator<Command>
        {
            public CommandValidator()
            {
                RuleFor(x => x.Activity).SetValidator(new ActivityValidator());
            }
        }
        public class Handler : IRequestHandler<Command, Result<Unit>>
        {
            private readonly DataContext _dataContext;
            private readonly IUserAccessor _userAccessor;
            public Handler(DataContext dataContext, IUserAccessor userAccessor)
            {
                this._userAccessor = userAccessor ?? throw new ArgumentNullException(nameof(userAccessor));
                this._dataContext = dataContext ?? throw new ArgumentNullException(nameof(dataContext));
            }

            public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                var user = await _dataContext.Users.FirstOrDefaultAsync(
                    x => x.UserName == _userAccessor.GetUsername()
                );

                var attendee = new ActivityAttendee
                {
                    AppUser = user,
                    Activity = request.Activity,
                    IsHost = true
                };

                request.Activity.Attendees.Add(attendee);

                _dataContext.Activities.Add(request.Activity);

                var result = await _dataContext.SaveChangesAsync() > 0;

                if (!result) return Result<Unit>.Faliure("Failed to create activity");

                return Result<Unit>.Success(Unit.Value);
            }
        }

    }
}