using System;

namespace ff.service.data
{
    public class History {
        public string Id;
        public string Name;
        public string Email;
        public Datapoint[] HistoricalData;
        public DateTime LastUsed;

        public class Datapoint {
            public float Value;
            public string[] Tags;
        }
    }
}