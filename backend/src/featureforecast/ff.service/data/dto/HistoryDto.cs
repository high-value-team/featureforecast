using System;

namespace ff.service.data.dto
{
    public class HistoryDto {
        public string Id;
        public string Name;
        public string Email;
        public DatapointDto[] HistoricalData;
        public DateTime ExpirationDate;
    }
}