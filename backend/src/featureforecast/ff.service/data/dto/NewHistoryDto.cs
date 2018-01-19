namespace ff.service.data.dto
{
    public class NewHistoryDto {
        public string Id;
        public string Name;
        public string Email;
        public DatapointDto[] HistoricalData;
        public string HistoricalDataToParse;
    }
}