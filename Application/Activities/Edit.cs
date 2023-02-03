using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Core;
using AutoMapper;
using Domain;
using FluentValidation;
using MediatR;
using Persistence;

namespace Application.Activities
{
    public class Edit
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
        class Handler : IRequestHandler<Command, Result<Unit>>
        {
            private readonly IMapper _mapper;
            private readonly DataContext _dataContext;
            public Handler(DataContext dataContext, IMapper mapper)
            {
                this._mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
                this._dataContext = dataContext ?? throw new ArgumentNullException(nameof(dataContext));
            }

            public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                var activity = await _dataContext.Activities.FindAsync(request.Activity.Id);

                if (activity == null)
                    return null;

                activity = _mapper.Map(request.Activity, activity);

                var result = await _dataContext.SaveChangesAsync() > 0;

                if (!result)
                    Result<Unit>.Faliure("Failed to update activity");

                return Result<Unit>.Success(Unit.Value);
            }
        }
    }
}