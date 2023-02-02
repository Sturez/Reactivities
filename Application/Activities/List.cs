using MediatR;
using Domain;
using Persistence;
using Microsoft.EntityFrameworkCore;
using Application.Core;

namespace Application.Activities
{
    public class List
    {
        public class Query : IRequest<Result<IEnumerable<Activity>>> { }

        public class Handler : IRequestHandler<Query, Result<IEnumerable<Activity>>>
        {
            private readonly DataContext _context;

            public Handler(DataContext context)
            {
                this._context = context ?? throw new ArgumentNullException(nameof(context));
            }

            public async Task<Result<IEnumerable<Activity>>> Handle(Query request, CancellationToken cancellationToken)
            {
                return Result<IEnumerable<Activity>>.Success(await _context.Activities.ToListAsync());
            }
        }
    }
}