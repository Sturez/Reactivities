using MediatR;
using Domain;
using Persistence;
using Microsoft.EntityFrameworkCore;
using Application.Core;
using AutoMapper;

namespace Application.Activities
{
    public class List
    {
        public class Query : IRequest<Result<IEnumerable<ActivityDto>>> { }

        public class Handler : IRequestHandler<Query, Result<IEnumerable<ActivityDto>>>
        {
            private readonly DataContext _context;
            private readonly IMapper _mapper;

            public Handler(DataContext context, IMapper mapper)
            {
                this._context = context ?? throw new ArgumentNullException(nameof(context));
                this._mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
            }

            public async Task<Result<IEnumerable<ActivityDto>>> Handle(Query request, CancellationToken cancellationToken)
            {
                var activities = await _context.Activities
                .Include(a => a.Attendees)
                .ThenInclude(u => u.AppUser)
                .ToListAsync();

                var activitiesToReturn = _mapper.Map<IEnumerable<ActivityDto>>(activities);

                return Result<IEnumerable<ActivityDto>>.Success(activitiesToReturn);
            }
        }
    }
}