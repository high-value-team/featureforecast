using ff.service.data.dto;

namespace ff.service
{
    public class RequestHandler
    {
        public string Create_history(NewHistoryDto history) {
            var histId = "?";
            return histId;
        }

        public HistoryDto Load_history_by_id(string id) {
            var history = new HistoryDto();
            return history;
        }

        public HistoryDto Load_history_by_name(string name) {
            var histId = "gewandelter name";
            return Load_history_by_id(histId);
        }

        public ForecastDto Calculate_forefact(ForecastRequestDto request) {
            return new ForecastDto();
        }
    }
}