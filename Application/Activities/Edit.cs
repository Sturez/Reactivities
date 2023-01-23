using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Domain;
using MediatR;
using Persistence;

namespace Application.Activities
{
    public class Edit
    {
        public class Command : IRequest
        {
            public Activity Activity { get; set; }
        }

        class Handler : IRequestHandler<Command>
        {
            private readonly IMapper _mapper;
            private readonly DataContext _dataContext;
            public Handler(DataContext dataContext, IMapper mapper)
            {
                this._mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
                this._dataContext = dataContext ?? throw new ArgumentNullException(nameof(dataContext));
            }

            public async Task<Unit> Handle(Command request, CancellationToken cancellationToken)
            {
                var activity = await _dataContext.Activities.FindAsync(request.Activity.Id);

                activity = _mapper.Map(request.Activity, activity);

                await _dataContext.SaveChangesAsync();

                return Unit.Value;
            }
        }
    }
}