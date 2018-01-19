using System;
using System.IO;
using System.Linq;
using System.Web.Script.Serialization;
using ff.service.data;

namespace ff.service.adapters
{
    internal class HistoryRepository
    {
        private readonly string _path;
        private readonly JavaScriptSerializer _json;

        public HistoryRepository(string path) {
            _path = path; 
            _json = new JavaScriptSerializer();
        }
        
        
        public string Store_history(History history) {
            if (string.IsNullOrEmpty(history.Id)) history.Id = Guid.NewGuid().ToString();

            var historyJson = _json.Serialize(history);
            var filepath = new Filepath(_path, history.Id, history.Name);
            File.WriteAllText(filepath.Value, historyJson);
            
            return history.Id;
        }

        public History Load_history_by_id(string id) {
            var filepaths = Directory.GetFiles(_path);
            var filepath = filepaths.FirstOrDefault(fp => Filepath.Matches_id(fp, id));
            if (filepath == null) throw new ApplicationException($"Invalid history id '{id}'!");

            var historyJson = File.ReadAllText(filepath);
            return _json.Deserialize<History>(historyJson);
        }

        
        public string Map_name_to_id(string name)
        {
            return "123";
        }


        private class Filepath {
            private readonly string _path;
            private readonly string _id;
            private readonly string _name;

            public Filepath(string path, string id, string name) {
                _path = path;
                _id = id;
                _name = name;
            }

            public string Value => Path.Combine(_path, $"{_id}--{_name}.json");

            public static bool Matches_id(string filepath, string id) {
                var filename = Path.GetFileName(filepath);
                return filename.StartsWith($"{id}--");
            }
        }
    }
}