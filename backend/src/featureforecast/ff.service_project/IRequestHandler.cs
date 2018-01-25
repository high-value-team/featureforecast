using ff.service.data.dto;

namespace ff.service
{
    public interface IRequestHandler
    {
        string Create_history(NewHistoryDto newhistory);
        HistoryDto Load_history_by_id(string id);
        HistoryDto Load_history_by_name(string name);
        ForecastDto Calculate_forecast(ForecastRequestDto request);
    }
}