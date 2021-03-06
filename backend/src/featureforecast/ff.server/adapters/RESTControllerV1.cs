﻿using System;
using System.Linq;
using System.Reflection;
using ff.service;
using ff.service.data.dto;
using servicehost.contract;

namespace ff.server.adapters
{
    [Service]
    public class RESTControllerV1
    {
        public static Func<IRequestHandler> __RequestHandler;
        
        
        [EntryPoint(HttpMethods.Post, "/api/v1/histories")]
        public string Create_history([Payload]NewHistoryDto newhistory) {
            Console.WriteLine($"create history: {newhistory.Id}, {newhistory.Name}, {newhistory.Email}, historical data: {newhistory.HistoricalData.Length}");
            
            return __RequestHandler().Create_history(newhistory);
        }

        
        [EntryPoint(HttpMethods.Get, "/api/v1/histories/{historyId}")]
        public HistoryDto Load_history_by_id(string historyId) {
            Console.WriteLine($"load history {historyId}");
            
            return __RequestHandler().Load_history_by_id(historyId);
        }

        
        [EntryPoint(HttpMethods.Get, "/api/v1/histories")] // ?name=myhistory
        public HistoryDto Load_history_by_name(string name) {
            Console.WriteLine($"load history by name: {name}");
            
            return __RequestHandler().Load_history_by_name(name);
        }


        [EntryPoint(HttpMethods.Get, "/api/v1/histories/{historyId}/forecast")]
        public ForecastDto Calculate_forecast(string historyId, FeatureDto[] features) {
            Console.WriteLine($"calculate forecast for {historyId} with {features.Length} features");

            return __RequestHandler().Calculate_forecast(historyId, features);
        }
        
        
        [EntryPoint(HttpMethods.Get, "/api/v1/version")]
        public VersionDto Version() {
            return new VersionDto {
                Timestamp = DateTime.Now,
                Number = Config.Version,
                DbPath = Config.DbPath
            };
        }

        public class VersionDto {
            public DateTime Timestamp;
            public string Number;
            public string DbPath;
        }
    }
}