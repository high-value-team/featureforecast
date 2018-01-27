using System;
using ff.server.adapters;
using ff.service;
using ff.service.adapters;

namespace ff.server
{
    internal class Program
    {
        public static void Main(string[] args) {
            Config.Load(args);
            Console.WriteLine($"ff.server Version {Config.Version}, db path: {Config.DbPath}");
            
            var repo =new HistoryRepository(Config.DbPath);
            var rh = new RequestHandler(repo);
            var server = new Server(rh);

            using (new PeriodicGarbageCollection(repo.Delete_expired_histories)) {
                server.Run(Config.Address);
            }
        }
    }
}