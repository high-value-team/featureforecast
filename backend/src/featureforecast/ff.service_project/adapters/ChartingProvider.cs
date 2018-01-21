using System;

namespace ff.service
{
    public class ChartingProvider
    {
        private readonly string _path;
        
        public ChartingProvider(string path) { _path = path; }
        
        
        // returns image file path
        public string Draw_distribution(string historyId, Forecast forecast)
        {
            // TODO: Chart malen
            throw new NotImplementedException();
        }
    }
}