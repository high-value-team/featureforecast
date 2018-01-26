using System;
using ff.server.adapters;
using ff.service;
using ff.service.adapters;

namespace ff.server
{
    internal class Program
    {
        public static void Main(string[] args) {
            //TODO: GC abgelaufener Histories
            Config.Load(args);
            Console.WriteLine($"ff.server Version {Config.Version}, db path: {Config.DbPath}");
            
            var repo =new HistoryRepository(Config.DbPath);
            var rh = new RequestHandler(repo);
            var server = new Server(rh);
            
            server.Run(Config.Address);
        }
    }
}