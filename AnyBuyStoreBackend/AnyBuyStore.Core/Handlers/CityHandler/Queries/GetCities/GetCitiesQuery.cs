﻿using AnyBuyStore.Data.Data;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace AnyBuyStore.Core.Handlers.AddressHandler.Queries.GetCities
{
    public class GetCitiesQuery : IRequest<IEnumerable<CityModel>>
    {

        public class GetCitiesHandler : IRequestHandler<GetCitiesQuery, IEnumerable<CityModel>>
        {
            private readonly DatabaseContext _context;
            public GetCitiesHandler(DatabaseContext context)
            {
                _context = context;
            }
            public async Task<IEnumerable<CityModel>> Handle(GetCitiesQuery request, CancellationToken cancellationToken)
            {
                var data = await _context.Cities.Include(a => a.States).ToListAsync();

                var getData = new List<CityModel>();

                {
                    foreach (var vals in data)
                    {
                        getData.Add(new CityModel()
                        {
                            Id = vals.Id,
                            StateId = vals.StateId,
                            Name = vals.Name,
                            StateName = vals.States.Name

                        });
                    }
                }
                return getData;
            }
        }
    }
    public class CityModel
    {
        public int Id { get; set; }
        public int StateId { get; set; }
        public string Name { get; set; } = string.Empty;
        public string? StateName { get; set; }

    }

}




