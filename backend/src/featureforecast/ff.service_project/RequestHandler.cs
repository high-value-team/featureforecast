﻿using System;
using System.Linq;
using System.Web.Query.Dynamic;
using ff.service.adapters;
using ff.service.core;
using ff.service.data;
using ff.service.data.dto;

namespace ff.service
{
    public class RequestHandler : IRequestHandler
    {

        
        private readonly HistoryRepository _repo;
        private readonly Forecasting _forecasting;

        public RequestHandler(HistoryRepository repo)
            : this(repo, new Forecasting(new MonteCarloSimulation())){}
        internal RequestHandler(HistoryRepository repo, Forecasting forecasting) {
            _repo = repo;
            _forecasting = forecasting;
        }
        
        
        public string Create_history(NewHistoryDto newhistory)
        {
            var parsedData = HistoricalCsvDataParser.Parse(newhistory.HistoricalDataToParse);
            
            var history = new History {
                Id = newhistory.Id,
                Email = newhistory.Email,
                Name = newhistory.Name,
                HistoricalData = newhistory.HistoricalData.Select(d => new History.Datapoint{Value=d.Value, Tags=d.Tags})
                                           .Concat(parsedData)
                                           .ToArray(),
                LastUsed = DateTime.Now.ToUniversalTime()
            };
            return _repo.Store_history(history);
        }

        
        public HistoryDto Load_history_by_id(string id) {
            var history = _repo.Load_history_by_id(id);
            return new HistoryDto {
                ExpirationDate = _repo.Calculate_expiration_date(history.LastUsed),
                
                Id = history.Id,
                Email = history.Email,
                Name = history.Name,
                HistoricalData = history.HistoricalData.Select(d => new DatapointDto{Value=d.Value,Tags = d.Tags}).ToArray()
            };
        }
        

        public HistoryDto Load_history_by_name(string name) {
            var histId = _repo.Map_name_to_id(name);
            return Load_history_by_id(histId);
        }

        
        public ForecastDto Calculate_forecast(string historyId, ForecastRequestDto request) {
            var history = _repo.Load_history_by_id(historyId);
            Update_lastused(history);
            
            var forecast = _forecasting.Calculate(history.HistoricalData, Map_features(request.Features));

            return new ForecastDto {
                Id = history.Id,
                Distribution = forecast.Distribution.Select(d => new ForecastDto.PossibleOutcomeDto {
                                                                            Prognosis = d.Prognosis, 
                                                                            Count = d.Count,
                                                                            CummulatedProbability = d.CummulatedProbability
                                                                        }).ToArray(),
            };

            
            Feature[] Map_features(ForecastRequestDto.FeatureDto[] features)
                => features.Select(f => new Feature {Tags = f.Tags, Quantity = f.Quantity}).ToArray();
            
            void Update_lastused(History h) {
                h.LastUsed = DateTime.Now.ToUniversalTime();
                _repo.Store_history(h);
            }
        }
    }
}