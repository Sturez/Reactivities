using MediatR;
using Domain;
using Persistence;
using Microsoft.EntityFrameworkCore;

namespace Application.Activities
{
    public class List
    {
        public class Query : IRequest<IEnumerable<Activity>> { }

        public class Handler : IRequestHandler<Query, IEnumerable<Activity>>
        {
            private readonly DataContext _context;

            public Handler(DataContext context)
            {
                this._context = context ?? throw new ArgumentNullException(nameof(context));
            }

            public async Task<IEnumerable<Activity>> Handle(Query request, CancellationToken cancellationToken)
            {
                return await _context.Activities.ToListAsync();
            }
        }
    }
}