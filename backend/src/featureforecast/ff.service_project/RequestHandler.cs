using System;
using System.Linq;
using ff.service.adapters;
using ff.service.data;
using ff.service.data.dto;

namespace ff.service
{
    public class RequestHandler
    {
        private const int EXPIRATION_PERIOD_DAYS = 7;
        
        private readonly HistoryRepository _repo;
        private readonly ChartingProvider _chart;
        
        public RequestHandler(HistoryRepository repo, ChartingProvider chart) {
            _repo = repo;
            _chart = chart;
        }
        
        
        public string Create_history(NewHistoryDto newhistory)
        {
            var history = new History {
                Id = newhistory.Id,
                Email = newhistory.Email,
                Name = newhistory.Name,
                HistoricalData = newhistory.HistoricalData.Select(d => new History.Datapoint{Value=d.Value, Tags=d.Tags}).ToArray(),
                LastUsed = DateTime.Now.ToUniversalTime()
            };
            return _repo.Store_history(history);
        }

        
        public HistoryDto Load_history_by_id(string id) {
            var history = _repo.Load_history_by_id(id);
            return new HistoryDto {
                ExpirationDate = Calculate_expiration_date(history.LastUsed),
                
                Id = history.Id,
                Email = history.Email,
                Name = history.Name,
                HistoricalData = history.HistoricalData.Select(d => new DatapointDto{Value=d.Value,Tags = d.Tags}).ToArray()
            };
        }
        
        private DateTime Calculate_expiration_date(DateTime lastUsed) {
            return lastUsed.AddDays(EXPIRATION_PERIOD_DAYS);
        }

        
        public HistoryDto Load_history_by_name(string name) {
            var histId = _repo.Map_name_to_id(name);
            return Load_history_by_id(histId);
        }

        
        public ForecastDto Calculate_forecast(ForecastRequestDto request) {
            var history = _repo.Load_history_by_id(request.Id);
            var forecast = Forecasting.Calculate(history.HistoricalData, Map_features(request.Features));
            var imageFilepath = _chart.Draw_distribution(history.Id, forecast);
            Update_lastused(history);

            return new ForecastDto {
                Id = history.Id,
                Distribution = forecast.Distribution.Select(d => new ForecastDto.PossibleOutcomeDto{Value = d.Value, Probability = d.Probability}).ToArray(),
                DistributionImageUrl = imageFilepath
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